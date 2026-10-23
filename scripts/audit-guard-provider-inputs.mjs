// Read-only compatibility probe. Supply a pinned copy of Guard's real CSV reader
// and public/authorized billing files. This does not edit or deploy the app.
import { readFile } from 'node:fs/promises';
import { resolve, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const [readerPath, ...files] = process.argv.slice(2);
if (!readerPath || !files.length) {
  throw new Error('Usage: node scripts/audit-guard-provider-inputs.mjs /path/to/guard-csv.mjs /path/to/public-billing.csv [...]');
}
const readerBytes = await readFile(readerPath);
const { normalizeCsv, parseCsv, readBillingFiles } = await import(pathToFileURL(resolve(readerPath)).href);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const csvLine = cells => cells.map(cell => `"${cell.replaceAll('"', '""')}"`).join(',');
const trial = (text, name) => {
  try { return { status: 'accepted', rows: normalizeCsv(text, name).rows.length }; }
  catch (error) { return { status: 'blocked', error: error.message }; }
};
const reason = result => result.status === 'accepted' ? 'accepted' : result.error.replace(/^record.csv, line 2: /, '');
const increment = (counts, key) => { counts[key] = (counts[key] || 0) + 1; };
const results = [];
for (const path of files) {
  const bytes = await readFile(path);
  const name = basename(path);
  const result = { name, bytes: bytes.length, sha256: hash(bytes) };
  try {
    const parsed = await readBillingFiles([new File([bytes], name)]);
    result.uploadReader = { status: 'accepted', rows: parsed.reduce((sum, file) => sum + file.rows.length, 0) };
  } catch (error) { result.uploadReader = { status: 'blocked', error: error.message }; }
  if (!name.toLowerCase().endsWith('.csv')) { results.push(result); continue; }
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  const parsed = parseCsv(text), header = parsed[0].cells;
  result.records = parsed.length - 1;
  const costIndex = header.indexOf('BilledCost'), providerIndex = header.indexOf('ProviderName');
  // Native layouts with other headers are reported by the actual upload reader.
  if (costIndex < 0 || providerIndex < 0) { results.push(result); continue; }
  result.byProvider = {};
  for (const record of parsed.slice(1)) {
    const provider = record.cells[providerIndex];
    const counts = result.byProvider[provider] ??= { rows: 0, original: {}, losslessCostTrimDiagnostic: {} };
    counts.rows += 1;
    const original = `${csvLine(header)}\n${csvLine(record.cells)}\n`;
    increment(counts.original, reason(trial(original, 'record.csv')));
    const trimmed = [...record.cells];
    // This diagnostic removes ONLY trailing fractional zeros. It never rounds
    // a nonzero digit, changes dates, or establishes a supported product path.
    if (/^-?\d+\.\d+$/.test(trimmed[costIndex])) {
      trimmed[costIndex] = trimmed[costIndex].replace(/0+$/, '').replace(/\.$/, '');
    }
    increment(counts.losslessCostTrimDiagnostic, reason(trial(`${csvLine(header)}\n${csvLine(trimmed)}\n`, 'record.csv')));
  }
  results.push(result);
}
console.log(JSON.stringify({
  readerSha256: hash(readerBytes),
  readerGitBlob: createHash('sha1').update(`blob ${readerBytes.length}\0`).update(readerBytes).digest('hex'),
  note: 'Unmodified file checks use the real upload reader. Cost trimming is an isolated diagnostic, not a product fix or native-import pass. No timezone is inferred.',
  results,
}, null, 2));

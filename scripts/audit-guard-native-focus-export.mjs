// Read-only probe of an authorized/public FOCUS CSV using Guard's actual reader
// and native producer pipeline. No downloads, uploads, app edits or deployments.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { resolve, join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const [guardPath, python, sourcePath] = process.argv.slice(2);
if (!guardPath || !python || !sourcePath) throw new Error('Usage: node scripts/audit-guard-native-focus-export.mjs /path/to/guard /path/to/python /path/to/public-focus.csv');
if (!/\.csv$/i.test(sourcePath)) throw new Error('This probe expects an uncompressed FOCUS CSV. Extract Gzip first without changing its CSV contents.');
const guard = resolve(guardPath), bytes = await readFile(sourcePath);
const readerBytes = await readFile(join(guard, 'frontend/src/lib/billing/csv.js'));
const folder = await mkdtemp(join(tmpdir(), 'guard-focus-reader-'));
try {
  const reader = join(folder, 'reader.mjs');
  await writeFile(reader, readerBytes);
  const { readBillingFiles } = await import(pathToFileURL(reader).href);
  const files = await readBillingFiles([new File([bytes], basename(sourcePath))]);
  assert.equal(files.length, 1);
  assert.equal(createHash('sha256').update(files[0].text).digest('hex'), createHash('sha256').update(bytes).digest('hex'));
  const code = `
import csv,io,json,sys,hashlib
from decimal import Decimal,localcontext
sys.path.insert(0,sys.argv[1])
from tech_spend_command_center.billing import run_billing_pipeline
data=json.load(sys.stdin);text=data['current'][0]['text']
records=list(csv.DictReader(io.StringIO(text.lstrip('\\ufeff'),newline='')))
with localcontext() as context:
 context.prec=60
 amounts=[Decimal(row['BilledCost']) for row in records]
 expected={'net':format(sum(amounts),'f'),'charges':format(sum(x for x in amounts if x>0),'f'),'credits':format(sum(x for x in amounts if x<0),'f')}
bundle=run_billing_pipeline(data);view=bundle['presentation']['current']
assert len(records)==len(view['rows'])
assert all(Decimal(view[key])==Decimal(value) for key,value in expected.items())
source=json.loads(bundle['files']['finops-lite.json'])
assert source['inputs'][0]['content_sha256']==hashlib.sha256(text.encode()).hexdigest()
print(json.dumps({'independent':expected,'pipeline':{key:view[key] for key in ['net','charges','credits','currency','start','end','sourceRowCount','identicalRows']},'countedRecords':len(view['rows']),'sourceHash':source['inputs'][0]['content_sha256'],'status':bundle['status']}))
`;
  const payload = { current: files.map(({name,text}) => ({name,text})), run_id:'7e5f2340-60aa-46e6-a7dd-66ed33854d03',generated_at:'2026-10-23T00:00:00Z' };
  const result = JSON.parse(execFileSync(python, ['-c', code, join(guard, 'pipeline/vendor')], {input:JSON.stringify(payload),encoding:'utf8',maxBuffer:16*1024*1024,timeout:120000}));
  assert.equal(result.countedRecords, files[0].rows.length);
  console.log(JSON.stringify({readerSha256:createHash('sha256').update(readerBytes).digest('hex'),sourceBytes:bytes.length,preflightRecords:files[0].rows.length,sourcePins:JSON.parse(await readFile(join(guard,'pipeline/sources.lock.json'),'utf8')).sources.map(({repository,revision,uncommitted})=>({repository,revision,uncommitted})),...result},null,2));
} finally { await rm(folder, {recursive:true,force:true}); }

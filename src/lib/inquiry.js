export function createInquiryMailto(kind, values) {
  const subject = kind === 'learning' ? 'Investing and trading lesson inquiry' : 'Cloud & Capital business inquiry';
  const labels = { name: 'Name', email: 'Reply email', role: 'Business / role', question: kind === 'learning' ? 'Topic and learning goal' : 'Question or recurring task', tools: kind === 'learning' ? 'Current knowledge / tools' : 'Current tools', frequency: 'Frequency / consequence', timing: 'Preferred timing', budget: 'Budget' };
  const body = Object.entries(labels).filter(([key]) => String(values[key] ?? '').trim()).map(([key, label]) => `${label}: ${String(values[key]).trim()}`).join('\n\n');
  return `mailto:diana@cloudandcapital.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

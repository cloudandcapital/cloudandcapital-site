import test from 'node:test';
import assert from 'node:assert/strict';
import { createInquiryMailto } from '../src/lib/inquiry.js';
test('inquiry preserves special characters without altering recipient or subject', () => {
  const parsed = new URL(createInquiryMailto('business', { name: 'Diana & Co', email: 'hello+work@example.com', question: 'Costs? #AI & reporting\nNew line' }));
  assert.equal(parsed.pathname, 'diana@cloudandcapital.com');
  assert.equal(parsed.searchParams.get('subject'), 'Cloud & Capital business inquiry');
  assert.equal(parsed.hash, '');
  assert.equal(parsed.searchParams.get('body'), 'Name: Diana & Co\n\nReply email: hello+work@example.com\n\nQuestion or recurring task: Costs? #AI & reporting\nNew line');
});
test('learning uses its own language and ignores unrelated or empty fields', () => {
  const parsed = new URL(createInquiryMailto('learning', { question: ' ETFs ', tools: '', timing: 'Weekend', injected: 'Not a form field' }));
  assert.equal(parsed.searchParams.get('subject'), 'Investing and trading lesson inquiry');
  assert.equal(parsed.searchParams.get('body'), 'Topic and learning goal: ETFs\n\nPreferred timing: Weekend');
});

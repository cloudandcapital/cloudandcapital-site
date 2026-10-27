import test from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST } from '../src/pages/api/interactive-lab.js';

test('the retired endpoint returns Gone without reading input or calling a provider', async (t) => {
  let calls = 0;
  t.mock.method(globalThis, 'fetch', () => {
    calls++;
    throw new Error('A retired tool must not contact a provider');
  });
  const context = {
    get request() { throw new Error('A retired tool must not read user input'); },
  };
  for (const handler of [GET, POST]) {
    const response = handler(context);
    assert.equal(response.status, 410);
    assert.match(response.headers.get('content-type'), /application\/json/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await response.json(), {
      error: 'This tool is no longer available.',
      tools: '/tools',
    });
  }
  assert.equal(calls, 0);
});

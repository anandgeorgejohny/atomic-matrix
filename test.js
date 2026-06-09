const assert = require('assert');
const { AtomicMatrix } = require('./index.js');

function runTestSuite() {
  const matrix = new AtomicMatrix();

  // Test 1: Setting and Getting values
  console.log('Running Test 1: State Mutation & Retrieval...');
  matrix.set('agent_0', 'status', 'idle');
  assert.strictEqual(matrix.get('agent_0', 'status'), 'idle');

  // Test 2: Reactivity & Subscriptions
  console.log('Running Test 2: Reactive Subscriptions...');
  let triggerCount = 0;
  let receivedNew = null;
  let receivedOld = null;

  const unsubscribe = matrix.subscribe('agent_0', 'status', (next, prev) => {
    triggerCount++;
    receivedNew = next;
    receivedOld = prev;
  });

  matrix.set('agent_0', 'status', 'processing');
  assert.strictEqual(triggerCount, 1);
  assert.strictEqual(receivedNew, 'processing');
  assert.strictEqual(receivedOld, 'idle');

  // Test 3: Idempotency protection (No change = no trigger)
  console.log('Running Test 3: Idempotency Constraints...');
  matrix.set('agent_0', 'status', 'processing');
  assert.strictEqual(triggerCount, 1); // Should still be 1

  // Test 4: Unsubscribe clearing
  console.log('Running Test 4: Unsubscription Isolation...');
  unsubscribe();
  matrix.set('agent_0', 'status', 'completed');
  assert.strictEqual(triggerCount, 1); // Should not change after unsubscribe

  // Test 5: Namespaced dumping
  console.log('Running Test 5: Namespace Matrix Data Dumps...');
  matrix.set('system', 'load', 'low');
  matrix.set('system', 'uptime', 3600);
  const data = matrix.dump('system');
  assert.deepStrictEqual(data, { load: 'low', uptime: 3600 });

  console.log('\nAll core test assertions passed successfully.');
}

try {
  runTestSuite();
} catch (error) {
  console.error('Test suite failed:', error.message);
  process.exit(1);
}

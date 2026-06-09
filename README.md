# atomic-matrix

`atomic-matrix` is a zero-dependency, high-performance memory matrix designed for ultra-low latency context management and state isolation. It provides microsecond-level state mutation and predictable event propagation mechanics for asynchronous runtime systems, such as AI multi-agent orchestrators and distributed event streams.

## Features

* **Zero Dependencies**: Pure, optimized JavaScript using memory-efficient lookup maps.
* **Predictable Isolation**: Keep separate component or agent metrics strictly segregated via clear namespacing.
* **Atomic Subscriptions**: Listen to explicit node changes without triggering global components or wide state recalculations.
* **Idempotency Protection**: Avoid redundant context processing loops; notifications fire only on genuine data state transformations.

## Installation

```bash
npm install atomic-matrix
Quick Start
JavaScript
const { AtomicMatrix } = require('atomic-matrix');

const store = new AtomicMatrix();

// Subscribe directly to a key coordinate inside a namespace
const unsubscribe = store.subscribe('agent_alpha', 'action', (current, previous) => {
  console.log(`State changed from ${previous} to ${current}`);
});

// Mutate data
store.set('agent_alpha', 'action', 'analyzing_prompt'); 
// Logs: State changed from undefined to analyzing_prompt

store.set('agent_alpha', 'action', 'generating_response'); 
// Logs: State changed from analyzing_prompt to generating_response

// Retrieve snapshots anywhere
const dataSnapshot = store.dump('agent_alpha');
console.log(dataSnapshot); // { action: 'generating_response' }

// Clean up
unsubscribe();
API Reference
store.set(namespace, key, value)
Mutates a specific point within the data layout. Returns true if the state changed, or false if the incoming update matched existing data.

store.get(namespace, key)
Returns the targeted value. Returns undefined if the context coordinate doesn't exist.

store.dump(namespace)
Returns a shallow-copied key-value object of the entire namespace.

store.subscribe(namespace, key, callback)
Attaches a listener function execution sequence running on changes to the targeted matrix key. Returns an un-subscription handler function.

store.clear([namespace])
Clears a specified namespace dataset alongside its structural listeners, or completely wipes the internal tracking maps if executed with no arguments.

License
MIT

/**
 * AtomicMatrix
 * High-performance, zero-dependency state matrix for isolated context management.
 */
class AtomicMatrix {
  constructor() {
    this._matrix = new Map();
    this._subscribers = new Map();
  }

  /**
   * Mutate a specific cell state within a namespace
   * @param {string} namespace 
   * @param {string} key 
   * @param {any} value 
   */
  set(namespace, key, value) {
    if (!this._matrix.has(namespace)) {
      this._matrix.set(namespace, new Map());
    }
    
    const space = this._matrix.get(namespace);
    const prev = space.get(key);
    
    if (prev === value) return false;
    
    space.set(key, value);
    this._notify(namespace, key, value, prev);
    return true;
  }

  /**
   * Retrieve a specific cell state
   * @param {string} namespace 
   * @param {string} key 
   * @returns {any}
   */
  get(namespace, key) {
    const space = this._matrix.get(namespace);
    return space ? space.get(key) : undefined;
  }

  /**
   * Extract a shallow copy of an entire namespace
   * @param {string} namespace 
   * @returns {Object}
   */
  dump(namespace) {
    const space = this._matrix.get(namespace);
    if (!space) return {};
    return Object.fromEntries(space.entries());
  }

  /**
   * Register a reactive listener for a specific key coordinate
   * @param {string} namespace 
   * @param {string} key 
   * @param {Function} callback 
   * @returns {Function} Unsubscribe function
   */
  subscribe(namespace, key, callback) {
    const compoundKey = `${namespace}:${key}`;
    if (!this._subscribers.has(compoundKey)) {
      this._subscribers.set(compoundKey, new Set());
    }
    
    this._subscribers.get(compoundKey).add(callback);
    
    return () => {
      const set = this._subscribers.get(compoundKey);
      if (set) {
        set.delete(callback);
        if (set.size === 0) this._subscribers.delete(compoundKey);
      }
    };
  }

  /**
   * Internal notification dispatcher
   * @private
   */
  _notify(namespace, key, current, previous) {
    const compoundKey = `${namespace}:${key}`;
    const targets = this._subscribers.get(compoundKey);
    if (!targets) return;
    
    for (const callback of targets) {
      try {
        callback(current, previous);
      } catch (err) {
        process.emitWarning(`AtomicMatrix subscription exception: ${err.message}`);
      }
    }
  }

  /**
   * Purge a specific namespace or clear the entire matrix matrix
   * @param {string} [namespace] 
   */
  clear(namespace) {
    if (namespace) {
      this._matrix.delete(namespace);
      for (const compoundKey of this._subscribers.keys()) {
        if (compoundKey.startsWith(`${namespace}:`)) {
          this._subscribers.delete(compoundKey);
        }
      }
    } else {
      this._matrix.clear();
      this._subscribers.clear();
    }
  }
}

module.exports = { AtomicMatrix };

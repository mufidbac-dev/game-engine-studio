/**
 * Publish/Subscribe Event Bus for decoupled communication across engine, editor, and templates.
 */
export class EventBus {
  constructor() {
    /** @type {Map<string, Set<Function>>} */
    this.listeners = new Map();
  }

  /**
   * Subscribes a callback to an event topic.
   * @param {string} event
   * @param {Function} callback
   * @returns {() => void} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  /**
   * Subscribes a one-time callback.
   * @param {string} event
   * @param {Function} callback
   */
  once(event, callback) {
    const wrapper = (data) => {
      this.off(event, wrapper);
      callback(data);
    };
    return this.on(event, wrapper);
  }

  /**
   * Emits an event with payload data.
   * @param {string} event
   * @param {any} [data]
   */
  emit(event, data) {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const fn of Array.from(set)) {
      fn(data);
    }
  }

  /**
   * Removes a listener from an event topic.
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Clears all registered listeners.
   */
  clear() {
    this.listeners.clear();
  }
}

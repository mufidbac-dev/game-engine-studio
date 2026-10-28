/**
 * Keyboard & mouse input manager with rebindable action mappings.
 */
export class InputManager {
  constructor() {
    this.enabled = true;
    this.keyMap = new Map([
      ['w', 'forward'],
      ['arrowup', 'forward'],
      ['s', 'backward'],
      ['arrowdown', 'backward'],
      ['a', 'left'],
      ['arrowleft', 'left'],
      ['d', 'right'],
      ['arrowright', 'right'],
      ['shift', 'sprint'],
      [' ', 'jump'],
      ['e', 'interact'],
      ['f', 'flashlight'],
      ['escape', 'pause']
    ]);

    this.state = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      sprint: false,
      jump: false,
      interact: false,
      flashlight: false,
      pause: false
    };

    /** @type {Map<string, Set<Function>>} */
    this.actionListeners = new Map();
  }

  /**
   * Handles a keydown event.
   * @param {{ key: string, target?: { tagName?: string } }} e
   */
  handleKeyDown(e) {
    if (!this.enabled || e.target?.tagName === 'INPUT' || e.target?.tagName === 'TEXTAREA') return;
    const action = this.keyMap.get(e.key.toLowerCase());
    if (action) {
      this.state[action] = true;
      const listeners = this.actionListeners.get(action);
      if (listeners) {
        for (const fn of listeners) fn();
      }
    }
  }

  /**
   * Handles a keyup event.
   * @param {{ key: string }} e
   */
  handleKeyUp(e) {
    const action = this.keyMap.get(e.key.toLowerCase());
    if (action) {
      this.state[action] = false;
    }
  }

  /**
   * Rebinds a key to an action name.
   * @param {string} key
   * @param {string} action
   */
  bindKey(key, action) {
    this.keyMap.set(key.toLowerCase(), action);
  }

  /**
   * Subscribes to discrete action triggers.
   * @param {string} action
   * @param {Function} callback
   */
  onAction(action, callback) {
    if (!this.actionListeners.has(action)) {
      this.actionListeners.set(action, new Set());
    }
    this.actionListeners.get(action).add(callback);
    return () => this.actionListeners.get(action)?.delete(callback);
  }

  getState() {
    return { ...this.state };
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
    for (const k of Object.keys(this.state)) this.state[k] = false;
  }
}

/**
 * Manages save slots in localStorage and file-based JSON export/import with schema version support.
 */
export class SaveManager {
  constructor(storagePrefix = 'vgc_save_slot_') {
    this.prefix = storagePrefix;
    this.memoryFallback = new Map();
  }

  _setItem(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch {
      this.memoryFallback.set(key, val);
    }
  }

  _getItem(key) {
    try {
      return localStorage.getItem(key) ?? this.memoryFallback.get(key) ?? null;
    } catch {
      return this.memoryFallback.get(key) ?? null;
    }
  }

  async save(slot, gameState) {
    const payload = {
      version: 2,
      slot,
      savedAt: new Date().toISOString(),
      state: gameState
    };
    this._setItem(`${this.prefix}${slot}`, JSON.stringify(payload));
    return payload;
  }

  async load(slot) {
    const raw = this._getItem(`${this.prefix}${slot}`);
    if (!raw) return null;
    return JSON.parse(raw);
  }

  listSlots() {
    const slots = [];
    for (let i = 1; i <= 5; i++) {
      const raw = this._getItem(`${this.prefix}${i}`);
      if (raw) {
        try {
          slots.push(JSON.parse(raw));
        } catch {
          // ignore malformed slot
        }
      }
    }
    return slots;
  }

  delete(slot) {
    try {
      localStorage.removeItem(`${this.prefix}${slot}`);
    } catch {
      // ignore
    }
    this.memoryFallback.delete(`${this.prefix}${slot}`);
  }
}

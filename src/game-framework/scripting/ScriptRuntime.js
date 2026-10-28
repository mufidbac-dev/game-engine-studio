/**
 * Sandboxed Gameplay Script Runtime exposing safe entity & objective APIs.
 */
export class ScriptRuntime {
  /**
   * @param {{ eventBus?: any, assetManager?: any, objectiveManager?: any }} [context]
   */
  constructor(context = {}) {
    this.context = context;
    this.scripts = new Map();
  }

  register(name, scriptFn) {
    this.scripts.set(name, scriptFn);
  }

  execute(name, args = {}) {
    const fn = this.scripts.get(name);
    if (!fn) throw new Error(`Script not found: ${name}`);
    const sandboxApi = Object.freeze({
      spawn: (preset, pos) => this.context.assetManager?.spawnPreset(preset, pos),
      emit: (evt, payload) => this.context.eventBus?.emit(evt, payload),
      setObjective: (obj) => this.context.objectiveManager?.addObjective(obj),
      args
    });
    return fn(sandboxApi);
  }

  listScripts() {
    return Array.from(this.scripts.keys());
  }

  dispose() {
    this.scripts.clear();
  }
}

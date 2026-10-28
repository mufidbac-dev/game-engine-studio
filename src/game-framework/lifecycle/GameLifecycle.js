/**
 * Manages the active game template state machine: idle -> loading -> running <-> paused -> stopped.
 */
export class GameLifecycle {
  /**
   * @param {import('../../core/Engine.js').Engine} engine
   * @param {import('../events/EventBus.js').EventBus} eventBus
   */
  constructor(engine, eventBus) {
    this.engine = engine;
    this.eventBus = eventBus;
    this.state = 'idle';
    this.activeTemplate = null;
    this._unsubUpdate = null;
  }

  /**
   * Loads and initializes a genre template module, tearing down any previous template first.
   * @param {object} templateModule
   * @param {object} [context]
   */
  async loadTemplate(templateModule, context = {}) {
    if (this.activeTemplate) {
      this.stop();
      this.activeTemplate.dispose?.();
    }
    this.state = 'loading';
    this.eventBus.emit('game:loading', { name: templateModule.name });
    this.activeTemplate = templateModule;
    await this.activeTemplate.init?.({
      engine: this.engine,
      eventBus: this.eventBus,
      ...context
    });
  }

  start() {
    if (!this.activeTemplate) return;
    this.state = 'running';
    this.activeTemplate.start?.();
    if (this._unsubUpdate) this._unsubUpdate();
    this._unsubUpdate = this.engine.onUpdate((dt) => {
      if (this.state === 'running') {
        this.activeTemplate.update?.(dt);
      }
    });
    this.eventBus.emit('game:started', { name: this.activeTemplate.name });
  }

  pause() {
    if (this.state !== 'running') return;
    this.state = 'paused';
    this.activeTemplate.pause?.();
    this.eventBus.emit('game:paused');
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'running';
    this.activeTemplate.resume?.();
    this.eventBus.emit('game:resumed');
  }

  stop() {
    if (this._unsubUpdate) {
      this._unsubUpdate();
      this._unsubUpdate = null;
    }
    this.state = 'stopped';
    this.activeTemplate?.stop?.();
    this.eventBus.emit('game:stopped');
  }

  restart() {
    this.stop();
    this.start();
  }

  getState() {
    return this.state;
  }
}

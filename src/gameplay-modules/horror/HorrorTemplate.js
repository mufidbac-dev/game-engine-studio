export class FlashlightSystem {
  constructor() {
    this.on = true;
    this.battery = 100;
  }
  toggle() {
    if (this.battery <= 0) {
      this.on = false;
      return false;
    }
    this.on = !this.on;
    return this.on;
  }
  drain(dt, rate = 3.5) {
    if (!this.on) return this.battery;
    this.battery = Math.max(0, this.battery - rate * dt);
    if (this.battery === 0) this.on = false;
    return this.battery;
  }
  isOn() {
    return this.on;
  }
}

export class HorrorTemplate {
  constructor() {
    this.name = 'horror';
    this.title = 'Horror / Survival';
    this.description = 'Dark fog survival with flashlight battery management, sanity meter, and relic collection.';
    this.flashlight = new FlashlightSystem();
    this.sanity = 100;
  }
  async init(ctx) {
    this.ctx = ctx;
  }
  start() {}
  update(dt) {
    this.flashlight.drain(dt);
  }
  pause() {}
  resume() {}
  stop() {}
  dispose() {}
}

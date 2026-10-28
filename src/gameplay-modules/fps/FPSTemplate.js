export class WeaponSystem {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.ammo = 12;
    this.maxAmmo = 12;
  }
  fire() {
    if (this.ammo <= 0) return false;
    this.ammo--;
    this.eventBus?.emit('fps:fire', { ammo: this.ammo });
    return true;
  }
  reload() {
    this.ammo = this.maxAmmo;
    this.eventBus?.emit('fps:reload', { ammo: this.ammo });
  }
  getAmmo() {
    return this.ammo;
  }
}

export class FPSTemplate {
  constructor() {
    this.name = 'fps';
    this.title = 'FPS / Tactical Shooter';
    this.description = 'First-person tactical blaster with energy projectiles, target drones, ammo reload, and crosshair HUD.';
  }
  async init(ctx) {
    this.ctx = ctx;
    this.weapon = new WeaponSystem(ctx.eventBus);
  }
  start() {}
  update(_dt) {}
  pause() {}
  resume() {}
  stop() {}
  dispose() {}
}

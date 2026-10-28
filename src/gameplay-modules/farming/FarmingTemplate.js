export class CropSystem {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.plots = new Map();
  }
  plant(key, seedType = 'Turnip') {
    this.plots.set(key, { seedType, stage: 1, watered: false, progress: 0 });
  }
  water(key) {
    const plot = this.plots.get(key);
    if (plot) plot.watered = true;
  }
  update(dt) {
    for (const plot of this.plots.values()) {
      if (plot.watered && plot.stage < 4) {
        plot.progress += dt;
        if (plot.progress >= 2) {
          plot.stage = 4;
        }
      }
    }
  }
  harvest(key) {
    const plot = this.plots.get(key);
    if (!plot || plot.stage < 4) return null;
    this.plots.delete(key);
    return { item: plot.seedType, gold: 50 };
  }
}

export class FarmingTemplate {
  constructor() {
    this.name = 'farming';
    this.title = 'Farming / Simulation';
    this.description = 'Grid-based crop planting, watering, day/night harvest cycle, and NPC merchant trading.';
  }
  async init(ctx) {
    this.ctx = ctx;
    this.crops = new CropSystem(ctx.eventBus);
  }
  start() {}
  update(dt) {
    this.crops?.update(dt);
  }
  pause() {}
  resume() {}
  stop() {}
  dispose() {}
}

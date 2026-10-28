import { HealthSystem } from './HealthSystem.js';
import { CombatSystem } from './CombatSystem.js';

export class ActionTemplate {
  constructor() {
    this.name = 'action';
    this.title = 'Action / Adventure';
    this.description = 'Third-person melee & combo combat with patrolling sentinel enemies and boss crystals.';
  }
  async init(ctx) {
    this.ctx = ctx;
    this.health = new HealthSystem(ctx.eventBus);
    this.combat = new CombatSystem(ctx.eventBus, this.health);
    this.health.register('player', 100);
    this.health.register('enemy_1', 75);
    this.health.register('enemy_2', 75);
  }
  start() {}
  update(_dt) {}
  pause() {}
  resume() {}
  stop() {}
  dispose() {}
}

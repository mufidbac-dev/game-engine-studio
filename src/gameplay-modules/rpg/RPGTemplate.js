export class StatsSystem {
  constructor() {
    this.level = 1;
    this.xp = 0;
    this.stats = { STR: 12, DEX: 10, INT: 14, VIT: 12, LCK: 8 };
  }
  addXP(amount) {
    this.xp += amount;
    while (this.xp >= this.level * 100) {
      this.xp -= this.level * 100;
      this.levelUp();
    }
  }
  levelUp() {
    this.level++;
    for (const k of Object.keys(this.stats)) {
      this.stats[k] += 2;
    }
  }
}

export class RPGTemplate {
  constructor() {
    this.name = 'rpg';
    this.title = 'RPG / Quest & Leveling';
    this.description = 'Character stats (STR/DEX/INT/VIT), NPC quest dialogues, equipment buffs, and XP leveling.';
    this.stats = new StatsSystem();
  }
  async init(ctx) {
    this.ctx = ctx;
  }
  start() {}
  update(_dt) {}
  pause() {}
  resume() {}
  stop() {}
  dispose() {}
}

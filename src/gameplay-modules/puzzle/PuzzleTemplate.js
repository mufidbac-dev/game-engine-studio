export class PuzzleMechanics {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.switches = new Map();
    this.doors = new Map();
    this.links = new Map();
  }
  addSwitch(id) {
    this.switches.set(id, { active: false });
  }
  addDoor(id) {
    this.doors.set(id, { open: false });
  }
  connect(switchId, doorId) {
    this.links.set(switchId, doorId);
  }
  activate(switchId) {
    const sw = this.switches.get(switchId);
    if (!sw) return;
    sw.active = true;
    const doorId = this.links.get(switchId);
    if (doorId && this.doors.has(doorId)) {
      this.doors.get(doorId).open = true;
      this.eventBus?.emit('puzzle:door-opened', { switchId, doorId });
    }
  }
  isComplete() {
    return Array.from(this.doors.values()).every((d) => d.open);
  }
}

export class PuzzleTemplate {
  constructor() {
    this.name = 'puzzle';
    this.title = 'Puzzle / Platformer';
    this.description = 'Pressure switches, moving platforms, spinning energy orbs, and ancient gate mechanisms.';
  }
  async init(ctx) {
    this.ctx = ctx;
    this.mechanics = new PuzzleMechanics(ctx.eventBus);
  }
  start() {}
  update(_dt) {}
  pause() {}
  resume() {}
  stop() {}
  dispose() {}
}

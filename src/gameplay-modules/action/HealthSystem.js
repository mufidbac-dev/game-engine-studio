export class HealthSystem {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.entities = new Map();
  }
  register(entityId, maxHP = 100) {
    this.entities.set(entityId, { hp: maxHP, maxHP });
  }
  damage(entityId, amount) {
    const e = this.entities.get(entityId);
    if (!e) return 0;
    e.hp = Math.max(0, e.hp - amount);
    this.eventBus?.emit('combat:damage', { entityId, hp: e.hp, maxHP: e.maxHP });
    if (e.hp === 0) this.eventBus?.emit('combat:death', { entityId });
    return e.hp;
  }
  heal(entityId, amount) {
    const e = this.entities.get(entityId);
    if (!e) return 0;
    e.hp = Math.min(e.maxHP, e.hp + amount);
    return e.hp;
  }
  getHP(entityId) {
    return this.entities.get(entityId)?.hp ?? 0;
  }
  isDead(entityId) {
    return this.getHP(entityId) <= 0;
  }
}

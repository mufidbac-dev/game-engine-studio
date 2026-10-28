export class CombatSystem {
  constructor(eventBus, healthSystem) {
    this.eventBus = eventBus;
    this.healthSystem = healthSystem;
    this.comboCount = 0;
  }
  attack(attackerId, targetId, baseDamage = 25) {
    this.comboCount++;
    const remaining = this.healthSystem.damage(targetId, baseDamage);
    this.eventBus?.emit('combat:hit', { attackerId, targetId, damage: baseDamage, combo: this.comboCount, remaining });
    return remaining;
  }
}

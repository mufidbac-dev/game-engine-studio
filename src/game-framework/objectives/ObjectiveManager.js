/**
 * Tracks primary, secondary, and hidden gameplay objectives with progress notifications.
 */
export class ObjectiveManager {
  /**
   * @param {import('../events/EventBus.js').EventBus} eventBus
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    /** @type {Map<string, object>} */
    this.objectives = new Map();
  }

  addObjective(objective) {
    const entry = {
      id: objective.id,
      title: objective.title,
      description: objective.description || '',
      type: objective.type || 'primary',
      status: 'active',
      progress: objective.progress ?? 0,
      maxProgress: objective.maxProgress ?? 1
    };
    this.objectives.set(entry.id, entry);
    this.eventBus?.emit('objective:added', entry);
    return entry;
  }

  updateProgress(id, delta = 1) {
    const obj = this.objectives.get(id);
    if (!obj || obj.status !== 'active') return;
    obj.progress = Math.min(obj.maxProgress, obj.progress + delta);
    this.eventBus?.emit('objective:progress', obj);
    if (obj.progress >= obj.maxProgress) {
      this.completeObjective(id);
    }
  }

  completeObjective(id) {
    const obj = this.objectives.get(id);
    if (!obj) return;
    obj.status = 'completed';
    obj.progress = obj.maxProgress;
    this.eventBus?.emit('objective:completed', obj);
  }

  failObjective(id) {
    const obj = this.objectives.get(id);
    if (!obj) return;
    obj.status = 'failed';
    this.eventBus?.emit('objective:failed', obj);
  }

  getActive() {
    return Array.from(this.objectives.values()).filter((o) => o.status === 'active');
  }

  getCompleted() {
    return Array.from(this.objectives.values()).filter((o) => o.status === 'completed');
  }

  reset() {
    this.objectives.clear();
  }
}

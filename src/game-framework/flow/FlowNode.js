/**
 * Single executable node in the Visual Scripting Flow Graph.
 */
export class FlowNode {
  /**
   * @param {string} id
   * @param {string} type
   * @param {object} [data]
   */
  constructor(id, type, data = {}) {
    this.id = id;
    this.type = type;
    this.data = data;
  }

  /**
   * Executes the node logic against the runtime context.
   * @param {object} context
   * @returns {Promise<string>} Output port name ('next', 'true', 'false')
   */
  async execute(context) {
    switch (this.type) {
      case 'event-trigger':
        return 'next';
      case 'set-variable':
        context.variables[this.data.key] = this.data.value;
        return 'next';
      case 'condition':
      case 'branch': {
        const actual = context.variables[this.data.key];
        return actual === this.data.expected ? 'true' : 'false';
      }
      case 'delay':
        await new Promise((r) => setTimeout(r, this.data.ms || 10));
        return 'next';
      case 'action':
      case 'spawn-object':
      case 'show-dialogue':
        context.eventBus?.emit(`flow:${this.type}`, this.data);
        return 'next';
      default:
        return 'next';
    }
  }
}

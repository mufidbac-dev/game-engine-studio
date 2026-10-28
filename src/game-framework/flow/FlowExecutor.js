import { FlowNode } from './FlowNode.js';

/**
 * Executes visual node-based flow graphs.
 */
export class FlowExecutor {
  /**
   * @param {import('../events/EventBus.js').EventBus} eventBus
   */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.nodes = new Map();
    this.edges = [];
    this.variables = {};
    this.paused = false;
  }

  /**
   * Loads a flow graph definition.
   * @param {{ nodes: Array<object>, edges: Array<object> }} graphJSON
   */
  loadGraph(graphJSON) {
    this.nodes.clear();
    this.edges = graphJSON?.edges || [];
    for (const n of graphJSON?.nodes || []) {
      this.nodes.set(n.id, new FlowNode(n.id, n.type, n.data));
    }
  }

  /**
   * Executes the graph starting from startNodeId.
   * @param {string} startNodeId
   */
  async execute(startNodeId) {
    let currentId = startNodeId;
    const visited = [];
    while (currentId && !this.paused) {
      const node = this.nodes.get(currentId);
      if (!node) break;
      visited.push(currentId);
      const port = await node.execute({ variables: this.variables, eventBus: this.eventBus });
      const edge = this.edges.find(
        (e) => e.from === currentId && (e.port === port || (!e.port && port === 'next'))
      );
      currentId = edge ? edge.to : null;
    }
    return visited;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  reset() {
    this.variables = {};
    this.paused = false;
  }
}

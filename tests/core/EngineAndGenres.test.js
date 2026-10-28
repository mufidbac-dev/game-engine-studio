import { describe, it, expect } from 'vitest';
import { EventBus } from '../../src/game-framework/events/EventBus.js';
import { ObjectiveManager } from '../../src/game-framework/objectives/ObjectiveManager.js';
import { FlowExecutor } from '../../src/game-framework/flow/FlowExecutor.js';
import { TemplateRegistry } from '../../src/game-framework/TemplateRegistry.js';
import { SaveManager } from '../../src/persistence/SaveManager.js';

describe('VGC Game Engine Studio Core & Framework Suite', () => {
  it('registers all 7 genre templates in TemplateRegistry', () => {
    const registry = new TemplateRegistry();
    const list = registry.list();
    expect(list.length).toBe(7);
    expect(list.map((g) => g.name)).toEqual([
      'action',
      'horror',
      'farming',
      'puzzle',
      'racing',
      'rpg',
      'fps'
    ]);
  });

  it('tracks and completes objectives via ObjectiveManager', () => {
    const bus = new EventBus();
    const mgr = new ObjectiveManager(bus);
    let completed = false;
    bus.on('objective:completed', () => {
      completed = true;
    });
    mgr.addObjective({ id: 'collect-3', title: 'Collect 3 Crystals', maxProgress: 3 });
    mgr.updateProgress('collect-3', 2);
    expect(completed).toBe(false);
    mgr.updateProgress('collect-3', 1);
    expect(completed).toBe(true);
  });

  it('executes conditional branches in FlowExecutor', async () => {
    const bus = new EventBus();
    const flow = new FlowExecutor(bus);
    flow.loadGraph({
      nodes: [
        { id: 'n1', type: 'set-variable', data: { key: 'hasKey', value: true } },
        { id: 'n2', type: 'condition', data: { key: 'hasKey', expected: true } },
        { id: 'n3', type: 'action', data: { action: 'unlockDoor' } }
      ],
      edges: [
        { from: 'n1', to: 'n2', port: 'next' },
        { from: 'n2', to: 'n3', port: 'true' }
      ]
    });
    const visited = await flow.execute('n1');
    expect(visited).toEqual(['n1', 'n2', 'n3']);
  });

  it('saves and loads state via SaveManager', async () => {
    const saves = new SaveManager();
    await saves.save(1, { genre: 'rpg', level: 5 });
    const loaded = await saves.load(1);
    expect(loaded.state.genre).toBe('rpg');
    expect(loaded.state.level).toBe(5);
  });
});

import './styles/editor.css';
import { Engine } from './core/Engine.js';
import { TerrainSystem } from './core/TerrainSystem.js';
import { CharacterController } from './core/CharacterController.js';
import { EventBus } from './game-framework/events/EventBus.js';
import { GameLifecycle } from './game-framework/lifecycle/GameLifecycle.js';
import { TemplateRegistry } from './game-framework/TemplateRegistry.js';

export async function bootstrapPlayer(canvas = document.getElementById('player-canvas'), genre = 'action') {
  if (!canvas) return null;
  const engine = new Engine(canvas);
  const terrain = new TerrainSystem(engine.getScene());
  const character = new CharacterController({
    terrainHeightFn: (x, z) => terrain.getHeightAt(x, z)
  });
  engine.getScene().add(character.root);
  const eventBus = new EventBus();
  const lifecycle = new GameLifecycle(engine, eventBus);
  const registry = new TemplateRegistry();
  const template = registry.get(genre) || registry.get('action');
  await lifecycle.loadTemplate(template);
  lifecycle.start();
  engine.start();
  return { engine, lifecycle, registry };
}

if (typeof window !== 'undefined' && document.getElementById('player-canvas')) {
  const params = new URLSearchParams(window.location.search);
  bootstrapPlayer(document.getElementById('player-canvas'), params.get('genre') || 'action');
}

import './styles/editor.css';
import { Engine } from './core/Engine.js';
import { AssetManager } from './core/AssetManager.js';
import { TerrainSystem } from './core/TerrainSystem.js';
import { CharacterController } from './core/CharacterController.js';
import { LightingSystem } from './core/LightingSystem.js';
import { EventBus } from './game-framework/events/EventBus.js';
import { GameLifecycle } from './game-framework/lifecycle/GameLifecycle.js';
import { TemplateRegistry } from './game-framework/TemplateRegistry.js';

export function bootstrapEditor(container = document.getElementById('app')) {
  if (!container) return null;
  container.innerHTML = `<canvas id="game-canvas" class="w-full h-full block"></canvas>`;
  const canvas = container.querySelector('#game-canvas');
  const engine = new Engine(canvas);
  const lighting = new LightingSystem(engine.getScene());
  const terrain = new TerrainSystem(engine.getScene());
  const assets = new AssetManager(engine.getSceneManager());
  const character = new CharacterController({
    terrainHeightFn: (x, z) => terrain.getHeightAt(x, z)
  });
  engine.getScene().add(character.root);
  const eventBus = new EventBus();
  const lifecycle = new GameLifecycle(engine, eventBus);
  const registry = new TemplateRegistry();
  engine.start();
  return { engine, lighting, terrain, assets, character, eventBus, lifecycle, registry };
}

if (typeof window !== 'undefined' && document.getElementById('app')) {
  bootstrapEditor();
}

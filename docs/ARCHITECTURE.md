# Architecture Overview

## Layered Modular Design

1. **Core Engine (`src/core/`)**: `Engine.js`, `RenderPipeline.js`, `SceneManager.js`, `AssetManager.js`, `TerrainSystem.js`, `TerrainHeightProvider.js`, `CharacterController.js`, `ProceduralAnimator.js`, `ThirdPersonCamera.js`, `InputManager.js`, `LightingSystem.js`, `PerformanceMonitor.js`.
2. **Game Framework (`src/game-framework/`)**: `EventBus.js`, `GameLifecycle.js`, `ObjectiveManager.js`, `FlowExecutor.js`, `FlowNode.js`, `CutscenePlayer.js`, `ScriptRuntime.js`, `TemplateRegistry.js`.
3. **7 Genre Templates (`src/gameplay-modules/`)**:
   - `action`: Melee combo combat, enemy AI patrol/chase, HP bars, boss crystals.
   - `horror`: Flashlight battery drain, dark fog atmosphere, sanity meter, relic hunt.
   - `farming`: Interactive crop plots (plant, water, grow, harvest), day/night time cycle, NPC merchant.
   - `puzzle`: Pressure switches linked to gates, oscillating platforms, collectible energy orbs.
   - `racing`: Arcade rover vehicle physics, checkpoint gates, lap counter & timer, AI rival rover.
   - `rpg`: STR/DEX/INT/VIT/LCK stats, branching NPC quest dialogue, XP & level-up progression.
   - `fps`: First-person camera & crosshair, energy projectile firing, ammo reload, target drones.
4. **Persistence (`src/persistence/`)**: `SaveManager.js` with 5 localStorage slots and JSON file export/import round-trip.

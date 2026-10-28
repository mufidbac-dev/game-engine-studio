import * as THREE from 'three';
import { GLTFLoaderWrapper } from './loaders/GLTFLoaderWrapper.js';

/**
 * Manages built-in procedural 3D presets and custom loaded GLB/GLTF templates.
 */
export class AssetManager {
  /**
   * @param {import('./SceneManager.js').SceneManager} sceneManager
   * @param {GLTFLoaderWrapper} [loader]
   */
  constructor(sceneManager, loader = new GLTFLoaderWrapper()) {
    this.sceneManager = sceneManager;
    this.loader = loader;
    /** @type {Map<string, () => THREE.Object3D>} */
    this.presets = new Map();
    /** @type {Map<string, { name: string, scene: THREE.Object3D, animations: Array }>} */
    this.templates = new Map();
    this._registerDefaultPresets();
  }

  _registerDefaultPresets() {
    this.registerPreset('tree', () => {
      const group = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.3, 1.6, 7),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
      );
      trunk.position.y = 0.8;
      trunk.castShadow = true;
      const leavesMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8, flatShading: true });
      const c1 = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.2, 7), leavesMat);
      c1.position.y = 2.3;
      c1.castShadow = true;
      const c2 = new THREE.Mesh(new THREE.ConeGeometry(1.0, 1.8, 7), leavesMat);
      c2.position.y = 3.5;
      c2.castShadow = true;
      group.add(trunk, c1, c2);
      group.name = 'Pohon_Pinus';
      return group;
    });

    this.registerPreset('rock', () => {
      const group = new THREE.Group();
      const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(1.1, 1),
        new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85, flatShading: true })
      );
      rock.scale.set(1.2, 0.8, 1.0);
      rock.position.y = 0.6;
      rock.castShadow = true;
      rock.receiveShadow = true;
      group.add(rock);
      group.name = 'Batu_Tebing';
      return group;
    });

    this.registerPreset('crate', () => {
      const group = new THREE.Group();
      const crate = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.2, 1.2),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 })
      );
      crate.position.y = 0.6;
      crate.castShadow = true;
      crate.receiveShadow = true;
      group.add(crate);
      group.name = 'Kotak_Kayu';
      return group;
    });

    this.registerPreset('pillar', () => {
      const group = new THREE.Group();
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.45, 0.55, 3.8, 8),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6 })
      );
      pillar.position.y = 1.9;
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      group.add(pillar);
      group.name = 'Pilar_Kuno';
      return group;
    });
  }

  /**
   * Registers a procedural preset factory.
   * @param {string} name
   * @param {() => THREE.Object3D} factoryFn
   */
  registerPreset(name, factoryFn) {
    this.presets.set(name, factoryFn);
  }

  /**
   * Spawns a preset or template at the given position and registers it in SceneManager.
   * @param {string} name
   * @param {{ x?: number, y?: number, z?: number }} [position]
   * @returns {THREE.Object3D}
   */
  spawnPreset(name, position = { x: 0, y: 0, z: 0 }) {
    let obj;
    if (this.presets.has(name)) {
      obj = this.presets.get(name)();
    } else if (this.templates.has(name)) {
      const tpl = this.templates.get(name);
      obj = tpl.scene.clone(true);
      obj.name = tpl.name;
    } else {
      obj = this.presets.get('crate')();
    }
    obj.position.set(position.x || 0, position.y || 0, position.z || 0);
    this.sceneManager.add(obj, { preset: name });
    return obj;
  }

  /**
   * Loads a GLB from URL and registers it as a named template.
   * @param {string} url
   * @param {{ name?: string, normalizeHeight?: number }} [options]
   */
  async loadGLB(url, options = {}) {
    const name = options.name || 'Custom_GLB';
    const { scene, animations } = await this.loader.load(url, options);
    const entry = { id: THREE.MathUtils.generateUUID().slice(0, 8), name, object3D: scene, animations, scene };
    this.templates.set(name, entry);
    return entry;
  }

  /**
   * Loads a GLB from a browser File object.
   * @param {File} file
   * @param {object} [options]
   */
  async loadFromFile(file, options = {}) {
    const url = URL.createObjectURL(file);
    const cleanName = file.name.replace(/\.(glb|gltf)$/i, '');
    return this.loadGLB(url, { ...options, name: cleanName });
  }

  /** @param {string} name */
  getTemplate(name) {
    return this.templates.get(name) || null;
  }

  /** @returns {string[]} */
  listTemplates() {
    return [...this.presets.keys(), ...this.templates.keys()];
  }

  /** @param {string} id */
  dispose(id) {
    this.sceneManager.remove(id);
  }
}

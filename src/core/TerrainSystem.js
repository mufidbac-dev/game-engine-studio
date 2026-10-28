import * as THREE from 'three';
import { TerrainHeightProvider } from './TerrainHeightProvider.js';

/**
 * Procedural Blender-style terrain generator with vertex coloring and nature scattering.
 */
export class TerrainSystem {
  /**
   * @param {THREE.Scene} scene
   * @param {{ size?: number, segments?: number, amplitude?: number, frequency?: number }} [config]
   */
  constructor(scene, config = {}) {
    this.scene = scene;
    this.size = config.size || 120;
    this.segments = config.segments || 96;
    this.amplitude = config.amplitude ?? 4.0;
    this.frequency = config.frequency ?? 0.04;

    this.geometry = new THREE.PlaneGeometry(this.size, this.size, this.segments, this.segments);
    this.geometry.rotateX(-Math.PI / 2);

    this.material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.85,
      metalness: 0.05,
      flatShading: true
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.name = 'Blender_Terrain';
    this.scene.add(this.mesh);

    this.heightProvider = new TerrainHeightProvider(this.mesh);
    this.generate();
  }

  /**
   * Regenerates terrain vertices and colors.
   */
  generate() {
    this.heightProvider.amplitude = this.amplitude;
    this.heightProvider.frequency = this.frequency;

    const posAttr = this.geometry.attributes.position;
    const colors = [];
    const colorLow = new THREE.Color(0x15803d);
    const colorMid = new THREE.Color(0x4d7c0f);
    const colorHigh = new THREE.Color(0x57534e);

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const y = this.heightProvider.getProceduralHeight(x, z, this.amplitude, this.frequency);
      posAttr.setY(i, y);

      const c = new THREE.Color();
      if (y < 1.2) {
        c.lerpColors(colorLow, colorMid, Math.max(0, Math.min(1, (y + 3) / 4.2)));
      } else {
        c.lerpColors(colorMid, colorHigh, Math.min(1, (y - 1.2) / 5));
      }
      colors.push(c.r, c.g, c.b);
    }

    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    posAttr.needsUpdate = true;
    this.geometry.computeVertexNormals();
  }

  /**
   * @param {number} x
   * @param {number} z
   * @returns {number}
   */
  getHeightAt(x, z) {
    return this.heightProvider.getHeight(x, z);
  }

  /** @param {number} v */
  setAmplitude(v) {
    this.amplitude = v;
    this.generate();
  }

  /** @param {number} v */
  setFrequency(v) {
    this.frequency = v;
    this.generate();
  }

  /** @param {boolean} bool */
  setWireframe(bool) {
    this.material.wireframe = Boolean(bool);
  }

  /** @returns {THREE.Mesh} */
  getMesh() {
    return this.mesh;
  }

  /**
   * Scatters preset assets across the terrain ring.
   * @param {import('./AssetManager.js').AssetManager} assetManager
   * @param {string[]} presetNames
   * @param {number} [count]
   * @param {number} [radiusMin]
   * @param {number} [radiusMax]
   */
  scatter(assetManager, presetNames = ['tree', 'rock', 'pillar'], count = 18, radiusMin = 10, radiusMax = 50) {
    const spawned = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = radiusMin + Math.random() * (radiusMax - radiusMin);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = this.getHeightAt(x, z);
      const type = presetNames[i % presetNames.length];
      const obj = assetManager.spawnPreset(type, { x, y, z });
      const s = 0.8 + Math.random() * 0.6;
      obj.scale.set(s, s, s);
      obj.rotation.y = Math.random() * Math.PI * 2;
      spawned.push(obj);
    }
    return spawned;
  }
}

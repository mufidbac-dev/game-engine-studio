import * as THREE from 'three';

/**
 * Manages hemisphere ambient lighting, directional sun shadows, fog, and atmosphere presets.
 */
export class LightingSystem {
  /**
   * @param {THREE.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    this.ambientLight = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.8);
    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    this.sunLight.position.set(30, 45, 25);
    this.sunLight.castShadow = true;

    this.scene.add(this.ambientLight);
    this.scene.add(this.sunLight);

    this.presets = {
      sunny: { bg: 0x0f172a, fog: 0.006, ambient: 0.9, sun: 2.0, angle: 60 },
      sunset: { bg: 0x1e1b4b, fog: 0.012, ambient: 0.5, sun: 1.4, angle: 18 },
      night: { bg: 0x020617, fog: 0.018, ambient: 0.25, sun: 0.3, angle: 135 },
      foggy: { bg: 0x1e293b, fog: 0.035, ambient: 0.6, sun: 0.7, angle: 40 },
      horror: { bg: 0x050507, fog: 0.045, ambient: 0.1, sun: 0.15, angle: 160 }
    };
  }

  /** @param {number} degrees */
  setSunAngle(degrees) {
    const rad = THREE.MathUtils.degToRad(degrees);
    this.sunLight.position.set(Math.cos(rad) * 50, Math.sin(rad) * 50, 25);
  }

  /** @param {number} v */
  setAmbientIntensity(v) {
    this.ambientLight.intensity = v;
  }

  /** @param {number} v */
  setSunIntensity(v) {
    this.sunLight.intensity = v;
  }

  /** @param {number} v */
  setFogDensity(v) {
    this.scene.fog = new THREE.FogExp2(this.scene.background?.getHex?.() || 0x0f172a, v);
  }

  /** @param {number} hex */
  setBackgroundColor(hex) {
    this.scene.background = new THREE.Color(hex);
  }

  /** @returns {THREE.DirectionalLight} */
  getSunLight() {
    return this.sunLight;
  }

  /** @param {string} name */
  getPreset(name) {
    return this.presets[name] || this.presets.sunny;
  }

  /** @param {string} name */
  applyPreset(name) {
    const p = this.getPreset(name);
    this.setBackgroundColor(p.bg);
    this.setFogDensity(p.fog);
    this.setAmbientIntensity(p.ambient);
    this.setSunIntensity(p.sun);
    this.setSunAngle(p.angle);
  }
}

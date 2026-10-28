import * as THREE from 'three';

/**
 * Manages shadow maps, pixel ratio, and viewport resizing for the WebGLRenderer.
 */
export class RenderPipeline {
  /**
   * @param {THREE.WebGLRenderer} renderer
   * @param {THREE.Scene} scene
   * @param {THREE.PerspectiveCamera} camera
   */
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
  }

  /**
   * Renders a single frame.
   */
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Updates camera aspect and renderer dimensions.
   * @param {number} width
   * @param {number} height
   */
  resize(width, height) {
    if (width <= 0 || height <= 0) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Sets device pixel ratio capped at 2.
   * @param {number} ratio
   */
  setPixelRatio(ratio = 1) {
    this.renderer.setPixelRatio(Math.min(ratio, 2));
  }

  /**
   * Configures soft shadow mapping on the renderer.
   * @param {{ enabled?: boolean }} [config]
   */
  enableShadows(config = { enabled: true }) {
    this.renderer.shadowMap.enabled = Boolean(config.enabled);
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
}

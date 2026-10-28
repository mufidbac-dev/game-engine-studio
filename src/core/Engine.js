import * as THREE from 'three';
import { RenderPipeline } from './RenderPipeline.js';
import { SceneManager } from './SceneManager.js';

/**
 * Core 3D Engine managing Scene, Camera, Renderer, Clock, and Update Loop.
 */
export class Engine {
  /**
   * @param {HTMLCanvasElement} canvasEl
   * @param {{ width?: number, height?: number, createRenderer?: Function }} [options]
   */
  constructor(canvasEl, options = {}) {
    this.canvas = canvasEl;
    const width = options.width || canvasEl?.clientWidth || 1280;
    const height = options.height || canvasEl?.clientHeight || 720;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a);
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.008);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 500);
    this.camera.position.set(12, 10, 15);

    this.renderer = options.createRenderer
      ? options.createRenderer(canvasEl)
      : new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true });

    this.pipeline = new RenderPipeline(this.renderer, this.scene, this.camera);
    this.pipeline.resize(width, height);
    this.pipeline.enableShadows({ enabled: true });

    this.sceneManager = new SceneManager(this.scene);
    this.clock = new THREE.Clock();
    this.callbacks = new Set();
    this.running = false;
    this.rafId = null;
    this.fps = 60;
    this._frames = 0;
    this._lastFpsUpdate = performance.now();
  }

  /** @returns {THREE.Scene} */
  getScene() {
    return this.scene;
  }

  /** @returns {THREE.PerspectiveCamera} */
  getCamera() {
    return this.camera;
  }

  /** @returns {THREE.WebGLRenderer} */
  getRenderer() {
    return this.renderer;
  }

  /** @returns {SceneManager} */
  getSceneManager() {
    return this.sceneManager;
  }

  /**
   * Registers a per-frame update callback.
   * @param {(dt: number) => void} callback
   * @returns {() => void} Unsubscribe function
   */
  onUpdate(callback) {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  /**
   * Removes a registered update callback.
   * @param {(dt: number) => void} callback
   */
  removeUpdate(callback) {
    this.callbacks.delete(callback);
  }

  /**
   * Steps the engine by dt seconds.
   * @param {number} [dtOverride]
   */
  tick(dtOverride) {
    const dt = Math.min(dtOverride ?? this.clock.getDelta(), 0.1);
    for (const cb of this.callbacks) {
      cb(dt);
    }
    this.pipeline.render();
    this._frames++;
    const now = performance.now();
    if (now - this._lastFpsUpdate >= 1000) {
      this.fps = this._frames;
      this._frames = 0;
      this._lastFpsUpdate = now;
    }
  }

  /**
   * Starts the animation loop.
   */
  start() {
    if (this.running) return;
    this.running = true;
    this.clock.start();
    const loop = () => {
      if (!this.running) return;
      this.rafId = requestAnimationFrame(loop);
      this.tick();
    };
    this.rafId = requestAnimationFrame(loop);
  }

  /**
   * Stops the animation loop.
   */
  stop() {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

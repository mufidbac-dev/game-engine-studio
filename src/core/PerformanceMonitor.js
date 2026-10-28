/**
 * Tracks real-time FPS, draw calls, triangle counts, and geometry/texture memory.
 */
export class PerformanceMonitor {
  /**
   * @param {import('three').WebGLRenderer} renderer
   */
  constructor(renderer) {
    this.renderer = renderer;
  }

  /**
   * Returns current render pipeline metrics.
   * @param {number} currentFps
   */
  getMetrics(currentFps = 60) {
    const info = this.renderer?.info;
    return {
      fps: currentFps,
      drawCalls: info?.render?.calls ?? 0,
      triangles: info?.render?.triangles ?? 0,
      geometries: info?.memory?.geometries ?? 0,
      textures: info?.memory?.textures ?? 0
    };
  }
}

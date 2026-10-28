import * as THREE from 'three';

/**
 * Provides procedural and raycast-based terrain height queries.
 */
export class TerrainHeightProvider {
  /**
   * @param {THREE.Mesh} [terrainMesh]
   */
  constructor(terrainMesh = null) {
    this.terrainMesh = terrainMesh;
    this.raycaster = new THREE.Raycaster();
    this.downVector = new THREE.Vector3(0, -1, 0);
    this.amplitude = 4.0;
    this.frequency = 0.04;
  }

  /**
   * Computes procedural height with spawn-center flattening.
   * @param {number} x
   * @param {number} z
   * @param {number} [amplitude]
   * @param {number} [frequency]
   * @returns {number}
   */
  getProceduralHeight(x, z, amplitude = this.amplitude, frequency = this.frequency) {
    const distFromCenter = Math.sqrt(x * x + z * z);
    const flattenFactor = Math.min(1.0, Math.max(0.0, (distFromCenter - 5) / 10));
    const h =
      (Math.sin(x * frequency) * Math.cos(z * frequency) +
        Math.sin((x + z) * frequency * 0.5) * 0.5) *
      amplitude;
    return h * flattenFactor;
  }

  /**
   * Queries terrain height via raycast with procedural fallback.
   * @param {number} x
   * @param {number} z
   * @returns {number}
   */
  getHeight(x, z) {
    if (this.terrainMesh) {
      this.raycaster.set(new THREE.Vector3(x, 100, z), this.downVector);
      const hits = this.raycaster.intersectObject(this.terrainMesh, false);
      if (hits.length > 0) return hits[0].point.y;
    }
    return this.getProceduralHeight(x, z);
  }
}

import * as THREE from 'three';

/**
 * Smooth third-person follow camera with ground clearance clamping.
 */
export class ThirdPersonCamera {
  /**
   * @param {THREE.Camera} camera
   * @param {THREE.Object3D} target
   * @param {{ camDist?: number, camHeight?: number }} [config]
   */
  constructor(camera, target, config = {}) {
    this.camera = camera;
    this.target = target;
    this.distance = config.camDist ?? 8.0;
    this.height = config.camHeight ?? 3.5;
    this.lookTarget = new THREE.Vector3();
  }

  /**
   * @param {number} dt
   * @param {number} [groundY]
   */
  update(dt, groundY = 0) {
    const desiredTarget = this.target.position.clone().add(new THREE.Vector3(0, this.height * 0.6, 0));
    this.lookTarget.lerp(desiredTarget, Math.min(1, 8 * dt));

    const dir = this.camera.position.clone().sub(this.lookTarget);
    if (dir.lengthSq() < 0.001) dir.set(0, 0.3, 1);
    dir.normalize();

    const desiredPos = this.lookTarget.clone().add(dir.multiplyScalar(this.distance));
    desiredPos.y = Math.max(groundY + 1.5, this.lookTarget.y + this.height * 0.5);
    this.camera.position.lerp(desiredPos, Math.min(1, 6 * dt));
  }

  /** @param {number} d */
  setDistance(d) {
    this.distance = d;
  }

  /** @param {number} h */
  setHeight(h) {
    this.height = h;
  }
}

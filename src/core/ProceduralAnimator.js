import * as THREE from 'three';

/**
 * Handles procedural walk/run limb oscillation and static GLB bounce fallback.
 */
export class ProceduralAnimator {
  /**
   * @param {{ leftLeg?: THREE.Object3D, rightLeg?: THREE.Object3D, leftArm?: THREE.Object3D, rightArm?: THREE.Object3D }} [limbs]
   */
  constructor(limbs = {}) {
    this.limbs = limbs;
    this.walkCycleTime = 0;
  }

  /**
   * Updates procedural limb angles or bounce offset.
   * @param {number} dt
   * @param {boolean} isMoving
   * @param {boolean} isRunning
   * @param {boolean} isGrounded
   * @param {THREE.Object3D} [visualRoot]
   * @param {number} [baseYOffset]
   * @param {boolean} [isCustomGLB]
   */
  update(dt, isMoving, isRunning, isGrounded, visualRoot = null, baseYOffset = 0, isCustomGLB = false) {
    if (isMoving && isGrounded) {
      this.walkCycleTime += dt * (isRunning ? 14 : 9);
      if (!isCustomGLB && this.limbs.leftLeg) {
        this.limbs.leftLeg.rotation.x = Math.sin(this.walkCycleTime) * 0.65;
        this.limbs.rightLeg.rotation.x = -Math.sin(this.walkCycleTime) * 0.65;
        this.limbs.leftArm.rotation.x = -Math.sin(this.walkCycleTime) * 0.5;
        this.limbs.rightArm.rotation.x = Math.sin(this.walkCycleTime) * 0.5;
      } else if (visualRoot) {
        visualRoot.position.y = baseYOffset + Math.abs(Math.sin(this.walkCycleTime)) * 0.15;
      }
    } else if (!isCustomGLB && this.limbs.leftLeg) {
      this.limbs.leftLeg.rotation.x = THREE.MathUtils.lerp(this.limbs.leftLeg.rotation.x, 0, 10 * dt);
      this.limbs.rightLeg.rotation.x = THREE.MathUtils.lerp(this.limbs.rightLeg.rotation.x, 0, 10 * dt);
      this.limbs.leftArm.rotation.x = THREE.MathUtils.lerp(this.limbs.leftArm.rotation.x, 0, 10 * dt);
      this.limbs.rightArm.rotation.x = THREE.MathUtils.lerp(this.limbs.rightArm.rotation.x, 0, 10 * dt);
    }
  }
}

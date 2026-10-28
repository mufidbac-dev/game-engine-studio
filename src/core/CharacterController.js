import * as THREE from 'three';
import { ProceduralAnimator } from './ProceduralAnimator.js';

/**
 * Physics, terrain clamping, and visual rig controller for the player character.
 */
export class CharacterController {
  /**
   * @param {{ terrainHeightFn?: (x: number, z: number) => number, terrainSize?: number, config?: object }} [options]
   */
  constructor(options = {}) {
    this.terrainHeightFn = options.terrainHeightFn || (() => 0);
    this.terrainSize = options.terrainSize || 120;
    this.config = {
      walkSpeed: 6.0,
      runSpeed: 12.0,
      jumpForce: 10.0,
      gravity: 25.0,
      turnSpeed: 10.0,
      scale: 1.0,
      yOffset: 0.0,
      rotYOffset: 0,
      camDist: 8.0,
      camHeight: 3.5,
      ...(options.config || {})
    };

    this.root = new THREE.Group();
    this.root.position.set(0, 2, 0);
    this.visualRoot = new THREE.Group();
    this.root.add(this.visualRoot);

    this.velocity = new THREE.Vector3();
    this.isGrounded = false;
    this.isCustomGLB = false;
    this.mixer = null;
    this.limbs = {};
    this.animator = new ProceduralAnimator();

    this._buildDefaultRig();
  }

  _buildDefaultRig() {
    this.visualRoot.clear();
    this.isCustomGLB = false;
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3, metalness: 0.3 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const visorMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 0.6 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.75, 0.4), bodyMat);
    torso.position.y = 1.1;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.48), bodyMat);
    head.position.y = 1.78;
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.16, 0.1), visorMat);
    visor.position.set(0, 1.8, 0.22);

    const legGeo = new THREE.BoxGeometry(0.22, 0.65, 0.24);
    const leftLeg = new THREE.Mesh(legGeo, darkMat);
    leftLeg.position.set(-0.18, 0.35, 0);
    const rightLeg = new THREE.Mesh(legGeo, darkMat);
    rightLeg.position.set(0.18, 0.35, 0);

    const armGeo = new THREE.BoxGeometry(0.18, 0.6, 0.2);
    const leftArm = new THREE.Mesh(armGeo, darkMat);
    leftArm.position.set(-0.45, 1.1, 0);
    const rightArm = new THREE.Mesh(armGeo, darkMat);
    rightArm.position.set(0.45, 1.1, 0);

    group.add(torso, head, visor, leftLeg, rightLeg, leftArm, rightArm);
    this.limbs = { leftLeg, rightLeg, leftArm, rightArm, head };
    this.animator.limbs = this.limbs;
    this.visualRoot.add(group);
    this.applyCalibration();
  }

  applyCalibration() {
    const s = this.config.scale;
    this.visualRoot.scale.set(s, s, s);
    this.visualRoot.position.y = this.config.yOffset;
    this.visualRoot.rotation.y = THREE.MathUtils.degToRad(this.config.rotYOffset);
  }

  /**
   * Updates character movement, gravity, terrain clamping, and procedural animation.
   * @param {number} dt
   * @param {{ forward?: boolean, backward?: boolean, left?: boolean, right?: boolean, sprint?: boolean, jump?: boolean }} inputState
   * @param {THREE.Camera} [camera]
   */
  update(dt, inputState = {}, camera = null) {
    const cfg = this.config;
    const speed = inputState.sprint ? cfg.runSpeed : cfg.walkSpeed;

    const camForward = new THREE.Vector3(0, 0, -1);
    if (camera) {
      camera.getWorldDirection(camForward);
      camForward.y = 0;
      if (camForward.lengthSq() > 0.0001) camForward.normalize();
    }
    const camRight = new THREE.Vector3().crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveDir = new THREE.Vector3();
    if (inputState.forward) moveDir.add(camForward);
    if (inputState.backward) moveDir.sub(camForward);
    if (inputState.right) moveDir.add(camRight);
    if (inputState.left) moveDir.sub(camRight);

    const isMoving = moveDir.lengthSq() > 0.001;
    if (isMoving) {
      moveDir.normalize();
      this.root.position.x += moveDir.x * speed * dt;
      this.root.position.z += moveDir.z * speed * dt;

      const targetAngle = Math.atan2(moveDir.x, moveDir.z);
      const targetQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), targetAngle);
      this.root.quaternion.slerp(targetQuat, Math.min(1, cfg.turnSpeed * dt));
    }

    const halfLimit = this.terrainSize / 2 - 2;
    this.root.position.x = THREE.MathUtils.clamp(this.root.position.x, -halfLimit, halfLimit);
    this.root.position.z = THREE.MathUtils.clamp(this.root.position.z, -halfLimit, halfLimit);

    const groundY = this.terrainHeightFn(this.root.position.x, this.root.position.z);

    if (inputState.jump && this.isGrounded) {
      this.velocity.y = cfg.jumpForce;
      this.isGrounded = false;
    }

    this.velocity.y -= cfg.gravity * dt;
    this.root.position.y += this.velocity.y * dt;

    if (this.root.position.y <= groundY) {
      this.root.position.y = groundY;
      this.velocity.y = 0;
      this.isGrounded = true;
    }

    if (this.mixer) {
      this.mixer.update(dt);
    } else {
      this.animator.update(dt, isMoving, Boolean(inputState.sprint), this.isGrounded, this.visualRoot, cfg.yOffset, this.isCustomGLB);
    }
  }

  /** @returns {THREE.Vector3} */
  getPosition() {
    return this.root.position;
  }

  /** @param {THREE.Vector3} v */
  setPosition(v) {
    this.root.position.copy(v);
  }

  /** @returns {THREE.Group} */
  getVisualRoot() {
    return this.visualRoot;
  }

  resetToSpawn() {
    const y = this.terrainHeightFn(0, 0);
    this.root.position.set(0, y + 2, 0);
    this.velocity.set(0, 0, 0);
  }

  getConfig() {
    return { ...this.config };
  }

  updateConfig(partial) {
    Object.assign(this.config, partial);
    this.applyCalibration();
  }
}

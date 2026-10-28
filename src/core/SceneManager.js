import * as THREE from 'three';

/**
 * Registry and serializer for scene objects.
 */
export class SceneManager {
  /**
   * @param {THREE.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;
    /** @type {Map<string, THREE.Object3D>} */
    this.objects = new Map();
  }

  /**
   * Adds an Object3D to the scene and tracks its metadata.
   * @param {THREE.Object3D} object3D
   * @param {object} [metadata]
   * @returns {string} Object ID
   */
  add(object3D, metadata = {}) {
    const id = metadata.id || object3D.userData?.id || THREE.MathUtils.generateUUID().slice(0, 8);
    object3D.userData = {
      ...object3D.userData,
      ...metadata,
      id,
      isGameAsset: true,
      snapToGround: metadata.snapToGround ?? true
    };
    this.objects.set(id, object3D);
    this.scene.add(object3D);
    return id;
  }

  /**
   * Removes an object by ID.
   * @param {string} id
   * @returns {boolean}
   */
  remove(id) {
    const obj = this.objects.get(id);
    if (!obj) return false;
    this.scene.remove(obj);
    this.objects.delete(id);
    return true;
  }

  /**
   * Gets an object by ID.
   * @param {string} id
   * @returns {THREE.Object3D|null}
   */
  get(id) {
    return this.objects.get(id) || null;
  }

  /**
   * Returns all registered scene objects.
   * @returns {THREE.Object3D[]}
   */
  getAll() {
    return Array.from(this.objects.values());
  }

  /**
   * Removes all tracked objects from the scene.
   */
  clear() {
    for (const obj of this.objects.values()) {
      this.scene.remove(obj);
    }
    this.objects.clear();
  }

  /**
   * Serializes all tracked objects into a plain JSON-compatible structure.
   * @returns {{ objects: Array<object> }}
   */
  serialize() {
    return {
      objects: this.getAll().map((obj) => ({
        id: obj.userData.id,
        name: obj.name || 'Object',
        preset: obj.userData.preset || 'crate',
        position: obj.position.toArray(),
        rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
        scale: obj.scale.toArray(),
        userData: { ...obj.userData }
      }))
    };
  }

  /**
   * Reconstructs objects from serialized JSON using an optional factory callback.
   * @param {{ objects?: Array<object> }} json
   * @param {(entry: object) => THREE.Object3D} [factoryFn]
   */
  deserialize(json, factoryFn) {
    this.clear();
    const list = json?.objects || json?.assets || [];
    for (const item of list) {
      const obj = factoryFn ? factoryFn(item) : new THREE.Group();
      obj.name = item.name || 'Object';
      if (Array.isArray(item.position)) obj.position.fromArray(item.position);
      if (Array.isArray(item.rotation)) obj.rotation.set(item.rotation[0], item.rotation[1], item.rotation[2]);
      if (Array.isArray(item.scale)) obj.scale.fromArray(item.scale);
      this.add(obj, { ...(item.userData || {}), id: item.id, preset: item.preset });
    }
  }
}

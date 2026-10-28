import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Promise-based wrapper around Three.js GLTFLoader with shadow auto-configuration.
 */
export class GLTFLoaderWrapper {
  constructor(loaderInstance = null) {
    this.loader = loaderInstance || new GLTFLoader();
  }

  /**
   * Loads a GLB/GLTF from URL and enables shadows on all child meshes.
   * @param {string} url
   * @param {{ normalizeHeight?: number }} [options]
   * @returns {Promise<{ scene: THREE.Group, animations: THREE.AnimationClip[] }>}
   */
  load(url, options = {}) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (!child.material) {
                child.material = new THREE.MeshStandardMaterial({ color: 0x60a5fa });
              }
            }
          });

          if (options.normalizeHeight) {
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = maxDim > 0 ? options.normalizeHeight / maxDim : 1.0;
            model.scale.setScalar(scale);

            const newBox = new THREE.Box3().setFromObject(model);
            const center = newBox.getCenter(new THREE.Vector3());
            model.position.x -= center.x;
            model.position.z -= center.z;
            model.position.y -= newBox.min.y;
          }

          resolve({ scene: model, animations: gltf.animations || [] });
        },
        undefined,
        (err) => reject(err)
      );
    });
  }
}

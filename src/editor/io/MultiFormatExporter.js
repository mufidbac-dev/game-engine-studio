/**
 * Multi-Format Game Exporter supporting Playable HTML5, Binary GLB, GLTF, Wavefront OBJ, JSON, and Vite ES Module.
 */
export class MultiFormatExporter {
  constructor(sceneManager) {
    this.sceneManager = sceneManager;
    this.supportedFormats = ['html', 'glb', 'gltf', 'obj', 'json', 'vite-js'];
  }

  getSupportedFormats() {
    return [...this.supportedFormats];
  }

  exportJSON() {
    return JSON.stringify(this.sceneManager.serialize(), null, 2);
  }

  exportViteModule() {
    const json = this.exportJSON();
    return `export const exportedLevelConfig = ${json};\n`;
  }
}

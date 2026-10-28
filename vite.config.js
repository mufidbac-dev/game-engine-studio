import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@core': resolve(__dirname, 'src/core'),
      '@editor': resolve(__dirname, 'src/editor'),
      '@game': resolve(__dirname, 'src/game-framework'),
      '@gameplay': resolve(__dirname, 'src/gameplay-modules'),
      '@persistence': resolve(__dirname, 'src/persistence'),
      '@player': resolve(__dirname, 'src/player')
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        player: resolve(__dirname, 'player.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'vendor-three';
          if (id.includes('/src/core/')) return 'engine-core';
          if (id.includes('/src/game-framework/')) return 'game-framework';
          if (id.includes('/src/gameplay-modules/')) return 'genre-templates';
        }
      }
    }
  }
});

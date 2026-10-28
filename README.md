# game-engine-studio

Production-grade modular 3D Game Engine Studio powered by **Three.js** and **Vite**, integrated with an **AI Game Dev Copilot (API Key Ready)**, **Multi-Format Game Exporter (`.html`, `.glb`, `.gltf`, `.obj`, `.json`, `.js`)**, and **7 Playable Genre Templates**.

## Repository Remote

- **Origin**: `https://github.com/mufidbac-dev/game-engine-studio.git`
- **Branch**: `main`

## Push to GitHub (`mufidbac-dev/game-engine-studio`)

```bash
# Jika baru mengunduh game-engine-studio.zip (sudah memiliki git init & remote origin):
git push -u origin main

# Atau dari folder baru sesuai urutan standar GitHub:
echo "# game-engine-studio" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/mufidbac-dev/game-engine-studio.git
git add .
git commit -m "feat: add VGC 3D Game Engine Studio, AI Copilot & Multi-Format Exporter"
git push -u origin main
```

## Fitur Baru

1. **AI Game Studio Copilot (`src/editor/ai/AIAssistantService.js`)**:
   - Mendukung **Google Gemini API**, **OpenAI API**, **OpenRouter API**, serta **Smart Local Architect** (tanpa key).
   - Mampu menerjemahkan prompt bahasa alami menjadi aksi langsung di Scene 3D (mengubah genre, mengatur kontur bukit terrain, atmosfer cuaca, fisika karakter, dan melakukan spawn objek/musuh/NPC).
2. **Pengaturan Format Export Game (`src/editor/io/MultiFormatExporter.js`)**:
   - **Playable HTML5 (`.html`)**: Bundle satu file siap dimainkan di browser, itch.io, atau GitHub Pages.
   - **Binary 3D Scene (`.glb` & `.gltf`)**: Menggunakan Three.js `GLTFExporter` untuk diekspor ke Blender, Unity, Godot, atau Unreal Engine.
   - **Wavefront 3D Geometry (`.obj`)**: Mengekspor mesh vertex & face ke format `.obj`.
   - **Vite ES Module (`.module.js`) & Level Data (`.json`)**: Siap diimpor kembali ke dalam project lokal `game-engine-studio`.

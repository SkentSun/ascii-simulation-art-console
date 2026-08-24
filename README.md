# ASCII Simulation Art Console

A browser-based realtime ASCII renderer for 3D models, images, SVGs and video. It converts media into a configurable character field and can export still images, WebM recordings, or an embeddable Web Component.

## Highlights

- GLB/GLTF rendering with automatic fitting, rotation, pan and zoom
- Image, transparent SVG and looping video input
- Realtime GPU ASCII conversion with custom characters
- Three-stop character gradients, theme presets and blend modes
- 3D normal/depth analysis for geometric detail
- Subject isolation, density, contrast, noise and bloom controls
- Responsive canvas presets including 9:16, 16:9 and custom sizes
- Optional H1 and description layer with editable typography
- PNG, 15-second WebM and Web Component exports
- English and Chinese interface
- Self-contained production build with bundled demo media

## Tech stack

- JavaScript / HTML / CSS
- Three.js and WebGL
- Custom GLSL post-processing shaders
- GLTFLoader, DRACOLoader and MeshoptDecoder
- Canvas 2D for glyph atlases and banner typography
- MediaRecorder and Canvas Capture Stream for video export
- Vite with `vite-plugin-singlefile`

## Local development

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the URL printed by Vite.

## Production build

```bash
npm run build -- --outDir outputs/ascii-media-lab-single
```

The distributable is generated at:

```text
outputs/ascii-media-lab-single/index.html
```

The HTML contains the application code and default demo assets, so it can be opened directly without a server. For development and browser media consistency, using the Vite server is recommended.

## Controls

- Left drag: rotate a 3D model
- Middle drag: move media or banner copy
- Mouse wheel over canvas: zoom media
- Mouse wheel outside canvas: zoom the preview canvas

## Project structure

```text
src/main.js              Application, rendering pipeline and interactions
src/style.css            Interface and responsive styling
src/default-model.glb    Bundled default 3D model
src/default-image.svg    Bundled default SVG
src/default-video.mp4    Bundled default video
src/project-icon.jpg     Navigation and favicon artwork
docs/TECHNICAL_RECAP.md  Detailed implementation review
docs/SOCIAL_POST.md      Publish-ready social copy
```

## Browser notes

- WebGL 2-capable browsers are recommended.
- Video playback is muted by default to satisfy autoplay policies.
- WebM export depends on `MediaRecorder` codec support in the browser.
- Large embedded demo assets make the single-file build intentionally larger than a conventional web bundle.

## License

No license has been assigned. Add a license before accepting external contributions or redistributing third-party media assets.

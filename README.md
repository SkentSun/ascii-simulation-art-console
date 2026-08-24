# ASCII Simulation Art Console · ASCII 艺术模拟器

A browser-based realtime ASCII renderer for 3D models, images, SVGs and video. It converts media into a configurable character field and can export still images, WebM recordings, or an embeddable Web Component.

> 开源说明：本项目源于一篇 ASCII 网站效果素材帖，在社区反馈推动下用周末 vibecoding 完成，现以 MIT 协议开源，供大家自由取用与二次创作。

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

## Quick usage

1. Open **Controls** in the navigation bar.
2. Choose **3D**, **Image or SVG**, or **Video** as the input source.
3. Use the bundled sample or select/drag a local `.glb`, `.gltf`, image, `.svg`, `.mp4`, or `.webm` file.
4. Adjust the character size, density, character set, contrast, noise, bloom, subject isolation and color controls.
5. Choose a canvas preset such as 9:16 or 16:9. Custom pixel dimensions are also supported.
6. Enable the banner layer to edit the H1, description, font, alignment, sizes and text color.
7. Use **Export** to create a PNG, a 15-second WebM recording, or reusable frontend code.

All processing runs locally in the browser. Selected media is not uploaded by this application.

## Input behavior

| Source | Supported behavior |
| --- | --- |
| 3D | GLB/GLTF loading, automatic framing, depth/normal analysis, rotation, pan and zoom |
| Image | PNG/JPEG/WebP and other browser-supported formats, subject isolation, pan, zoom and character animation |
| SVG | Browser-rasterized transparent SVG preview with automatic fitting, pan and zoom |
| Video | Muted looping playback, realtime ASCII conversion, subject isolation, pan and zoom |

The controls panel automatically disables settings that do not apply to the selected media type.

## Production build

```bash
npm run build -- --outDir outputs/ascii-media-lab-single
```

The distributable is generated at:

```text
outputs/ascii-media-lab-single/index.html
```

The HTML contains the application code and default demo assets, so it can be opened directly without a server. For development and browser media consistency, using the Vite server is recommended.

## Interaction controls

| Pointer action | 3D mode | Image / SVG / video mode |
| --- | --- | --- |
| Left drag on canvas | Rotate model | Move media |
| Middle drag on media | Move model | Move media |
| Middle drag on banner text | Move banner text | Move banner text |
| Wheel on canvas | Zoom model | Zoom media |
| Wheel outside canvas | Zoom preview canvas | Zoom preview canvas |
| Double-click outside canvas | Reset preview to 90% | Reset preview to 90% |

The current shortcuts are always shown below the preview canvas.

## Export formats

- **PNG** — captures the current output at the configured canvas resolution.
- **WebM** — records 15 seconds from the live canvas using the browser's supported MediaRecorder codec.
- **Frontend code** — produces an embeddable implementation for integration into another page.

## Project structure

```text
src/main.js              Application, rendering pipeline and interactions
src/style.css            Interface and responsive styling
src/default-model.glb    Bundled default 3D model
src/default-image.svg    Bundled default SVG
src/default-video.mp4    Bundled default video
src/project-icon.jpg     Navigation and favicon artwork
docs/TECHNICAL_RECAP.md  Detailed implementation review
docs/SOCIAL_WECHAT.md     微信公众号长文（含 Vibecoding 故事线）
docs/SOCIAL_XIAOHONGSHU.md  小红书种草文案
docs/SOCIAL_DOUYIN.md    抖音配文（非口播）
LICENSE                  MIT license
```

## Browser notes

- WebGL 2-capable browsers are recommended.
- Video playback is muted by default to satisfy autoplay policies.
- WebM export depends on `MediaRecorder` codec support in the browser.
- Large embedded demo assets make the single-file build intentionally larger than a conventional web bundle.

## License

Released under the [MIT License](LICENSE).

The MIT license covers the project source code. Before redistributing bundled or user-supplied media, verify that you have the appropriate rights for those assets.

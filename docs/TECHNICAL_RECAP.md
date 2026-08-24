# Technical recap

## 1. Product idea

ASCII Simulation Art Console started as an attempt to reproduce an animated ASCII card effect. It evolved into a media tool that accepts 3D models, images, transparent SVGs and videos, then sends every source through one realtime character-rendering pipeline.

The central design decision was to avoid generating thousands of DOM text nodes. All source media is first rendered into a texture, and a fullscreen GPU shader converts that texture into a grid of glyphs. This keeps interaction responsive while parameters are adjusted continuously.

## 2. Unified media pipeline

Every source eventually becomes a Three.js texture:

- GLB/GLTF is loaded with `GLTFLoader`, with Draco and Meshopt decoding support.
- Raster images become `THREE.Texture` objects.
- SVG files are parsed, normalized, rasterized at high resolution and cropped to visible alpha bounds before becoming a canvas texture.
- MP4/WebM files use `THREE.VideoTexture` and update automatically during playback.

The texture is rendered into an offscreen `WebGLRenderTarget`. A fullscreen post-processing pass samples one point per character cell and maps its luminance, depth and position to a glyph and color.

## 3. ASCII shader

The glyph set is drawn once into a Canvas 2D atlas. In the fragment shader, the viewport is divided by the selected cell size. Each grid cell:

1. Samples the source texture at the cell center.
2. Calculates luminance and applies contrast and procedural noise.
3. Applies subject isolation and density rules.
4. Chooses a glyph from the atlas.
5. Applies character scale, opacity and spacing.
6. Colors the glyph with a three-stop directional gradient.
7. Optionally blends the source media underneath.

Because binary character sets have very similar visual weight, the 3D path also changes glyph scale and opacity. This allows `0` and `1` to describe surface relief instead of forming a uniform block.

## 4. 3D structure analysis

Generic downloaded GLBs vary in scale, origin and material quality. Models are wrapped in normalization groups, measured with `Box3`, centered and fitted to the current canvas.

The analysis pass uses a dedicated view-normal shader instead of trusting the original model materials. It generates controlled grayscale shading from surface orientation, so facial features and sculptural forms remain visible even when the source material is overexposed or unlit.

A depth texture is rendered in parallel. Its useful near/far range is recalculated from the transformed model every frame. The ASCII shader combines:

- normalized camera depth;
- local depth gradients;
- depth curvature;
- silhouette transitions;
- view-normal shading.

This creates a more stable structural signal while the model rotates, moves or zooms.

## 5. Image and SVG handling

Transparent SVG files required additional normalization. The implementation reads the SVG dimensions or viewBox, renders it to a 2K canvas and examines alpha pixels to find the actual visible subject bounds. The result is cropped with a small safety margin before entering the media pipeline.

Subject isolation for raster media samples the environment near the media bounds, compares nearby pixels and combines that difference with a center-weighted mask. Cleanup voting and edge controls suppress scattered background glyphs.

## 6. Motion and effects

Static images can animate only their character layer while the source remains unchanged. Available effects include digital rain, wave pulses, scanlines and glitches. 3D models can use the same character animation system independently of model rotation.

Bloom is implemented as an additional render-target pass. It samples neighboring ASCII pixels and blends a thresholded halo differently for light and dark backgrounds.

## 7. Canvas and typography

The renderer supports fixed aspect-ratio presets and arbitrary pixel dimensions. Internal render targets are resized at the requested resolution rather than scaling one fixed canvas, which keeps text and glyphs sharp.

Banner typography is drawn to its own high-resolution Canvas 2D texture. H1 and description sizes use real pixel units, preserve manual line breaks and share the same rendering method across landscape and portrait canvases.

## 8. Interaction

- Left drag rotates 3D content.
- Middle drag moves media or the banner text layer.
- The wheel zooms content when the pointer is over the canvas.
- The wheel scales the preview when the pointer is outside the canvas.

All transforms are stored separately for media and typography, preventing a canvas move from accidentally changing the pixels inside an image or video.

## 9. Themes and color

Canvas themes define background, page background, copy color and a three-stop glyph gradient. The page environment follows the canvas theme, while users can override glyph colors with four recommended palettes or individual color inputs.

The interface supports light and dark modes, English and Chinese labels, and a compact glass navigation bar. Native dropdown arrows were replaced with theme-aware SVG arrows to maintain exact spacing across browsers.

## 10. Export

- PNG uses the final WebGL canvas.
- WebM captures the canvas at 30 FPS through `captureStream()` and records 15 seconds with `MediaRecorder`.
- Code export produces an embeddable Web Component rather than a full standalone webpage.

Vite and `vite-plugin-singlefile` produce a portable HTML build. The default GLB, SVG, MP4 and project icon are inlined, which makes the artifact easy to demonstrate offline at the cost of a larger file.

## 11. Main engineering lessons

1. ASCII clarity depends on glyph weight, size and opacity—not only on glyph selection.
2. A dedicated analysis material is more reliable than arbitrary GLB materials.
3. Nonlinear depth must be linearized and normalized to the actual object range.
4. SVG viewBox bounds rarely equal visible artwork bounds.
5. Preview scaling and render resolution must remain separate.
6. A useful creative tool needs predictable defaults as much as it needs many parameters.

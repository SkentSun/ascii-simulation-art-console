import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";
import dracoDecoderSource from "three/examples/jsm/libs/draco/draco_decoder.js?raw";
import projectIconUrl from "./project-icon.jpg";
import defaultVideoUrl from "./default-video.mp4";
import defaultModelUrl from "./default-model.glb?url";
import defaultImageSource from "./default-image.svg?raw";
import "./style.css";
document.querySelector("#app").innerHTML = `<main class="shell" data-theme="light"><header class="topbar"><div class="brandLock"><span class="brandMark">A</span><div><strong>ASCII//FORGE</strong><small>Realtime Media Lab</small></div></div><div class="topActions"><select id="canvasPreset" aria-label="\u753B\u5E03\u6A21\u677F"><option value="wide">\u901A\u680F \xB7 1920\xD7640</option><option value="square">1:1 \xB7 1080\xD71080</option><option value="4:3">4:3 \xB7 1600\xD71200</option><option value="3:4">3:4 \xB7 1200\xD71600</option><option value="16:9" selected>16:9 \xB7 1920\xD71080</option><option value="9:16">9:16 \xB7 1080\xD71920</option><option value="custom">\u81EA\u5B9A\u4E49\u5C3A\u5BF8</option></select><select id="canvasScheme" aria-label="\u753B\u5E03\u914D\u8272"><option value="dark">\u6697\u8272\u9713\u8679</option><option value="light" selected>\u4EAE\u8272\u58A8\u6C34</option><option value="matrix">\u77E9\u9635\u7EFF</option><option value="ember">\u7194\u5CA9\u6A59</option><option value="ultraviolet">\u7D2B\u5916\u7EBF</option></select><div class="customSize" id="customSize"><input id="canvasWidth" type="number" value="1920" min="64" max="4096"><span>\xD7</span><input id="canvasHeight" type="number" value="1080" min="64" max="4096"></div><button id="themeBtn" class="iconBtn" title="\u5207\u6362\u4E3B\u9898">\u25D0</button><button id="controlsBtn" class="primaryBtn">\u53C2\u6570\u63A7\u5236\u53F0</button><div class="exportWrap"><button id="exportBtn" class="accentBtn">\u5BFC\u51FA \u25BE</button><div class="exportMenu" id="exportMenu"><button data-export="image">PNG \u56FE\u7247</button><button data-export="video">WebM \u89C6\u9891 \xB7 5\u79D2</button><button data-export="code">JavaScript \u914D\u7F6E</button></div></div></div></header><aside class="panel" id="controlsPanel"><div class="panelHead"><div><span class="eyebrow">CONTROL MATRIX</span><h2>\u6548\u679C\u53C2\u6570</h2></div><button id="closeControls" class="closeBtn">\xD7</button></div><div class="panelScroll"><div class="brand">ASCII / MEDIA LAB</div><h1>Render anything<br>as characters.</h1><p class="intro">\u56FE\u7247\u3001\u89C6\u9891\u548C GLB \u90FD\u7ECF\u8FC7\u540C\u4E00\u4E2A\u5B9E\u65F6 WebGL ASCII \u540E\u5904\u7406\u7BA1\u7EBF\u3002</p>
<section class="group"><div class="label"><span>\u8F93\u5165\u6E90</span><span id="sourceName">\u5185\u7F6E 3D</span></div><div class="seg"><button data-demo="3d" class="active">3D</button><button data-demo="image">\u56FE\u7247\u6216 SVG</button><button data-demo="video">\u89C6\u9891</button></div><label class="upload" style="margin-top:6px">\u9009\u62E9\u672C\u5730\u6587\u4EF6<input id="file" type="file" accept="image/*,video/*,.glb,.gltf"></label></section>
<section class="group"><div class="label"><span>3D \u65CB\u8F6C\u901F\u5EA6</span><span id="rotationVal">0.50\xD7</span></div><input id="rotation" type="range" min="-200" max="200" value="50"><p class="note">0 \u505C\u6B62\u65CB\u8F6C\uFF1B\u8D1F\u503C\u53CD\u5411\u65CB\u8F6C\u3002\u62D6\u52A8\u753B\u9762\u4ECD\u53EF\u624B\u52A8\u8C03\u6574\u89C6\u89D2\u3002</p></section>
<section class="group"><div class="label"><span>\u5B57\u7B26\u5927\u5C0F</span><span id="cellVal">7 px</span></div><input id="cell" type="range" min="5" max="20" value="7"></section>
<section class="group"><div class="label"><span>\u5B57\u7B26\u5BC6\u5EA6</span><span id="densityVal">60%</span></div><input id="density" type="range" min="0" max="100" value="60"><p class="note">\u5BC6\u5EA6\u53EA\u6539\u53D8\u5B57\u7B26\u8986\u76D6\u91CF\uFF0C\u4E0D\u6539\u53D8\u5B57\u7B26\u5C3A\u5BF8\u548C\u7F51\u683C\u5206\u8FA8\u7387\u3002</p></section>
<section class="group"><div class="label"><span>\u5BF9\u6BD4\u5EA6</span><span id="contrastVal">0.85</span></div><input id="contrast" type="range" min="40" max="500" value="85"></section>
<section class="group"><div class="label"><span>\u566A\u70B9</span><span id="noiseVal">8%</span></div><input id="noise" type="range" min="0" max="100" value="8"></section>
<section class="group"><div class="label"><span>\u56FE\u7247\u5B57\u7B26\u52A8\u753B</span><span id="imageAnimationVal">\u6570\u5B57\u7011\u5E03</span></div><select id="imageAnimation"><option value="1" selected>\u6570\u5B57\u7011\u5E03</option><option value="2">\u6CE2\u6D6A\u8109\u51B2</option><option value="3">\u626B\u63CF\u7EBF</option><option value="4">\u6570\u5B57\u6545\u969C</option><option value="0">\u5173\u95ED\u52A8\u753B</option></select><div class="label" style="margin-top:13px"><span>\u52A8\u753B\u5F3A\u5EA6</span><span id="imageAnimationStrengthVal">45%</span></div><input id="imageAnimationStrength" type="range" min="0" max="100" value="45"><p class="note">\u4EC5\u5728\u56FE\u7247\u6A21\u5F0F\u4E0B\u751F\u6548\uFF0C\u539F\u59CB\u56FE\u7247\u4FDD\u6301\u9759\u6B62\uFF0C\u52A8\u753B\u53EA\u9A71\u52A8\u5B57\u7B26\u5C42\u3002</p></section>
<section class="group"><div class="label"><span>3D \u6DF1\u5EA6\u5B57\u7B26</span><span id="depthStrengthVal">90%</span></div><input id="depthStrength" type="range" min="0" max="100" value="90"><p class="note">\u6839\u636E\u5F53\u524D\u6A21\u578B\u7684\u5B9E\u9645\u8FD1\u8FDC\u8868\u9762\u81EA\u9002\u5E94\u63D0\u53D6\u6DF1\u5EA6\u3001\u8FB9\u7F18\u548C\u5C40\u90E8\u66F2\u7387\uFF0C0% \u6062\u590D\u4E3A\u7EAF\u5149\u7167\u6620\u5C04\u3002</p></section>
<section class="group"><div class="label"><span>Bloom \u5F3A\u5EA6</span><span id="bloomVal">140%</span></div><input id="bloom" type="range" min="0" max="300" value="140"><div class="label" style="margin-top:13px"><span>\u8F89\u5149\u534A\u5F84</span><span id="bloomRadiusVal">2.0</span></div><input id="bloomRadius" type="range" min="0" max="400" value="200"><div class="label" style="margin-top:13px"><span>\u8F89\u5149\u9608\u503C</span><span id="bloomThresholdVal">6%</span></div><input id="bloomThreshold" type="range" min="0" max="100" value="6"></section>
<section class="group"><div class="label"><span>\u5B57\u7B26\u7C7B\u578B</span><span id="charsetVal">\u81EA\u5B9A\u4E49</span></div><select id="charset"><option value="classic">\u7ECF\u5178\u6E10\u53D8</option><option value="blocks">\u5757\u72B6\u50CF\u7D20</option><option value="binary">\u4E8C\u8FDB\u5236</option><option value="matrix">\u77E9\u9635\u5B57\u7B26</option><option value="minimal">\u6781\u7B80\u7B26\u53F7</option><option value="custom" selected>\u81EA\u5B9A\u4E49</option></select><div class="label" style="margin-top:14px"><span>\u81EA\u5B9A\u4E49\u5B57\u7B26</span><span id="customCharsVal">14 \u5B57\u7B26</span></div><input id="customChars" type="text" maxlength="64" value="00100101010111" placeholder="\u4F8B\u5982\uFF1A\xB7+=#\u4F60\u597D\u4E16\u754C" autocomplete="off"></section>
<section class="group"><label class="check"><input id="showCopy" type="checkbox" checked> \u663E\u793A Banner \u6587\u6848</label><div class="label" style="margin-top:14px"><span>H1 \u6807\u9898</span><span>HEADLINE</span></div><input id="headlineText" type="text" maxlength="80" value="MAKE SIGNAL VISIBLE."><div class="label" style="margin-top:14px"><span>\u7B80\u4ECB\u6587\u5B57</span><span>DESCRIPTION</span></div><textarea id="introText" maxlength="180">Transform images, video and 3D models into expressive realtime ASCII compositions for banners, motion graphics and digital experiences.</textarea><div class="label" style="margin-top:14px"><span>\u672C\u5730\u5B57\u4F53</span><span id="fontStatus">SERIF</span></div><select id="copyFont"><option value="Georgia">Georgia</option><option value="Times New Roman">Times New Roman</option><option value="Songti SC">\u5B8B\u4F53 \xB7 Songti SC</option><option value="Baskerville">Baskerville</option><option value="Didot">Didot</option><option value="system-ui">\u7CFB\u7EDF\u65E0\u886C\u7EBF\u4F53</option></select><div class="fontActions"><button id="loadLocalFonts" type="button">\u8BFB\u53D6\u672C\u673A\u5B57\u4F53</button><label>\u5BFC\u5165\u5B57\u4F53\u6587\u4EF6<input id="fontFile" type="file" accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2"></label></div><div class="label" style="margin-top:14px"><span>\u6587\u5B57\u5BF9\u9F50</span><span id="copyAlignVal">\u5DE6\u5BF9\u9F50</span></div><select id="copyAlign"><option value="left">\u5DE6\u5BF9\u9F50</option><option value="center">\u5C45\u4E2D</option><option value="right">\u53F3\u5BF9\u9F50</option></select><div class="label" style="margin-top:14px"><span>H1 \u5B57\u53F7</span><span id="copyScaleVal">100%</span></div><input id="copyScale" type="range" min="50" max="180" value="100"><div class="label" style="margin-top:14px"><span>\u7B80\u4ECB\u5B57\u53F7</span><span id="introScaleVal">100%</span></div><input id="introScale" type="range" min="50" max="220" value="100"><label class="check" style="margin-top:14px"><input id="autoCopyColor" type="checkbox" checked> \u6587\u5B57\u989C\u8272\u8DDF\u968F\u4E3B\u9898</label><div class="label" style="margin-top:12px"><span>\u6587\u5B57\u989C\u8272</span><span id="copyColorVal">#FFFFFF</span></div><input id="copyColor" type="color" value="#ffffff"></section>
<section class="group"><div class="label"><span>\u63A8\u8350\u8272\u7CFB</span><span>PRESETS</span></div><div class="paletteGrid"><button data-palette="neon" title="Neon Pulse"></button><button data-palette="plasma" title="Plasma"></button><button data-palette="toxic" title="Toxic Lime"></button><button data-palette="ice" title="Ice Signal"></button></div><div class="label" style="margin-top:14px"><span>\u6E10\u53D8\u8272 A</span><span id="charColorVal">#7C4DFF</span></div><input id="charColor" type="color" value="#7c4dff"><div class="label" style="margin-top:14px"><span>\u6E10\u53D8\u8272 B</span><span id="charColorMidVal">#FF2FB3</span></div><input id="charColorMid" type="color" value="#ff2fb3"><div class="label" style="margin-top:14px"><span>\u6E10\u53D8\u8272 C</span><span id="charColorEndVal">#19DFFF</span></div><input id="charColorEnd" type="color" value="#19dfff"><div class="label" style="margin-top:14px"><span>\u6E10\u53D8\u89D2\u5EA6</span><span id="gradientAngleVal">45\xB0</span></div><input id="gradientAngle" type="range" min="0" max="360" value="45"><div class="label" style="margin-top:14px"><span>\u80CC\u666F\u989C\u8272</span><span id="bgColorVal">#070812</span></div><input id="bgColor" type="color" value="#070812"></section>
<section class="group"><div class="label"><span>\u7D20\u6750\u989C\u8272\u6DF7\u5408</span><span id="colorVal">35%</span></div><input id="color" type="range" min="0" max="100" value="35"></section>
<section class="group"><div class="label"><span>\u80CC\u666F\u4E0D\u900F\u660E\u5EA6</span><span id="bgOpacityVal">100%</span></div><input id="bgOpacity" type="range" min="0" max="100" value="100"><div class="label" style="margin-top:14px"><span>\u539F\u59CB\u7D20\u6750\u53E0\u52A0</span><span id="sourceOverlayVal">0%</span></div><input id="sourceOverlay" type="range" min="0" max="100" value="0"><div class="label" style="margin-top:14px"><span>\u989C\u8272\u6DF7\u5408\u6A21\u5F0F</span><span id="blendModeVal">\u6B63\u5E38</span></div><select id="blendMode"><option value="0">\u6B63\u5E38</option><option value="1">\u6B63\u7247\u53E0\u5E95</option><option value="2">\u6EE4\u8272</option><option value="3">\u53E0\u52A0</option><option value="4">\u67D4\u5149</option><option value="5">\u5DEE\u503C</option><option value="6">\u52A0\u8272</option></select><p class="note">\u900F\u660E\u5E95\u8BBE\u4E3A 0% \u53EF\u53EA\u4FDD\u7559\u5B57\u7B26\u5C42\uFF1B\u63D0\u9AD8\u7D20\u6750\u53E0\u52A0\u53EF\u5728\u5B57\u7B26\u4E0B\u65B9\u663E\u793A\u539F\u59CB\u753B\u9762\u3002</p></section>
<section class="group"><label class="check"><input id="isolate" type="checkbox" checked> \u81EA\u52A8\u7A81\u51FA\u4E3B\u4F53</label><div class="label" style="margin-top:13px"><span>\u5206\u79BB\u5F3A\u5EA6</span><span id="isolationVal">58%</span></div><input id="isolation" type="range" min="5" max="95" value="58"><div class="label" style="margin-top:13px"><span>\u566A\u70B9\u6E05\u7406</span><span id="cleanupVal">70%</span></div><input id="cleanup" type="range" min="0" max="100" value="70"><div class="label" style="margin-top:13px"><span>\u8FB9\u7F18\u88C1\u5207</span><span id="edgeCropVal">0%</span></div><input id="edgeCrop" type="range" min="0" max="15" value="0"></section>
<section class="group"><label class="check"><input id="invert" type="checkbox" checked> \u53CD\u8F6C\u660E\u6697</label><p class="note">\u4E3B\u4F53\u5206\u79BB\u4F1A\u91C7\u6837\u753B\u9762\u56DB\u89D2\u7684\u73AF\u5883\u989C\u8272\uFF0C\u5E76\u7ED3\u5408\u4E2D\u5FC3\u6743\u91CD\u751F\u6210\u5B9E\u65F6\u906E\u7F69\u3002\u80CC\u666F\u590D\u6742\u65F6\u53EF\u63D0\u9AD8\u5206\u79BB\u5F3A\u5EA6\u3002</p></section></div></aside>
<section class="stage"><div class="stageGrid"></div><section class="viewport" id="viewport"><div class="hud"><span class="badge">LIVE ASCII CORE</span><span class="badge" id="canvasReadout">1920 \xD7 1080</span><span class="badge" id="fps">WebGL</span></div><div class="drop" id="drop"><span>DROP MEDIA TO INITIALIZE</span></div><div class="status" id="status">LEFT DRAG ROTATE \xB7 MIDDLE DRAG MOVE \xB7 WHEEL ZOOM</div></section><div class="stageFooter"><span>GPU PIPELINE // READY</span><span class="interactionHelp" id="interactionHelp"></span><span id="recordStatus">REC STANDBY</span></div></section></main>`;
const viewport = document.querySelector("#viewport"), stage = document.querySelector(".stage"), statusEl = document.querySelector("#status"), interactionHelp = document.querySelector("#interactionHelp"), sourceName = document.querySelector("#sourceName");
document.querySelector('[data-export="code"]').textContent = "Standalone HTML \u5E94\u7528";
document.querySelector('[data-export="video"]').textContent = "WebM \u89C6\u9891 \xB7 15\u79D2";
document.querySelector("#showCopy").checked = true;
document.querySelector(".brandLock strong").textContent = "ASCII simulation art console";
const brandMark = document.querySelector(".brandMark");
brandMark.innerHTML = `<img src="${projectIconUrl}" alt="">`;
brandMark.setAttribute("aria-hidden", "true");
let favicon = document.querySelector('link[rel="icon"]');
if (!favicon) {
  favicon = document.createElement("link");
  favicon.rel = "icon";
  document.head.append(favicon);
}
favicon.href = projectIconUrl;
document.querySelector('[data-export="code"]').textContent = "Web Component \xB7 JS";
const langButton = document.createElement("button");
langButton.id = "langBtn";
langButton.className = "iconBtn langBtn";
langButton.type = "button";
langButton.setAttribute("aria-label", "Switch language");
document.querySelector("#themeBtn").before(langButton);
const zhToEn = new Map(Object.entries({
  "WebM \u89C6\u9891 \xB7 15\u79D2": "WebM video \xB7 15 sec",
  "\u901A\u680F \xB7 1920\xD7640": "Wide \xB7 1920\xD7640", "\u81EA\u5B9A\u4E49\u5C3A\u5BF8": "Custom size", "\u53C2\u6570\u63A7\u5236\u53F0": "Controls", "\u5BFC\u51FA \u25BE": "Export \u25BE", "PNG \u56FE\u7247": "PNG image", "WebM \u89C6\u9891 \xB7 5\u79D2": "WebM video \xB7 5 sec", "\u6548\u679C\u53C2\u6570": "Effect controls",
  "\u8F93\u5165\u6E90": "Input source", "\u5185\u7F6E 3D": "Built-in 3D", "\u793A\u4F8B\u56FE\u7247": "Sample image", "\u52A8\u6001\u753B\u5E03": "Motion canvas", "\u56FE\u7247\u6216 SVG": "Image or SVG", "\u89C6\u9891": "Video", "\u9009\u62E9\u672C\u5730\u6587\u4EF6": "Choose local file", "3D \u65CB\u8F6C\u901F\u5EA6": "3D rotation speed", "0 \u505C\u6B62\u65CB\u8F6C\uFF1B\u8D1F\u503C\u53CD\u5411\u65CB\u8F6C\u3002\u62D6\u52A8\u753B\u9762\u4ECD\u53EF\u624B\u52A8\u8C03\u6574\u89C6\u89D2\u3002": "0 stops rotation; negative values reverse it. Drag the canvas to adjust the view manually.",
  "\u5B57\u7B26\u5927\u5C0F": "Character size", "\u5B57\u7B26\u5BC6\u5EA6": "Character density", "\u5BC6\u5EA6\u53EA\u6539\u53D8\u5B57\u7B26\u8986\u76D6\u91CF\uFF0C\u4E0D\u6539\u53D8\u5B57\u7B26\u5C3A\u5BF8\u548C\u7F51\u683C\u5206\u8FA8\u7387\u3002": "Density changes character coverage without changing character size or grid resolution.", "\u5BF9\u6BD4\u5EA6": "Contrast", "\u566A\u70B9": "Noise",
  "\u56FE\u7247 / 3D \u5B57\u7B26\u52A8\u753B": "Image / 3D character animation", "\u6570\u5B57\u7011\u5E03": "Digital rain", "\u6CE2\u6D6A\u8109\u51B2": "Wave pulse", "\u626B\u63CF\u7EBF": "Scanline", "\u6570\u5B57\u6545\u969C": "Digital glitch", "\u5173\u95ED\u52A8\u753B": "Animation off", "\u52A8\u753B\u5F3A\u5EA6": "Animation strength", "\u5728\u56FE\u7247\u548C 3D \u6A21\u5F0F\u4E0B\u751F\u6548\uFF1B\u539F\u59CB\u7D20\u6750\u4FDD\u6301\u4E0D\u53D8\uFF0C\u52A8\u753B\u53EA\u9A71\u52A8\u5B57\u7B26\u5C42\u3002": "Available for images and 3D. The source stays unchanged; only the character layer is animated.",
  "3D \u6DF1\u5EA6\u5B57\u7B26": "3D depth mapping", "\u6839\u636E\u5F53\u524D\u6A21\u578B\u7684\u5B9E\u9645\u8FD1\u8FDC\u8868\u9762\u81EA\u9002\u5E94\u63D0\u53D6\u6DF1\u5EA6\u3001\u8FB9\u7F18\u548C\u5C40\u90E8\u66F2\u7387\uFF0C0% \u6062\u590D\u4E3A\u7EAF\u5149\u7167\u6620\u5C04\u3002": "Adaptively extracts depth, edges and local curvature from the model's actual near and far surfaces. Set to 0% for lighting-only mapping.", "Bloom \u5F3A\u5EA6": "Bloom intensity", "\u8F89\u5149\u534A\u5F84": "Bloom radius", "\u8F89\u5149\u9608\u503C": "Bloom threshold",
  "\u5B57\u7B26\u7C7B\u578B": "Character set", "\u7ECF\u5178\u6E10\u53D8": "Classic ramp", "\u5757\u72B6\u50CF\u7D20": "Block pixels", "\u4E8C\u8FDB\u5236": "Binary", "\u77E9\u9635\u5B57\u7B26": "Matrix glyphs", "\u6781\u7B80\u7B26\u53F7": "Minimal symbols", "\u81EA\u5B9A\u4E49": "Custom", "\u81EA\u5B9A\u4E49\u5B57\u7B26": "Custom characters",
  "\u663E\u793A Banner \u6587\u6848": "Show banner copy", "H1 \u6807\u9898": "H1 headline", "\u7B80\u4ECB\u6587\u5B57": "Description", "\u5728\u7EBF\u5B57\u4F53": "Online font", "\u6587\u5B57\u5BF9\u9F50": "Text alignment", "\u5DE6\u5BF9\u9F50": "Left", "\u5C45\u4E2D": "Center", "\u53F3\u5BF9\u9F50": "Right", "H1 \u5B57\u53F7": "H1 size", "\u7B80\u4ECB\u5B57\u53F7": "Description size", "\u6587\u5B57\u989C\u8272\u8DDF\u968F\u4E3B\u9898": "Auto text color", "\u6587\u5B57\u989C\u8272": "Text color",
  "\u753B\u5E03\u914D\u8272": "Canvas theme", "\u63A8\u8350\u8272\u7CFB": "Color presets", "\u6E10\u53D8\u8272 A": "Gradient color A", "\u6E10\u53D8\u8272 B": "Gradient color B", "\u6E10\u53D8\u8272 C": "Gradient color C", "\u6E10\u53D8\u89D2\u5EA6": "Gradient angle", "\u80CC\u666F\u989C\u8272": "Background color", "\u7D20\u6750\u989C\u8272\u6DF7\u5408": "Source color mix", "\u80CC\u666F\u4E0D\u900F\u660E\u5EA6": "Background opacity", "\u539F\u59CB\u7D20\u6750\u53E0\u52A0": "Source overlay", "\u989C\u8272\u6DF7\u5408\u6A21\u5F0F": "Blend mode",
  "\u6B63\u5E38": "Normal", "\u6B63\u7247\u53E0\u5E95": "Multiply", "\u6EE4\u8272": "Screen", "\u53E0\u52A0": "Overlay", "\u67D4\u5149": "Soft light", "\u5DEE\u503C": "Difference", "\u52A0\u8272": "Add", "\u900F\u660E\u5E95\u8BBE\u4E3A 0% \u53EF\u53EA\u4FDD\u7559\u5B57\u7B26\u5C42\uFF1B\u63D0\u9AD8\u7D20\u6750\u53E0\u52A0\u53EF\u5728\u5B57\u7B26\u4E0B\u65B9\u663E\u793A\u539F\u59CB\u753B\u9762\u3002": "Set background opacity to 0% for characters only. Increase source overlay to reveal the original media beneath them.",
  "\u81EA\u52A8\u7A81\u51FA\u4E3B\u4F53": "Auto-isolate subject", "\u5206\u79BB\u5F3A\u5EA6": "Isolation strength", "\u566A\u70B9\u6E05\u7406": "Noise cleanup", "\u8FB9\u7F18\u88C1\u5207": "Edge crop", "\u53CD\u8F6C\u660E\u6697": "Invert luminance", "\u4E3B\u4F53\u5206\u79BB\u4F1A\u91C7\u6837\u753B\u9762\u56DB\u89D2\u7684\u73AF\u5883\u989C\u8272\uFF0C\u5E76\u7ED3\u5408\u4E2D\u5FC3\u6743\u91CD\u751F\u6210\u5B9E\u65F6\u906E\u7F69\u3002\u80CC\u666F\u590D\u6742\u65F6\u53EF\u63D0\u9AD8\u5206\u79BB\u5F3A\u5EA6\u3002": "Subject isolation samples corner colors and combines them with center weighting. Increase isolation strength for complex backgrounds.",
  "Paper \xB7 \u767D\u5E95\u9ED1\u56FE": "Paper \xB7 White / Black", "Inverse \xB7 \u9ED1\u5E95\u767D\u56FE": "Inverse \xB7 Black / White", "Cobalt \xB7 \u84DD\u5E95\u767D\u56FE": "Cobalt \xB7 Blue / White", "Prism \xB7 \u767D\u5E95\u84DD\u7D2B\u6E10\u53D8": "Prism \xB7 White / Violet", "Terminal \xB7 \u9ED1\u5E95\u7EFF\u56FE": "Terminal \xB7 Black / Green", "Signal \xB7 \u7EA2\u5E95\u767D\u56FE": "Signal \xB7 Red / White"
}));
const originalLanguageText = new WeakMap();
let currentLanguage = "en";
function translateTextNode(node) {
  if (node.nodeType !== Node.TEXT_NODE) return;
  const raw = node.nodeValue, value = raw.trim();
  let translated = zhToEn.get(value);
  const characterCount = value.match(/^(\d+) \u5B57\u7B26$/);
  if (!translated && characterCount) translated = characterCount[1] + " characters";
  if (!translated) return;
  originalLanguageText.set(node, raw);
  node.nodeValue = raw.replace(value, translated);
}
function walkLanguage(root, action) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) action(node);
}
function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  if (language === "en") walkLanguage(document.body, translateTextNode);
  else walkLanguage(document.body, (node) => {
    if (originalLanguageText.has(node)) node.nodeValue = originalLanguageText.get(node);
  });
  document.querySelector("#customChars")?.setAttribute("placeholder", language === "en" ? "e.g. 00101\xB7+=#ASCII" : "\u4F8B\u5982\uFF1A\xB7+=#\u4F60\u597D\u4E16\u754C");
  langButton.textContent = language === "en" ? "\u4E2D\u6587" : "EN";
  langButton.title = language === "en" ? "\u5207\u6362\u5230\u4E2D\u6587" : "Switch to English";
}
new MutationObserver((mutations) => {
  if (currentLanguage !== "en") return;
  for (const mutation of mutations) {
    if (mutation.type === "characterData") translateTextNode(mutation.target);
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      else if (node.nodeType === Node.ELEMENT_NODE) walkLanguage(node, translateTextNode);
    });
  }
}).observe(document.body, { subtree: true, childList: true, characterData: true });
langButton.onclick = () => {
  setLanguage(currentLanguage === "en" ? "zh" : "en");
  updateInteractionHelp(currentMode);
};
setLanguage("en");
const headlineField = document.querySelector("#headlineText"), headlineArea = document.createElement("textarea");
headlineArea.id = "headlineText";
headlineArea.maxLength = 160;
headlineArea.rows = 3;
headlineArea.value = "ASCII\nSIMULATION MAKE SIGNAL VISIBLE.";
headlineField.replaceWith(headlineArea);
const headlineSizeInput = document.querySelector("#copyScale"), introSizeInput = document.querySelector("#introScale");
for (const [input, value] of [[headlineSizeInput, 96], [introSizeInput, 24]]) {
  input.type = "number";
  input.min = "8";
  input.max = "400";
  input.step = "1";
  input.value = String(value);
}
document.querySelector("#copyScaleVal").textContent = "96 px";
document.querySelector("#introScaleVal").textContent = "24 px";
document.querySelector("#copyAlign").value = "left";
document.querySelector("#copyAlignVal").textContent = "\u5DE6\u5BF9\u9F50";
document.querySelector("#imageAnimation").previousElementSibling.querySelector("span").textContent = "\u56FE\u7247 / 3D \u5B57\u7B26\u52A8\u753B";
document.querySelector("#imageAnimation").closest(".group").querySelector(".note").textContent = "\u5728\u56FE\u7247\u548C 3D \u6A21\u5F0F\u4E0B\u751F\u6548\uFF1B\u539F\u59CB\u7D20\u6750\u4FDD\u6301\u4E0D\u53D8\uFF0C\u52A8\u753B\u53EA\u9A71\u52A8\u5B57\u7B26\u5C42\u3002";
const defaultPreviewZoom = 0.9;
let canvasWidth = 1920, canvasHeight = 1080, previewZoom = defaultPreviewZoom;
viewport.style.transform = `scale(${defaultPreviewZoom})`;
document.querySelector(".stageFooter span:first-child").textContent = "CANVAS PREVIEW // 90%";
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setClearAlpha(0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
viewport.append(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(16448248);
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0, 5.5);
scene.add(new THREE.HemisphereLight(16777215, 10128639, 0.42));
const key = new THREE.DirectionalLight(16777215, 1.35);
key.position.set(3, 4, 5);
scene.add(key);
const rim = new THREE.PointLight(7099135, 1.8, 12);
rim.position.set(-3, 1, 2);
scene.add(rim);
const content = new THREE.Group();
scene.add(content);
const default3DZoom = 2.4;
let currentMode = "3d", mediaTexture = null, mediaPlane = null, videoEl = null, dragX = 0, dragY = 0, targetX = 0, targetY = 0, rotationSpeed = 0.5, modelZoom = default3DZoom, modelPanX = 0, modelPanY = 0, moveMode = false, modelBaseRadius = 1.55;
addEventListener("ascii-forge-apply-transform", (event) => {
  const state = event.detail || {};
  if (Number.isFinite(state.zoom)) modelZoom = state.zoom;
  if (Number.isFinite(state.panX)) modelPanX = state.panX;
  if (Number.isFinite(state.panY)) modelPanY = state.panY;
  if (Number.isFinite(state.rotationSpeed)) rotationSpeed = state.rotationSpeed;
  if (Number.isFinite(state.copyOffsetX)) copyOffsetX = state.copyOffsetX;
  if (Number.isFinite(state.copyOffsetY)) copyOffsetY = state.copyOffsetY;
});
const mat = new THREE.MeshStandardMaterial({ color: 8219903, roughness: 0.55, metalness: 0.05 });
const analysisMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  vertexShader: `
    varying vec3 vViewNormal;
    void main() {
      vViewNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    varying vec3 vViewNormal;
    void main() {
      vec3 n = normalize(gl_FrontFacing ? vViewNormal : -vViewNormal);
      vec3 keyDirection = normalize(vec3(-0.58, 0.62, 0.72));
      vec3 fillDirection = normalize(vec3(0.68, -0.18, 0.56));
      float keyShade = max(dot(n, keyDirection), 0.0);
      float fillShade = max(dot(n, fillDirection), 0.0);
      float frontShape = pow(max(n.z, 0.0), 2.2);
      float rimShape = pow(1.0 - abs(n.z), 2.0);
      float shade = clamp(0.06 + keyShade * 0.60 + fillShade * 0.18 + frontShape * 0.16 - rimShape * 0.08, 0.025, 1.0);
      gl_FragColor = vec4(vec3(shade), 1.0);
    }
  `
});
function resetContentTransform(zoom = 1) {
  dragX = 0;
  dragY = 0;
  targetX = 0;
  targetY = 0;
  modelZoom = zoom;
  modelPanX = 0;
  modelPanY = 0;
  moveMode = false;
  content.rotation.set(0, 0, 0);
  content.position.set(0, 0, 0);
  content.scale.setScalar(modelZoom);
}
function refresh3DFrame() {
  content.position.set(0, 0, 0);
  content.rotation.set(0, 0, 0);
  content.scale.setScalar(1);
  content.updateMatrixWorld(true);
  const sphere = new THREE.Box3().setFromObject(content).getBoundingSphere(new THREE.Sphere());
  if (Number.isFinite(sphere.radius) && sphere.radius > 0) modelBaseRadius = sphere.radius;
}
function fitted3DScale() {
  const visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z;
  const visibleW = visibleH * camera.aspect;
  return Math.min(visibleW, visibleH) * 0.7 / Math.max(modelBaseRadius * 2, 0.001) * modelZoom;
}
function fallback3D() {
  clearContent();
  resetContentTransform(default3DZoom);
  scene.overrideMaterial = analysisMaterial;
  postMat?.uniforms.mediaBounds.value.set(0, 0, 1, 1);
  currentMode = "3d";
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.05, 0.34, 180, 28, 2, 3), mat);
  content.add(knot);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.55, 0.035, 10, 120), new THREE.MeshStandardMaterial({ color: 1381653 }));
  ring.rotation.x = 1.05;
  content.add(ring);
  refresh3DFrame();
  sourceName.textContent = "\u5185\u7F6E 3D";
  statusEl.textContent = "LEFT DRAG ROTATE \xB7 MIDDLE DRAG MOVE \xB7 WHEEL ZOOM";
  setActive("3d");
}
async function builtIn() {
  clearContent();
  resetContentTransform(default3DZoom);
  scene.overrideMaterial = analysisMaterial;
  currentMode = "3d";
  sourceName.textContent = "sculpture_bust_of_roza_loewenfeld.glb";
  statusEl.textContent = "LOADING DEFAULT 3D";
  setActive("3d");
  try {
    const response = await fetch(defaultModelUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    loader.parse(buffer, "", (gltf) => {
      try {
        mountModel(gltf, "sculpture_bust_of_roza_loewenfeld.glb");
      } catch (error) {
        statusEl.textContent = "DEFAULT MODEL DISPLAY FAILED";
        fallback3D();
      }
    }, () => {
      statusEl.textContent = "DEFAULT MODEL PARSE FAILED";
      fallback3D();
    });
  } catch (error) {
    statusEl.textContent = "DEFAULT MODEL LOAD FAILED";
    fallback3D();
  }
}
function clearContent() {
  mediaPlane = null;
  while (content.children.length) {
    const o = content.children.pop();
    o.traverse?.((x) => {
      x.geometry?.dispose();
      if (x.material && !Array.isArray(x.material)) x.material.dispose?.();
    });
  }
  if (mediaTexture) {
    mediaTexture.dispose();
    mediaTexture = null;
  }
  if (videoEl) {
    videoEl.pause();
    videoEl.src = "";
    videoEl = null;
  }
}
function makeMediaPlane(texture, ratio, initialZoom = 1) {
  clearContent();
  resetContentTransform(initialZoom);
  scene.overrideMaterial = null;
  mediaTexture = texture;
  mediaPlane = new THREE.Mesh(new THREE.PlaneGeometry(ratio, 1), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false, transparent: true, alphaTest: 0.001 }));
  mediaPlane.userData.sourceRatio = ratio;
  mediaPlane.rotation.set(0, 0, 0);
  content.add(mediaPlane);
  fitMediaPlane();
  updateMediaBounds();
}
function fitMediaPlane() {
  if (!mediaPlane?.userData.sourceRatio) return;
  const ratio = mediaPlane.userData.sourceRatio, visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z, visibleW = visibleH * camera.aspect, fit = Math.min(visibleW / ratio, visibleH) * 0.9;
  mediaPlane.scale.setScalar(fit);
  mediaPlane.userData.size = { w: ratio * fit, h: fit };
}
function imageDemo() {
  const file = new File([defaultImageSource], "Apple.svg", { type: "image/svg+xml" });
  file.__asciiDefaultImage = true;
  openFile(file);
}
async function videoDemo() {
  sourceName.textContent = "Jellyfish.mp4";
  statusEl.textContent = "LOADING DEFAULT VIDEO";
  setActive("video");
  try {
    const response = await fetch(defaultVideoUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const file = new File([blob], "Jellyfish.mp4", { type: "video/mp4" });
    file.__asciiDefaultVideo = true;
    openFile(file);
  } catch (error) {
    statusEl.textContent = "DEFAULT VIDEO LOAD FAILED: " + error.message;
  }
}
function setActive(v) {
  document.querySelectorAll("[data-demo]").forEach((b) => b.classList.toggle("active", b.dataset.demo === v));
  updateControlAvailability(v);
  updateInteractionHelp(v);
}
function updateInteractionHelp(mode = currentMode) {
  if (!interactionHelp) return;
  const isChinese = currentLanguage === "zh";
  if (mode === "3d") {
    interactionHelp.textContent = isChinese
      ? "\u753B\u5E03\u5185\uFF1A\u5DE6\u952E\u65CB\u8F6C \xB7 \u4E2D\u952E\u79FB\u52A8 \xB7 \u6EDA\u8F6E\u7F29\u653E\u6A21\u578B  /  \u753B\u5E03\u5916\uFF1A\u6EDA\u8F6E\u7F29\u653E\u753B\u5E03 \xB7 \u53CC\u51FB\u91CD\u7F6E"
      : "ON CANVAS: LEFT DRAG ROTATE \xB7 MIDDLE DRAG MOVE \xB7 WHEEL MODEL ZOOM  /  OUTSIDE: WHEEL CANVAS ZOOM \xB7 DOUBLE CLICK RESET";
  } else {
    interactionHelp.textContent = isChinese
      ? "\u753B\u5E03\u5185\uFF1A\u62D6\u62FD\u79FB\u52A8\u7D20\u6750 \xB7 \u4E2D\u952E\u79FB\u52A8\u6587\u5B57/\u7D20\u6750 \xB7 \u6EDA\u8F6E\u7F29\u653E  /  \u753B\u5E03\u5916\uFF1A\u6EDA\u8F6E\u7F29\u653E\u753B\u5E03 \xB7 \u53CC\u51FB\u91CD\u7F6E"
      : "ON CANVAS: DRAG MEDIA \xB7 MIDDLE DRAG COPY/MEDIA \xB7 WHEEL MEDIA ZOOM  /  OUTSIDE: WHEEL CANVAS ZOOM \xB7 DOUBLE CLICK RESET";
  }
}
function setControlGroupEnabled(controlId, enabled) {
  const group = document.querySelector("#" + controlId)?.closest(".group");
  if (!group) return;
  group.classList.toggle("is-disabled", !enabled);
  group.setAttribute("aria-disabled", String(!enabled));
  group.querySelectorAll("input,select,button,textarea").forEach((control) => control.disabled = !enabled);
}
function updateControlAvailability(mode) {
  const is3D = mode === "3d", isImage = mode === "image";
  setControlGroupEnabled("rotation", is3D);
  setControlGroupEnabled("depthStrength", is3D);
  setControlGroupEnabled("imageAnimation", is3D || isImage);
  const animationMode = is3D ? animationByMode["3d"] : isImage ? animationByMode.image : 0;
  const animationSelect = document.querySelector("#imageAnimation");
  animationSelect.value = String(animationMode);
  postMat.uniforms.animationMode.value = animationMode;
  document.querySelector("#imageAnimationVal").textContent = animationSelect.options[animationSelect.selectedIndex]?.text || "\u5173\u95ED\u52A8\u753B";
}
function glyphTexture(chars) {
  const list = [...chars], size = 64, c = document.createElement("canvas");
  c.width = size * list.length;
  c.height = size;
  const x = c.getContext("2d");
  x.fillStyle = "#000";
  x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = "#fff";
  x.font = "700 52px ui-monospace,monospace";
  x.textAlign = "center";
  x.textBaseline = "middle";
  list.forEach((ch, i) => x.fillText(ch, (i + 0.5) * size, size * 0.53));
  const t = new THREE.CanvasTexture(c);
  t.minFilter = THREE.LinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.wrapS = THREE.ClampToEdgeWrapping;
  return { texture: t, count: list.length };
}
const charsets = { classic: { label: "\u7ECF\u5178", chars: " .,:;i1tfLCG08@" }, blocks: { label: "\u5757\u72B6", chars: " \u2591\u2592\u2593\u2588" }, binary: { label: "\u4E8C\u8FDB\u5236", chars: " 01" }, matrix: { label: "\u77E9\u9635", chars: " \uFF65:\uFF8A\uFF90\uFF8B\uFF70\uFF73\uFF7C\uFF85\uFF93\uFF86\uFF7B\uFF9C\uFF82\uFF75\uFF98" }, minimal: { label: "\u6781\u7B80", chars: " \xB7+\xD7#" } };
const defaultCharacters = "00100101010111";
let glyph = glyphTexture(" " + defaultCharacters);
const postScene = new THREE.Scene(), postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), target = new THREE.WebGLRenderTarget(1, 1, { format: THREE.RGBAFormat });
target.depthTexture = new THREE.DepthTexture(1, 1, THREE.UnsignedShortType);
target.depthTexture.format = THREE.DepthFormat;
const postMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { tDiffuse: { value: target.texture }, tGlyph: { value: glyph.texture }, resolution: { value: new THREE.Vector2() }, cell: { value: 9 }, contrast: { value: 1.35 }, noiseAmount: { value: 0.08 }, colorMix: { value: 0.35 }, backgroundOpacity: { value: 1 }, sourceOverlay: { value: 0 }, charColor: { value: new THREE.Color("#6b55ff") }, charColorEnd: { value: new THREE.Color("#34d5ff") }, gradientAngle: { value: THREE.MathUtils.degToRad(45) }, bgColor: { value: new THREE.Color("#fafaf6") }, invert: { value: 1 }, isolate: { value: 1 }, isolation: { value: 0.58 }, mediaBounds: { value: new THREE.Vector4(0, 0, 1, 1) }, glyphCount: { value: glyph.count }, pointer: { value: new THREE.Vector2(0.5, 0.5) } }, vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`, fragmentShader: `precision highp float;varying vec2 vUv;uniform sampler2D tDiffuse,tGlyph;uniform vec2 resolution,pointer;uniform vec4 mediaBounds;uniform vec3 charColor,charColorEnd,bgColor;uniform float cell,contrast,noiseAmount,colorMix,backgroundOpacity,sourceOverlay,gradientAngle,invert,isolate,isolation,glyphCount;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){vec2 grid=resolution/cell;vec2 id=floor(vUv*grid);vec2 center=(id+.5)/grid;vec4 src=texture2D(tDiffuse,center);float lum=dot(src.rgb,vec3(.2126,.7152,.0722));lum=clamp((lum-.5)*contrast+.5+(hash(id)-.5)*noiseAmount,0.,1.);if(invert>.5)lum=1.-lum;float subject=1.;if(isolate>.5){vec2 inset=vec2(.018);vec3 b1=texture2D(tDiffuse,mediaBounds.xy+inset).rgb;vec3 b2=texture2D(tDiffuse,vec2(mediaBounds.z-inset.x,mediaBounds.y+inset.y)).rgb;vec3 b3=texture2D(tDiffuse,vec2(mediaBounds.x+inset.x,mediaBounds.w-inset.y)).rgb;vec3 b4=texture2D(tDiffuse,mediaBounds.zw-inset).rgb;float d=min(min(distance(src.rgb,b1),distance(src.rgb,b2)),min(distance(src.rgb,b3),distance(src.rgb,b4)));vec2 q=(center-(mediaBounds.xy+mediaBounds.zw)*.5)/max(mediaBounds.zw-mediaBounds.xy,vec2(.01));float focus=1.-smoothstep(.12,.72,length(q*vec2(.78,1.)));float threshold=mix(.05,.5,isolation);subject=max(smoothstep(threshold,threshold+.16,d),focus*.32);float inside=step(mediaBounds.x,center.x)*step(mediaBounds.y,center.y)*step(center.x,mediaBounds.z)*step(center.y,mediaBounds.w);subject*=inside;}lum*=subject;float index=floor(lum*(glyphCount-1.));vec2 local=fract(vUv*grid);vec2 guv=vec2((index+local.x)/glyphCount,local.y);float mask=texture2D(tGlyph,guv).r*subject;float glow=smoothstep(.45,0.,distance(vUv,pointer));vec2 dir=vec2(cos(gradientAngle),sin(gradientAngle));float gt=clamp(dot(center-.5,dir)+.5,0.,1.);vec3 gradientColor=mix(charColor,charColorEnd,gt);vec3 ink=mix(gradientColor,src.rgb,colorMix);ink=mix(ink,vec3(.55,.38,1.),glow*.28);vec3 base=mix(bgColor,src.rgb,sourceOverlay);vec3 finalColor=mix(base,ink,mask);float finalAlpha=max(mask,max(backgroundOpacity,sourceOverlay));gl_FragColor=vec4(finalColor,finalAlpha);}` });
postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));
postMat.uniforms.blendMode = { value: 0 };
postMat.fragmentShader = postMat.fragmentShader.replace("uniform float cell", "uniform float blendMode;uniform float cell").replace("vec3 ink=mix(gradientColor,src.rgb,colorMix);", `vec3 mixedColor=src.rgb;if(blendMode<.5){mixedColor=src.rgb;}else if(blendMode<1.5){mixedColor=gradientColor*src.rgb;}else if(blendMode<2.5){mixedColor=1.-(1.-gradientColor)*(1.-src.rgb);}else if(blendMode<3.5){mixedColor=mix(2.*gradientColor*src.rgb,1.-2.*(1.-gradientColor)*(1.-src.rgb),step(.5,gradientColor));}else if(blendMode<4.5){mixedColor=(1.-2.*src.rgb)*gradientColor*gradientColor+2.*src.rgb*gradientColor;}else if(blendMode<5.5){mixedColor=abs(gradientColor-src.rgb);}else{mixedColor=min(vec3(1.),gradientColor+src.rgb);}vec3 ink=mix(gradientColor,mixedColor,colorMix);`);
postMat.uniforms.animationTime = { value: 0 };
postMat.uniforms.animationMode = { value: 1 };
postMat.uniforms.animationStrength = { value: 0.45 };
postMat.uniforms.animationActive = { value: 0 };
const animationByMode = { image: 1, "3d": 0 };
postMat.fragmentShader = postMat.fragmentShader
  .replace("uniform float blendMode;", "uniform float animationTime,animationMode,animationStrength,animationActive;uniform float blendMode;")
  .replace("float index=floor(lum*(glyphCount-1.));", `float animatedOffset=0.;if(animationActive>.5&&animationMode>.5){if(animationMode<1.5){float speed=.22+hash(vec2(id.x,7.))*0.48;float stream=fract(center.y-animationTime*speed+hash(vec2(id.x,19.)));float head=1.-smoothstep(0.,.16,stream);lum=clamp(lum+head*animationStrength,0.,1.);animatedOffset=floor(hash(vec2(id.x,floor(id.y+animationTime*18.*speed)))*glyphCount*animationStrength);}else if(animationMode<2.5){float wave=sin(center.y*28.+center.x*12.-animationTime*3.2)*.5+.5;lum=clamp(lum+(wave-.5)*animationStrength*.55,0.,1.);animatedOffset=floor(wave*glyphCount*animationStrength);}else if(animationMode<3.5){float scan=1.-smoothstep(0.,.055,abs(fract(center.y-animationTime*.18)-.5));lum=clamp(lum+scan*animationStrength,0.,1.);animatedOffset=floor(scan*glyphCount*animationStrength);}else{float tick=floor(animationTime*9.);float glitch=step(.72,hash(vec2(id.y,tick)))*hash(vec2(id.x,tick));lum=clamp(lum+(glitch-.25)*animationStrength,0.,1.);animatedOffset=floor(glitch*glyphCount);}}float index=mod(floor(lum*(glyphCount-1.))+animatedOffset,max(glyphCount,1.));`);
postMat.uniforms.tDepth = { value: target.depthTexture };
postMat.uniforms.depthStrength = { value: 0.9 };
postMat.uniforms.depthActive = { value: 0 };
postMat.uniforms.cameraNear = { value: camera.near };
postMat.uniforms.cameraFar = { value: camera.far };
postMat.uniforms.depthRangeNear = { value: 3.5 };
postMat.uniforms.depthRangeFar = { value: 7.5 };
postMat.fragmentShader = postMat.fragmentShader
  .replace("uniform sampler2D tDiffuse,tGlyph;", "uniform sampler2D tDiffuse,tGlyph,tDepth;")
  .replace("uniform float animationTime,", "uniform float depthStrength,depthActive,cameraNear,cameraFar,depthRangeNear,depthRangeFar;uniform float animationTime,")
  .replace("if(invert>.5)lum=1.-lum;", `if(invert>.5)lum=1.-lum;if(depthActive>.5&&depthStrength>.001){vec2 dp=vec2(cell)/resolution;float rd=texture2D(tDepth,center).x;float rx1=texture2D(tDepth,center+vec2(dp.x,0.)).x;float rx2=texture2D(tDepth,center-vec2(dp.x,0.)).x;float ry1=texture2D(tDepth,center+vec2(0.,dp.y)).x;float ry2=texture2D(tDepth,center-vec2(0.,dp.y)).x;float z=rd*2.-1.;float zx1=rx1*2.-1.;float zx2=rx2*2.-1.;float zy1=ry1*2.-1.;float zy2=ry2*2.-1.;float vd=(2.*cameraNear*cameraFar)/max(cameraFar+cameraNear-z*(cameraFar-cameraNear),.0001);float vx1=(2.*cameraNear*cameraFar)/max(cameraFar+cameraNear-zx1*(cameraFar-cameraNear),.0001);float vx2=(2.*cameraNear*cameraFar)/max(cameraFar+cameraNear-zx2*(cameraFar-cameraNear),.0001);float vy1=(2.*cameraNear*cameraFar)/max(cameraFar+cameraNear-zy1*(cameraFar-cameraNear),.0001);float vy2=(2.*cameraNear*cameraFar)/max(cameraFar+cameraNear-zy2*(cameraFar-cameraNear),.0001);float span=max(depthRangeFar-depthRangeNear,.001);float shape=1.-clamp((vd-depthRangeNear)/span,0.,1.);float gradient=max(abs(vx1-vx2),abs(vy1-vy2))/span;float curvature=abs((vx1+vx2+vy1+vy2)*.25-vd)/span;float silhouette=step(rd,.9999)*(1.-step(max(max(rx1,rx2),max(ry1,ry2)),.9999));float detail=smoothstep(.004,.055,gradient)+smoothstep(.0015,.025,curvature)+silhouette*.85;float depthTone=clamp(lum*.62+pow(shape,.82)*.48+detail*.72,0.,1.);lum=mix(lum,depthTone,depthStrength);}`);
postMat.fragmentShader = postMat.fragmentShader.replace(
  "vec2 local=fract(vUv*grid);vec2 guv=vec2((index+local.x)/glyphCount,local.y);float mask=texture2D(tGlyph,guv).r*subject;",
  `vec2 local=fract(vUv*grid);float depthMix=depthActive*depthStrength;float glyphScale=mix(1.,mix(.28,.84,pow(lum,.72)),depthMix);vec2 glyphLocal=(local-.5)/max(glyphScale,.01)+.5;float glyphInside=step(0.,glyphLocal.x)*step(glyphLocal.x,1.)*step(0.,glyphLocal.y)*step(glyphLocal.y,1.);vec2 guv=vec2((index+clamp(glyphLocal.x,0.,1.))/glyphCount,clamp(glyphLocal.y,0.,1.));float depthOpacity=mix(1.,mix(.12,1.,pow(lum,.68)),depthMix);float mask=texture2D(tGlyph,guv).r*glyphInside*subject*depthOpacity;`
);
postMat.uniforms.density = { value: 0.6 };
postMat.fragmentShader = postMat.fragmentShader.replace("uniform float blendMode;uniform float cell", "uniform float density;uniform float blendMode;uniform float cell").replace("lum*=subject;", "lum=clamp(lum+(density-.5)*.9,0.,1.);lum*=subject;");
postMat.uniforms.cleanup = { value: 0.7 };
postMat.uniforms.edgeCrop = { value: 0 };
postMat.fragmentShader = postMat.fragmentShader.replace("uniform float density;", "uniform float cleanup,edgeCrop;uniform float density;").replace("subject*=inside;", `vec2 px=vec2(cell)/resolution;float votes=0.;vec3 n1=texture2D(tDiffuse,center+vec2(px.x,0.)).rgb;vec3 n2=texture2D(tDiffuse,center-vec2(px.x,0.)).rgb;vec3 n3=texture2D(tDiffuse,center+vec2(0.,px.y)).rgb;vec3 n4=texture2D(tDiffuse,center-vec2(0.,px.y)).rgb;float dn1=min(min(distance(n1,b1),distance(n1,b2)),min(distance(n1,b3),distance(n1,b4)));float dn2=min(min(distance(n2,b1),distance(n2,b2)),min(distance(n2,b3),distance(n2,b4)));float dn3=min(min(distance(n3,b1),distance(n3,b2)),min(distance(n3,b3),distance(n3,b4)));float dn4=min(min(distance(n4,b1),distance(n4,b2)),min(distance(n4,b3),distance(n4,b4)));votes=step(threshold,dn1)+step(threshold,dn2)+step(threshold,dn3)+step(threshold,dn4);float stable=smoothstep(mix(0.,3.4,cleanup),4.,votes);subject*=mix(1.,stable,cleanup);vec2 boundsSize=max(mediaBounds.zw-mediaBounds.xy,vec2(.01));vec2 edgeDistance=min((center-mediaBounds.xy)/boundsSize,(mediaBounds.zw-center)/boundsSize);float edgeMask=smoothstep(edgeCrop,edgeCrop+.025,min(edgeDistance.x,edgeDistance.y));subject*=edgeMask;subject*=inside;`);
postMat.uniforms.charColorMid = { value: new THREE.Color("#ff2fb3") };
postMat.uniforms.charColor.value.set("#7c4dff");
postMat.uniforms.charColorEnd.value.set("#19dfff");
postMat.uniforms.bgColor.value.set("#070812");
postMat.uniforms.cell.value = 7;
postMat.uniforms.contrast.value = 0.85;
postMat.fragmentShader = postMat.fragmentShader.replace("uniform vec3 charColor,charColorEnd,bgColor;", "uniform vec3 charColor,charColorMid,charColorEnd,bgColor;").replace("vec3 gradientColor=mix(charColor,charColorEnd,gt);", "vec3 gradientColor=gt<.5?mix(charColor,charColorMid,gt*2.):mix(charColorMid,charColorEnd,(gt-.5)*2.);");
const asciiTarget = new THREE.WebGLRenderTarget(1, 1, { format: THREE.RGBAFormat });
const bloomScene = new THREE.Scene(), bloomCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const bloomMat = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { tAscii: { value: asciiTarget.texture }, resolution: { value: new THREE.Vector2(1, 1) }, intensity: { value: 0.55 }, radius: { value: 1.2 }, threshold: { value: 0.25 }, bgColor: { value: postMat.uniforms.bgColor.value } }, vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`, fragmentShader: `precision highp float;varying vec2 vUv;uniform sampler2D tAscii;uniform vec2 resolution;uniform vec3 bgColor;uniform float intensity,radius,threshold;float energy(vec3 c){return smoothstep(threshold,1.,length(c-bgColor)*.72);}void main(){vec4 base=texture2D(tAscii,vUv);vec2 p=(1./resolution)*radius*3.;vec3 glow=vec3(0.);float ga=0.;vec4 s;s=texture2D(tAscii,vUv+vec2(p.x,0.));glow+=s.rgb*energy(s.rgb);ga+=s.a*energy(s.rgb);s=texture2D(tAscii,vUv-vec2(p.x,0.));glow+=s.rgb*energy(s.rgb);ga+=s.a*energy(s.rgb);s=texture2D(tAscii,vUv+vec2(0.,p.y));glow+=s.rgb*energy(s.rgb);ga+=s.a*energy(s.rgb);s=texture2D(tAscii,vUv-vec2(0.,p.y));glow+=s.rgb*energy(s.rgb);ga+=s.a*energy(s.rgb);s=texture2D(tAscii,vUv+p);glow+=s.rgb*energy(s.rgb)*.7;ga+=s.a*energy(s.rgb)*.7;s=texture2D(tAscii,vUv-p);glow+=s.rgb*energy(s.rgb)*.7;ga+=s.a*energy(s.rgb)*.7;s=texture2D(tAscii,vUv+vec2(p.x,-p.y));glow+=s.rgb*energy(s.rgb)*.7;ga+=s.a*energy(s.rgb)*.7;s=texture2D(tAscii,vUv+vec2(-p.x,p.y));glow+=s.rgb*energy(s.rgb)*.7;ga+=s.a*energy(s.rgb)*.7;glow/=6.8;ga/=6.8;vec3 bloom=glow*intensity;vec3 result=1.-(1.-base.rgb)*(1.-clamp(bloom,0.,1.));result=mix(result,base.rgb+bloom*.28,step(.68,dot(bgColor,vec3(.333))));gl_FragColor=vec4(clamp(result,0.,1.),max(base.a,ga*intensity));}` });
bloomScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), bloomMat));
bloomMat.uniforms.intensity.value = 1.4;
bloomMat.uniforms.radius.value = 2;
bloomMat.uniforms.threshold.value = 0.06;
bloomMat.fragmentShader = bloomMat.fragmentShader.replace("radius*3.", "radius*8.5");
bloomMat.fragmentShader = bloomMat.fragmentShader.replace(
  "vec3 bloom=glow*intensity;vec3 result=1.-(1.-base.rgb)*(1.-clamp(bloom,0.,1.));result=mix(result,base.rgb+bloom*.28,step(.68,dot(bgColor,vec3(.333))));",
  "vec3 bloom=glow*intensity;float lightBg=step(.58,dot(bgColor,vec3(.333)));vec3 darkResult=1.-(1.-base.rgb)*(1.-clamp(bloom,0.,1.));vec3 haloColor=glow/max(ga,.001);float haloAmount=clamp(ga*intensity*.9,0.,.82);vec3 lightResult=mix(base.rgb,haloColor,haloAmount);vec3 result=mix(darkResult,lightResult,lightBg);"
);
const copyCanvas = document.createElement("canvas"), copyContext = copyCanvas.getContext("2d");
const copyBaseOffsetY = -64;
let copyTexture = new THREE.CanvasTexture(copyCanvas), copyOffsetX = 0, copyOffsetY = 0, copyHitBox = { x1: 0, y1: 0, x2: 0, y2: 0 }, middleTarget = "media";
function configureCopyTexture() {
  copyTexture.colorSpace = THREE.SRGBColorSpace;
  copyTexture.minFilter = THREE.LinearFilter;
  copyTexture.magFilter = THREE.LinearFilter;
  copyTexture.generateMipmaps = false;
  copyTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
}
configureCopyTexture();
bloomMat.uniforms.tCopy = { value: copyTexture };
bloomMat.fragmentShader = bloomMat.fragmentShader.replace("uniform sampler2D tAscii;", "uniform sampler2D tAscii,tCopy;").replace("gl_FragColor=vec4(clamp(result,0.,1.),max(base.a,ga*intensity));", "vec4 copy=texture2D(tCopy,vUv);result=mix(result,copy.rgb,copy.a);gl_FragColor=vec4(clamp(result,0.,1.),max(max(base.a,ga*intensity),copy.a));");
function wrapText(context, text, maxWidth) {
  const lines = [];
  for (const paragraph of String(text).replace(/\r/g, "").split("\n")) {
    if (!paragraph) {
      lines.push("");
      continue;
    }
    const words = paragraph.split(/\s+/);
    let line = "";
    for (const word of words) {
      const test = line ? line + " " + word : word;
      if (context.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else line = test;
    }
    if (line) lines.push(line);
  }
  return lines;
}
function drawCopy() {
  const show = document.querySelector("#showCopy")?.checked ?? true;
  if (copyCanvas.width !== canvasWidth || copyCanvas.height !== canvasHeight) {
    copyCanvas.width = canvasWidth;
    copyCanvas.height = canvasHeight;
    copyTexture.dispose();
    copyTexture = new THREE.CanvasTexture(copyCanvas);
    configureCopyTexture();
    bloomMat.uniforms.tCopy.value = copyTexture;
  } else copyContext.clearRect(0, 0, canvasWidth, canvasHeight);
  copyContext.imageSmoothingEnabled = true;
  copyContext.imageSmoothingQuality = "high";
  if (!show) {
    copyHitBox = { x1: 0, y1: 0, x2: 0, y2: 0 };
    copyTexture.needsUpdate = true;
    return;
  }
  const titleSize = THREE.MathUtils.clamp(+document.querySelector("#copyScale")?.value || 96, 8, 400), introSize = THREE.MathUtils.clamp(+document.querySelector("#introScale")?.value || 24, 8, 400), pad = Math.max(40, Math.min(canvasWidth, canvasHeight) * 0.06), align = document.querySelector("#copyAlign")?.value || "left", color = document.querySelector("#copyColor")?.value || "#ffffff", fontFamily = document.querySelector("#copyFont")?.value || "Georgia", fontStack = `"${fontFamily.replaceAll('"', "")}",Georgia,"Times New Roman",serif`, baseX = align === "left" ? pad : align === "right" ? canvasWidth - pad : canvasWidth / 2, x = baseX + copyOffsetX * canvasWidth, maxWidth = canvasWidth - pad * 2;
  copyContext.textAlign = align;
  copyContext.textBaseline = "alphabetic";
  copyContext.fillStyle = color;
  copyContext.font = `500 ${titleSize}px ${fontStack}`;
  copyContext.letterSpacing = `${titleSize * 5e-3}px`;
  const titleLines = wrapText(copyContext, document.querySelector("#headlineText")?.value || "", maxWidth), intro = document.querySelector("#introText")?.value || "", lineHeight = titleSize * 1.08;
  copyContext.font = `400 ${introSize}px ${fontStack}`;
  const introLines = wrapText(copyContext, intro, maxWidth), introLineHeight = introSize * 1.45, blockHeight = titleLines.length * lineHeight + titleSize * 0.34 + introLines.length * introLineHeight;
  let y = canvasHeight - pad - blockHeight + copyBaseOffsetY + copyOffsetY * canvasHeight, maxMeasured = 0;
  copyContext.font = `500 ${titleSize}px ${fontStack}`;
  for (const line of titleLines) {
    y += lineHeight;
    maxMeasured = Math.max(maxMeasured, copyContext.measureText(line).width);
    copyContext.fillText(line, x, y);
  }
  copyContext.globalAlpha = 0.7;
  copyContext.font = `400 ${introSize}px ${fontStack}`;
  y += titleSize * 0.34;
  for (const line of introLines) {
    y += introLineHeight;
    maxMeasured = Math.max(maxMeasured, copyContext.measureText(line).width);
    copyContext.fillText(line, x, y);
  }
  copyContext.globalAlpha = 1;
  const left = align === "left" ? x : align === "right" ? x - maxMeasured : x - maxMeasured * 0.5;
  copyHitBox = { x1: left - titleSize * 0.2, y1: y - blockHeight - titleSize * 0.2, x2: left + maxMeasured + titleSize * 0.4, y2: y + introSize * 0.6 };
  copyTexture.needsUpdate = true;
}
function updateMediaBounds() {
  if (!mediaPlane?.userData.size) {
    postMat.uniforms.mediaBounds.value.set(0, 0, 1, 1);
    return;
  }
  const { w, h } = mediaPlane.userData.size, visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z, visibleW = visibleH * camera.aspect, fw = w * modelZoom / visibleW, fh = h * modelZoom / visibleH, cx = 0.5 + modelPanX / visibleW, cy = 0.5 + modelPanY / visibleH;
  postMat.uniforms.mediaBounds.value.set(cx - fw * 0.5, cy - fh * 0.5, cx + fw * 0.5, cy + fh * 0.5);
}
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: "js" });
dracoLoader.setWorkerLimit(2);
dracoLoader._loadLibrary = () => Promise.resolve(dracoDecoderSource);
const loader = new GLTFLoader();
loader.setMeshoptDecoder(MeshoptDecoder);
loader.setDRACOLoader(dracoLoader);
function mountModel(g, fileName) {
  modelZoom = default3DZoom;
  const root = g.scene || g.scenes?.[0];
  if (!root) throw new Error("\u6587\u4EF6\u4E2D\u6CA1\u6709\u53EF\u663E\u793A\u7684\u573A\u666F");
  const normalizer = new THREE.Group(), centerer = new THREE.Group();
  normalizer.name = "ASCII_NormalizedScale";
  centerer.name = "ASCII_VisualCenter";
  centerer.add(root);
  normalizer.add(centerer);
  content.add(normalizer);
  content.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root), s = new THREE.Vector3(), center = new THREE.Vector3();
  box.getSize(s);
  box.getCenter(center);
  const extent = Math.max(s.x, s.y, s.z);
  if (!Number.isFinite(extent) || extent <= 0) {
    content.remove(normalizer);
    throw new Error("\u6A21\u578B\u5C3A\u5BF8\u65E0\u6548\u6216\u6CA1\u6709\u53EF\u6E32\u67D3\u7F51\u683C");
  }
  centerer.position.copy(center).multiplyScalar(-1);
  normalizer.scale.setScalar(2.5 / extent);
  content.updateMatrixWorld(true);
  const verifiedBox = new THREE.Box3().setFromObject(root), verifiedCenter = new THREE.Vector3();
  verifiedBox.getCenter(verifiedCenter);
  normalizer.userData.originalCenter = center.clone();
  normalizer.userData.originalSize = s.clone();
  normalizer.userData.normalizedCenter = verifiedCenter.clone();
  refresh3DFrame();
  scene.overrideMaterial = analysisMaterial;
  postMat.uniforms.mediaBounds.value.set(0, 0, 1, 1);
  currentMode = "3d";
  sourceName.textContent = fileName;
  statusEl.textContent = "LEFT DRAG ROTATE \xB7 MIDDLE DRAG MOVE \xB7 WHEEL ZOOM";
  setActive("3d");
}
async function loadSvgFile(file, url) {
  try {
    const source = await file.text();
    const documentNode = new DOMParser().parseFromString(source, "image/svg+xml");
    if (documentNode.querySelector("parsererror")) throw new Error("SVG parse failed");
    const svg = documentNode.documentElement;
    const viewBox = (svg.getAttribute("viewBox") || "").trim().split(/[ ,]+/).map(Number);
    const parsedWidth = parseFloat(svg.getAttribute("width"));
    const parsedHeight = parseFloat(svg.getAttribute("height"));
    const sourceWidth = Number.isFinite(parsedWidth) && parsedWidth > 0 ? parsedWidth : viewBox.length === 4 && viewBox[2] > 0 ? viewBox[2] : 1024;
    const sourceHeight = Number.isFinite(parsedHeight) && parsedHeight > 0 ? parsedHeight : viewBox.length === 4 && viewBox[3] > 0 ? viewBox[3] : 1024;
    const ratio = sourceWidth / sourceHeight;
    const maxRasterSize = 2048;
    const rasterWidth = Math.max(1, Math.round(ratio >= 1 ? maxRasterSize : maxRasterSize * ratio));
    const rasterHeight = Math.max(1, Math.round(ratio >= 1 ? maxRasterSize / ratio : maxRasterSize));
    svg.setAttribute("width", String(rasterWidth));
    svg.setAttribute("height", String(rasterHeight));
    if (!svg.getAttribute("viewBox")) svg.setAttribute("viewBox", `0 0 ${sourceWidth} ${sourceHeight}`);
    const normalizedSource = new XMLSerializer().serializeToString(svg);
    const svgUrl = URL.createObjectURL(new Blob([normalizedSource], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = rasterWidth;
      canvas.height = rasterHeight;
      const context = canvas.getContext("2d", { alpha: true });
      context.clearRect(0, 0, rasterWidth, rasterHeight);
      context.drawImage(img, 0, 0, rasterWidth, rasterHeight);
      let outputCanvas = canvas;
      try {
        const pixels = context.getImageData(0, 0, rasterWidth, rasterHeight).data;
        let minX = rasterWidth, minY = rasterHeight, maxX = -1, maxY = -1;
        for (let y = 0; y < rasterHeight; y++) {
          for (let x = 0; x < rasterWidth; x++) {
            if (pixels[(y * rasterWidth + x) * 4 + 3] > 8) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (maxX >= minX && maxY >= minY) {
          const subjectWidth = maxX - minX + 1, subjectHeight = maxY - minY + 1;
          const padding = Math.max(4, Math.round(Math.max(subjectWidth, subjectHeight) * 0.035));
          const cropX = Math.max(0, minX - padding), cropY = Math.max(0, minY - padding);
          const cropWidth = Math.min(rasterWidth - cropX, subjectWidth + padding * 2);
          const cropHeight = Math.min(rasterHeight - cropY, subjectHeight + padding * 2);
          outputCanvas = document.createElement("canvas");
          outputCanvas.width = cropWidth;
          outputCanvas.height = cropHeight;
          outputCanvas.getContext("2d", { alpha: true }).drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
        }
      } catch (error) {
        outputCanvas = canvas;
      }
      const outputRatio = outputCanvas.width / outputCanvas.height;
      const texture = new THREE.CanvasTexture(outputCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const isDefaultImage = file.__asciiDefaultImage === true;
      makeMediaPlane(texture, outputRatio, isDefaultImage ? 0.8 : 1);
      if (isDefaultImage) {
        const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z;
        modelPanY = visibleHeight * 96 / canvasHeight;
        updateMediaBounds();
      }
      currentMode = "image";
      sourceName.textContent = file.name;
      statusEl.textContent = "LIVE SVG ASCII \xB7 VECTOR RASTERIZED AT 2K";
      setActive("image");
      URL.revokeObjectURL(svgUrl);
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      URL.revokeObjectURL(url);
      statusEl.textContent = "SVG RENDER FAILED";
    };
    img.src = svgUrl;
  } catch (error) {
    URL.revokeObjectURL(url);
    statusEl.textContent = "SVG PARSE FAILED";
  }
}
function loadFile(file) {
  const url = URL.createObjectURL(file), name = file.name.toLowerCase();
  sourceName.textContent = file.name;
  statusEl.textContent = "LOADING " + file.name;
  if (file.type === "image/svg+xml" || name.endsWith(".svg")) {
    loadSvgFile(file, url);
  } else if (file.type.startsWith("image/")) {
    const img = new Image();
    img.onload = () => {
      const t = new THREE.Texture(img);
      t.needsUpdate = true;
      t.colorSpace = THREE.SRGBColorSpace;
      makeMediaPlane(t, img.width / img.height, 5);
      currentMode = "image";
      statusEl.textContent = "LIVE IMAGE ASCII \xB7 SUBJECT ISOLATION ON";
      setActive("image");
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      statusEl.textContent = "IMAGE DECODE FAILED";
      URL.revokeObjectURL(url);
    };
    img.src = url;
  } else if (file.type.startsWith("video/")) {
    clearContent();
    resetContentTransform();
    const nextVideo = document.createElement("video");
    videoEl = nextVideo;
    nextVideo.loop = true;
    nextVideo.muted = true;
    nextVideo.defaultMuted = true;
    nextVideo.playsInline = true;
    nextVideo.preload = "auto";
    nextVideo.onloadedmetadata = () => {
      if (videoEl !== nextVideo) return;
      const t = new THREE.VideoTexture(nextVideo);
      t.colorSpace = THREE.SRGBColorSpace;
      mediaTexture = t;
      const ratio = nextVideo.videoWidth / nextVideo.videoHeight, max = 2.8, w = ratio >= 1 ? max : max * ratio, h = ratio >= 1 ? max / ratio : max;
      mediaPlane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, toneMapped: false }));
      mediaPlane.userData.size = { w, h };
      mediaPlane.rotation.set(0, 0, 0);
      content.add(mediaPlane);
      if (file.__asciiDefaultVideo === true) {
        const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z;
        modelZoom = 2.5;
        modelPanY = -visibleHeight * 48 / canvasHeight;
      }
      updateMediaBounds();
      currentMode = "video";
      setActive("video");
      nextVideo.play().then(() => statusEl.textContent = "LIVE VIDEO ASCII \xB7 SUBJECT ISOLATION ON").catch(() => statusEl.textContent = "CLICK CANVAS TO PLAY VIDEO");
    };
    nextVideo.onerror = () => {
      statusEl.textContent = "VIDEO DECODE FAILED \xB7 TRY H.264 MP4 OR WEBM";
      URL.revokeObjectURL(url);
    };
    nextVideo.src = url;
    nextVideo.load();
  } else if (name.endsWith(".glb")) {
    clearContent();
    resetContentTransform();
    statusEl.textContent = "PARSING GLB\u2026";
    file.arrayBuffer().then((buffer) => loader.parse(buffer, "", (g) => {
      try {
        mountModel(g, file.name);
      } catch (e) {
        statusEl.textContent = "MODEL DISPLAY ERROR: " + e.message;
      }
    }, (e) => statusEl.textContent = "GLB PARSE FAILED: " + (e?.message || e))).catch((e) => statusEl.textContent = "GLB READ FAILED: " + e.message).finally(() => URL.revokeObjectURL(url));
  } else if (name.endsWith(".gltf")) {
    clearContent();
    resetContentTransform();
    statusEl.textContent = "PARSING GLTF\u2026";
    file.text().then((text) => loader.parse(text, "", (g) => {
      try {
        mountModel(g, file.name);
      } catch (e) {
        statusEl.textContent = "MODEL DISPLAY ERROR: " + e.message;
      }
    }, (e) => statusEl.textContent = "GLTF PARSE FAILED: " + (e?.message || e))).catch((e) => statusEl.textContent = "GLTF READ FAILED: " + e.message).finally(() => URL.revokeObjectURL(url));
  } else {
    statusEl.textContent = "UNSUPPORTED FILE FORMAT";
    URL.revokeObjectURL(url);
  }
}
function openFile(file) {
  scene.overrideMaterial = null;
  loadFile(file);
}
document.querySelector("#file").onchange = (e) => e.target.files[0] && openFile(e.target.files[0]);
document.querySelectorAll("[data-demo]").forEach((b) => b.onclick = () => ({ "3d": builtIn, image: imageDemo, video: videoDemo })[b.dataset.demo]());
for (const id of ["cell", "contrast", "noise", "color"]) document.querySelector("#" + id).oninput = (e) => {
  const v = +e.target.value;
  if (id === "cell") {
    postMat.uniforms.cell.value = v;
    document.querySelector("#cellVal").textContent = v + " px";
  }
  if (id === "contrast") {
    postMat.uniforms.contrast.value = v / 100;
    document.querySelector("#contrastVal").textContent = (v / 100).toFixed(2);
  }
  if (id === "noise") {
    postMat.uniforms.noiseAmount.value = v / 100;
    document.querySelector("#noiseVal").textContent = v + "%";
  }
  if (id === "color") {
    postMat.uniforms.colorMix.value = v / 100;
    document.querySelector("#colorVal").textContent = v + "%";
  }
};
document.querySelector("#imageAnimation").onchange = (event) => {
  const value = +event.target.value;
  if (currentMode === "image" || currentMode === "3d") animationByMode[currentMode] = value;
  postMat.uniforms.animationMode.value = value;
  document.querySelector("#imageAnimationVal").textContent = event.target.options[event.target.selectedIndex].text;
};
document.querySelector("#imageAnimationStrength").oninput = (event) => {
  const value = +event.target.value;
  postMat.uniforms.animationStrength.value = value / 100;
  document.querySelector("#imageAnimationStrengthVal").textContent = value + "%";
};
document.querySelector("#depthStrength").oninput = (event) => {
  const value = +event.target.value;
  postMat.uniforms.depthStrength.value = value / 100;
  document.querySelector("#depthStrengthVal").textContent = value + "%";
};
document.querySelector("#invert").onchange = (e) => postMat.uniforms.invert.value = e.target.checked ? 1 : 0;
document.querySelector("#density").oninput = (e) => {
  const v = +e.target.value;
  postMat.uniforms.density.value = v / 100;
  document.querySelector("#densityVal").textContent = v + "%";
};
function applyGlyphs(chars, label, preserveSequence = false) {
  const sequence = preserveSequence ? [...chars].slice(0, 64) : [.../* @__PURE__ */ new Set([...chars])].slice(0, 64);
  if (!sequence.length) return;
  const ramp = sequence[0] === " " ? sequence.join("") : " " + sequence.join("");
  glyph.texture.dispose();
  glyph = glyphTexture(ramp);
  postMat.uniforms.tGlyph.value = glyph.texture;
  postMat.uniforms.glyphCount.value = glyph.count;
  document.querySelector("#charsetVal").textContent = label;
}
document.querySelector("#charset").onchange = (e) => {
  if (e.target.value === "custom") {
    const value = document.querySelector("#customChars").value;
    if (value) applyGlyphs(value, "\u81EA\u5B9A\u4E49", true);
    return;
  }
  const preset2 = charsets[e.target.value];
  applyGlyphs(preset2.chars, preset2.label);
};
document.querySelector("#customChars").oninput = (e) => {
  const value = e.target.value;
  document.querySelector("#customCharsVal").textContent = [...value].length + " \u5B57\u7B26";
  if (value) {
    document.querySelector("#charset").value = "custom";
    applyGlyphs(value, "\u81EA\u5B9A\u4E49", true);
  }
};
document.querySelector("#rotation").oninput = (e) => {
  rotationSpeed = +e.target.value / 100;
  document.querySelector("#rotationVal").textContent = rotationSpeed.toFixed(2) + "\xD7";
};
for (const [id, uniform, label] of [["bgOpacity", "backgroundOpacity", "bgOpacityVal"], ["sourceOverlay", "sourceOverlay", "sourceOverlayVal"]]) document.querySelector("#" + id).oninput = (e) => {
  const v = +e.target.value;
  postMat.uniforms[uniform].value = v / 100;
  document.querySelector("#" + label).textContent = v + "%";
};
document.querySelector("#blendMode").onchange = (e) => {
  postMat.uniforms.blendMode.value = +e.target.value;
  document.querySelector("#blendModeVal").textContent = e.target.options[e.target.selectedIndex].text;
};
for (const [id, uniform, label] of [["charColor", "charColor", "charColorVal"], ["charColorMid", "charColorMid", "charColorMidVal"], ["charColorEnd", "charColorEnd", "charColorEndVal"], ["bgColor", "bgColor", "bgColorVal"]]) document.querySelector("#" + id).oninput = (e) => {
  postMat.uniforms[uniform].value.set(e.target.value);
  document.querySelector("#" + label).textContent = e.target.value.toUpperCase();
  if (id === "bgColor") {
    viewport.style.background = e.target.value;
    updateCanvasTone(e.target.value);
  }
};
function updateCanvasTone(color) {
  const value = color.replace("#", ""), r = parseInt(value.slice(0, 2), 16), g = parseInt(value.slice(2, 4), 16), b = parseInt(value.slice(4, 6), 16), luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  viewport.dataset.canvasTone = luminance > 0.58 ? "light" : "dark";
}
const palettes = { neon: ["#7c4dff", "#ff2fb3", "#19dfff"], plasma: ["#ff304f", "#ff8a00", "#ffe600"], toxic: ["#bbff00", "#00ff85", "#00d9ff"], ice: ["#143dcc", "#5b2ac7", "#b0189d"] };
function applyColors(colors, background) {
  colors.forEach((color, index) => {
    const id = ["charColor", "charColorMid", "charColorEnd"][index], input = document.querySelector("#" + id);
    input.value = color;
    input.dispatchEvent(new Event("input"));
  });
  if (background) {
    const input = document.querySelector("#bgColor");
    input.value = background;
    input.dispatchEvent(new Event("input"));
    viewport.style.background = background;
  }
}
function selectPalette(name) {
  document.querySelectorAll("[data-palette]").forEach((button) => {
    const selected = button.dataset.palette === name;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  applyColors(palettes[name]);
}
document.querySelectorAll("[data-palette]").forEach((button) => button.onclick = () => selectPalette(button.dataset.palette));
const canvasSchemes = {
  light: { label: "Paper \xB7 \u767D\u5E95\u9ED1\u56FE", colors: ["#050505", "#3f3f3f", "#858585"], bg: "#ffffff", pageBg: "#f1f1ef", copy: "#111111" },
  dark: { label: "Inverse \xB7 \u9ED1\u5E95\u767D\u56FE", colors: ["#ffffff", "#d7d7d7", "#8f8f8f"], bg: "#000000", pageBg: "#101114", copy: "#ffffff" },
  cobalt: { label: "Cobalt \xB7 \u84DD\u5E95\u767D\u56FE", colors: ["#ffffff", "#dbe7ff", "#8eafff"], bg: "#1557ff", pageBg: "#e7edff", copy: "#ffffff" },
  prism: { label: "Prism \xB7 \u767D\u5E95\u84DD\u7D2B\u6E10\u53D8", colors: ["#0b45c6", "#7a32d5", "#e02578"], bg: "#ffffff", pageBg: "#f1f1ef", copy: "#111111" },
  terminal: { label: "Terminal \xB7 \u9ED1\u5E95\u7EFF\u56FE", colors: ["#d8ffd0", "#39ff14", "#078f32"], bg: "#000000", pageBg: "#07140b", copy: "#39ff14" },
  signal: { label: "Signal \xB7 \u7EA2\u5E95\u767D\u56FE", colors: ["#ffffff", "#ffd2d4", "#ff8d92"], bg: "#e5252a", pageBg: "#f8e7e8", copy: "#ffffff" }
};
const canvasScheme = document.querySelector("#canvasScheme");
canvasScheme.innerHTML = Object.entries(canvasSchemes).map(([value, scheme]) => `<option value="${value}">${scheme.label}</option>`).join("");
const schemeControl = document.createElement("section");
schemeControl.className = "group schemeControl";
schemeControl.innerHTML = `<div class="label"><span>\u753B\u5E03\u914D\u8272</span><span>THEMES</span></div><div class="schemeDots" role="radiogroup" aria-label="Canvas theme"></div>`;
document.querySelector(".paletteGrid").closest(".group").before(schemeControl);
const schemeDots = schemeControl.querySelector(".schemeDots");
Object.entries(canvasSchemes).forEach(([name, scheme]) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "schemeDot";
  button.dataset.scheme = name;
  button.title = scheme.label;
  button.setAttribute("aria-label", scheme.label);
  button.setAttribute("role", "radio");
  button.style.setProperty("--scheme-bg", scheme.bg);
  button.style.setProperty("--scheme-a", scheme.colors[0]);
  button.style.setProperty("--scheme-b", scheme.colors[1]);
  button.style.setProperty("--scheme-c", scheme.colors[2]);
  button.onclick = () => applyCanvasScheme(name);
  schemeDots.append(button);
});
function syncCopyColor(color) {
  if (!document.querySelector("#autoCopyColor").checked) return;
  const copyColor = document.querySelector("#copyColor");
  copyColor.value = color;
  document.querySelector("#copyColorVal").textContent = copyColor.value.toUpperCase();
}
function applyCanvasScheme(name) {
  const scheme = canvasSchemes[name];
  if (!scheme) return;
  applyColors(scheme.colors, scheme.bg);
  const materialMix = document.querySelector("#color");
  materialMix.value = "0";
  materialMix.dispatchEvent(new Event("input"));
  const appShell = document.querySelector(".shell");
  const appStage = document.querySelector(".stage");
  appShell.style.setProperty("--page-theme-bg", scheme.pageBg);
  appShell.style.setProperty("--bg", scheme.pageBg);
  appShell.style.background = scheme.pageBg;
  appStage.style.background = scheme.pageBg;
  document.documentElement.style.background = scheme.pageBg;
  document.body.style.background = scheme.pageBg;
  canvasScheme.value = name;
  document.querySelectorAll("[data-scheme]").forEach((button) => {
    const selected = button.dataset.scheme === name;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-checked", String(selected));
  });
  document.querySelectorAll("[data-palette]").forEach((button) => {
    button.classList.remove("selected");
    button.setAttribute("aria-pressed", "false");
  });
  syncCopyColor(scheme.copy);
  drawCopy();
}
canvasScheme.onchange = (e) => applyCanvasScheme(e.target.value);
for (const id of ["headlineText", "introText"]) document.querySelector("#" + id).oninput = drawCopy;
document.querySelector("#showCopy").onchange = drawCopy;
document.querySelector("#copyAlign").onchange = (e) => {
  document.querySelector("#copyAlignVal").textContent = { left: "\u5DE6\u5BF9\u9F50", center: "\u5C45\u4E2D", right: "\u53F3\u5BF9\u9F50" }[e.target.value];
  drawCopy();
};
document.querySelector("#copyScale").oninput = (e) => {
  document.querySelector("#copyScaleVal").textContent = (e.target.value || "0") + " px";
  drawCopy();
};
document.querySelector("#introScale").oninput = (e) => {
  document.querySelector("#introScaleVal").textContent = (e.target.value || "0") + " px";
  drawCopy();
};
document.querySelector("#autoCopyColor").onchange = (e) => {
  if (e.target.checked) syncCopyColor(document.querySelector(".shell").dataset.theme);
  drawCopy();
};
document.querySelector("#copyColor").oninput = (e) => {
  document.querySelector("#autoCopyColor").checked = false;
  document.querySelector("#copyColorVal").textContent = e.target.value.toUpperCase();
  drawCopy();
};
const copyFontSelect = document.querySelector("#copyFont"), fontStatus = document.querySelector("#fontStatus");
copyFontSelect.previousElementSibling.querySelector("span").textContent = "\u5728\u7EBF\u5B57\u4F53";
copyFontSelect.innerHTML = `
  <optgroup label="EDITORIAL SERIF">
    <option value="Playfair Display">Playfair Display</option>
    <option value="Bodoni Moda">Bodoni Moda</option>
    <option value="Cormorant Garamond">Cormorant Garamond</option>
    <option value="DM Serif Display">DM Serif Display</option>
    <option value="EB Garamond">EB Garamond</option>
    <option value="Libre Baskerville">Libre Baskerville</option>
    <option value="Lora">Lora</option>
    <option value="Merriweather">Merriweather</option>
    <option value="Crimson Pro">Crimson Pro</option>
    <option value="Spectral">Spectral</option>
    <option value="Cinzel">Cinzel</option>
    <option value="Noto Serif SC">Noto Serif SC \u00B7 \u601D\u6E90\u5B8B\u4F53</option>
  </optgroup>
  <optgroup label="MODERN SANS">
    <option value="Space Grotesk">Space Grotesk</option>
    <option value="Syne">Syne</option>
    <option value="IBM Plex Sans">IBM Plex Sans</option>
    <option value="Oswald">Oswald</option>
    <option value="Bebas Neue">Bebas Neue</option>
    <option value="Rajdhani">Rajdhani</option>
  </optgroup>
  <optgroup label="TECH / DISPLAY">
    <option value="Orbitron">Orbitron</option>
    <option value="Unbounded">Unbounded</option>
    <option value="IBM Plex Mono">IBM Plex Mono</option>
    <option value="JetBrains Mono">JetBrains Mono</option>
  </optgroup>
  <optgroup label="SYSTEM FALLBACK">
    <option value="Georgia">Georgia</option>
    <option value="Times New Roman">Times New Roman</option>
    <option value="system-ui">System UI</option>
  </optgroup>`;
copyFontSelect.value = "system-ui";
fontStatus.textContent = "SYSTEM UI";
document.querySelector(".fontActions")?.remove();
copyFontSelect.onchange = async (e) => {
  fontStatus.textContent = e.target.options[e.target.selectedIndex].text.toUpperCase();
  await document.fonts.load(`32px "${e.target.value}"`);
  drawCopy();
};
document.querySelector("#gradientAngle").oninput = (e) => {
  const v = +e.target.value;
  postMat.uniforms.gradientAngle.value = THREE.MathUtils.degToRad(v);
  document.querySelector("#gradientAngleVal").textContent = v + "\xB0";
};
document.querySelector("#isolate").onchange = (e) => postMat.uniforms.isolate.value = e.target.checked ? 1 : 0;
document.querySelector("#isolation").oninput = (e) => {
  const v = +e.target.value;
  postMat.uniforms.isolation.value = v / 100;
  document.querySelector("#isolationVal").textContent = v + "%";
};
document.querySelector("#cleanup").oninput = (e) => {
  const v = +e.target.value;
  postMat.uniforms.cleanup.value = v / 100;
  document.querySelector("#cleanupVal").textContent = v + "%";
};
document.querySelector("#edgeCrop").oninput = (e) => {
  const v = +e.target.value;
  postMat.uniforms.edgeCrop.value = v / 100;
  document.querySelector("#edgeCropVal").textContent = v + "%";
};
document.querySelector("#bloom").oninput = (e) => {
  const v = +e.target.value;
  bloomMat.uniforms.intensity.value = v / 100;
  document.querySelector("#bloomVal").textContent = v + "%";
};
document.querySelector("#bloomRadius").oninput = (e) => {
  const v = +e.target.value / 100;
  bloomMat.uniforms.radius.value = v;
  document.querySelector("#bloomRadiusVal").textContent = v.toFixed(1);
};
document.querySelector("#bloomThreshold").oninput = (e) => {
  const v = +e.target.value;
  bloomMat.uniforms.threshold.value = v / 100;
  document.querySelector("#bloomThresholdVal").textContent = v + "%";
};
const drop = document.querySelector("#drop");
for (const ev of ["dragenter", "dragover"]) viewport.addEventListener(ev, (e) => {
  e.preventDefault();
  drop.classList.add("on");
});
for (const ev of ["dragleave", "drop"]) viewport.addEventListener(ev, (e) => {
  e.preventDefault();
  drop.classList.remove("on");
});
viewport.addEventListener("drop", (e) => e.dataTransfer.files[0] && openFile(e.dataTransfer.files[0]));
viewport.addEventListener("pointermove", (e) => {
  const r = viewport.getBoundingClientRect();
  postMat.uniforms.pointer.value.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
  const middleDown = (e.buttons & 4) !== 0, leftDown = (e.buttons & 1) !== 0, moveMedia = currentMode !== "3d" && leftDown;
  if (middleDown && middleTarget === "copy") {
    copyOffsetX += (e.movementX || 0) / r.width;
    copyOffsetY += (e.movementY || 0) / r.height;
    drawCopy();
  } else if (middleDown || moveMode && leftDown || moveMedia) {
    modelPanX += (e.movementX || 0) / r.width * 5;
    modelPanY -= (e.movementY || 0) / r.height * 3;
  } else if (currentMode === "3d" && leftDown) {
    targetY += (e.movementX || 0) * 6e-3;
    targetX += (e.movementY || 0) * 6e-3;
  }
});
viewport.addEventListener("pointerdown", (e) => {
  if (e.button === 1) {
    e.preventDefault();
    const r = viewport.getBoundingClientRect(), px = (e.clientX - r.left) / r.width * canvasWidth, py = (e.clientY - r.top) / r.height * canvasHeight;
    middleTarget = px >= copyHitBox.x1 && px <= copyHitBox.x2 && py >= copyHitBox.y1 && py <= copyHitBox.y2 ? "copy" : "media";
    viewport.classList.add("middleMove");
  }
});
viewport.addEventListener("pointerup", (e) => {
  if (e.button === 1) {
    middleTarget = "media";
    viewport.classList.remove("middleMove");
  }
});
viewport.addEventListener("pointerleave", () => {
  middleTarget = "media";
  viewport.classList.remove("middleMove");
});
viewport.addEventListener("auxclick", (e) => {
  if (e.button === 1) e.preventDefault();
});
viewport.addEventListener("wheel", (e) => {
  e.preventDefault();
  modelZoom = THREE.MathUtils.clamp(modelZoom * Math.exp(-e.deltaY * 1e-3), 0.35, 8);
}, { passive: false });
stage.addEventListener("wheel", (event) => {
  if (viewport.contains(event.target)) return;
  event.preventDefault();
  previewZoom = THREE.MathUtils.clamp(previewZoom * Math.exp(-event.deltaY * 8e-4), 0.5, 1.8);
  viewport.style.transform = `scale(${previewZoom})`;
  document.querySelector(".stageFooter span:first-child").textContent = `CANVAS PREVIEW // ${Math.round(previewZoom * 100)}%`;
}, { passive: false });
stage.addEventListener("dblclick", (event) => {
  if (viewport.contains(event.target)) return;
  previewZoom = defaultPreviewZoom;
  viewport.style.transform = `scale(${defaultPreviewZoom})`;
  document.querySelector(".stageFooter span:first-child").textContent = `CANVAS PREVIEW // ${Math.round(defaultPreviewZoom * 100)}%`;
});
viewport.addEventListener("pointerdown", () => {
  if (currentMode === "video" && videoEl?.paused) videoEl.play().then(() => statusEl.textContent = "LIVE VIDEO ASCII").catch(() => statusEl.textContent = "PLAYBACK BLOCKED \xB7 CLICK AGAIN");
});
function resize() {
  const rw = canvasWidth, rh = canvasHeight;
  renderer.setSize(rw, rh, false);
  target.setSize(rw, rh);
  asciiTarget.setSize(rw, rh);
  camera.aspect = rw / rh;
  camera.updateProjectionMatrix();
  fitMediaPlane();
  postMat.uniforms.resolution.value.set(rw, rh);
  bloomMat.uniforms.resolution.value.set(rw, rh);
  updateMediaBounds();
  drawCopy();
  document.fonts.ready.then(() => requestAnimationFrame(() => {
    drawCopy();
    copyTexture.needsUpdate = true;
  }));
}
const sizes = { wide: [1920, 640], square: [1080, 1080], "4:3": [1600, 1200], "3:4": [1200, 1600], "16:9": [1920, 1080], "9:16": [1080, 1920] };
function applyCanvasSize(w, h, resetCopy = false) {
  canvasWidth = Math.max(64, Math.min(4096, Math.round(w) || 1920));
  canvasHeight = Math.max(64, Math.min(4096, Math.round(h) || 1080));
  if (resetCopy) {
    copyOffsetX = 0;
    copyOffsetY = 0;
  }
  document.querySelector("#canvasWidth").value = canvasWidth;
  document.querySelector("#canvasHeight").value = canvasHeight;
  document.querySelector("#canvasReadout").textContent = canvasWidth + " \xD7 " + canvasHeight;
  const ratio = canvasWidth / canvasHeight;
  viewport.style.aspectRatio = canvasWidth + "/" + canvasHeight;
  viewport.style.width = `min(100%, calc((100vh - 132px) * ${ratio}))`;
  resize();
}
const preset = document.querySelector("#canvasPreset"), customSize = document.querySelector("#customSize");
preset.onchange = (e) => {
  const custom = e.target.value === "custom";
  customSize.classList.toggle("show", custom);
  if (!custom) applyCanvasSize(...sizes[e.target.value], true);
};
for (const id of ["canvasWidth", "canvasHeight"]) {
  const input = document.querySelector("#" + id);
  input.onchange = () => applyCanvasSize(+document.querySelector("#canvasWidth").value, +document.querySelector("#canvasHeight").value);
  input.onkeydown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyCanvasSize(+document.querySelector("#canvasWidth").value, +document.querySelector("#canvasHeight").value);
      input.blur();
    }
  };
}
const shell = document.querySelector(".shell"), panel = document.querySelector("#controlsPanel"), exportMenu = document.querySelector("#exportMenu");
document.querySelector("#controlsBtn").onclick = () => panel.classList.add("open");
document.querySelector("#closeControls").onclick = () => panel.classList.remove("open");
document.querySelector("#themeBtn").onclick = () => {
  const theme = shell.dataset.theme === "dark" ? "light" : "dark";
  shell.dataset.theme = theme;
  applyCanvasScheme(theme);
  selectPalette("ice");
  document.querySelector("#themeBtn").title = theme === "dark" ? "\u5207\u6362\u5230\u6D45\u8272\u6A21\u5F0F" : "\u5207\u6362\u5230\u6DF1\u8272\u6A21\u5F0F";
};
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    panel.classList.remove("open");
    exportMenu.classList.remove("open");
  }
});
document.querySelector("#exportBtn").onclick = (e) => {
  e.stopPropagation();
  exportMenu.classList.toggle("open");
};
document.addEventListener("click", (e) => {
  if (!e.target.closest(".exportWrap")) exportMenu.classList.remove("open");
});
function download(blob, name) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1500);
}
function exportConfig() {
  const controls = {};
  document.querySelectorAll("input[id],select[id],textarea[id]").forEach((element) => {
    if (element.type === "file") return;
    controls[element.id] = element.type === "checkbox" ? { checked: element.checked } : { value: element.value };
  });
  const preset = {
    version: 1,
    exportedAt: new Date().toISOString(),
    canvas: { width: canvasWidth, height: canvasHeight },
    transform: { zoom: modelZoom, panX: modelPanX, panY: modelPanY, rotationSpeed, copyOffsetX, copyOffsetY },
    theme: document.querySelector(".shell").dataset.theme,
    controls
  };
  const clone = document.documentElement.cloneNode(true);
  clone.querySelector("#controlsPanel")?.classList.remove("open");
  clone.querySelector("#exportMenu")?.classList.remove("open");
  const embedStyle = document.createElement("style");
  embedStyle.textContent = `html,body,#app{width:100%!important;height:100%!important;margin:0!important;overflow:hidden!important}.shell{height:100%!important;display:block!important}.topbar,.panel,.stageFooter,.hud,.status,.drop{display:none!important}.stage{width:100%!important;height:100%!important;padding:0!important;display:grid!important;place-items:center!important}.viewport{max-width:100%!important;max-height:100%!important;box-shadow:none!important}`;
  clone.querySelector("head").append(embedStyle);
  const bootstrap = document.createElement("script");
  const safePreset = JSON.stringify(preset).replaceAll("<", "\\u003c");
  bootstrap.textContent = `/* Embedded renderer preset */
window.ASCII_FORGE_PRESET=${safePreset};
window.addEventListener("load",()=>setTimeout(()=>{
  const preset=window.ASCII_FORGE_PRESET;
  for(const [id,state] of Object.entries(preset.controls)){
    const element=document.getElementById(id);
    if(!element)continue;
    if("checked" in state)element.checked=state.checked;
    else element.value=state.value;
  }
  for(const [id,state] of Object.entries(preset.controls)){
    const element=document.getElementById(id);
    if(!element)continue;
    element.dispatchEvent(new Event(element.tagName==="SELECT"?"change":"input",{bubbles:true}));
  }
  document.querySelector(".shell").dataset.theme=preset.theme;
  window.dispatchEvent(new CustomEvent("ascii-forge-apply-transform",{detail:preset.transform}));
},0));`;
  clone.querySelector("body").append(bootstrap);
  const html = "<!doctype html>\n" + clone.outerHTML;
  const componentSource = `/*
ASCII simulation art console — embeddable Web Component

Usage:
  <script type="module" src="./ascii-simulation-art.js"></script>
  <ascii-simulation-art style="display:block;width:100%;aspect-ratio:${canvasWidth}/${canvasHeight}"></ascii-simulation-art>

JavaScript:
  import { mountAsciiSimulationArt } from "./ascii-simulation-art.js";
  const art = mountAsciiSimulationArt(document.querySelector("#hero"));
  await art.ready;
  await art.setSource("/assets/hero.glb"); // image, SVG, video or GLB
  await art.setControl("bloom", 180);
  await art.setTransform({ zoom: 2, panX: 0, panY: 0 });
  // art.destroy();
*/
const EMBED_HTML=${JSON.stringify(html)};
const TAG_NAME="ascii-simulation-art";

export class AsciiSimulationArt extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this._frame=document.createElement("iframe");
    this._frame.title=this.getAttribute("aria-label")||"ASCII simulation art";
    this._frame.style.cssText="display:block;width:100%;height:100%;border:0;background:transparent";
    this._frame.setAttribute("allow","autoplay");
    this.ready=new Promise(resolve=>{this._resolveReady=resolve;});
    this._frame.addEventListener("load",()=>{if(this._loaded)requestAnimationFrame(()=>this._resolveReady(this));});
    this.shadowRoot.append(this._frame);
  }
  connectedCallback(){
    if(!this.style.display)this.style.display="block";
    if(!this.style.aspectRatio)this.style.aspectRatio="${canvasWidth}/${canvasHeight}";
    if(!this._loaded){this._loaded=true;this._frame.srcdoc=EMBED_HTML;}
  }
  get rendererWindow(){return this._frame.contentWindow;}
  async setControl(id,value){
    await this.ready;
    const element=this._frame.contentDocument?.getElementById(id);
    if(!element)return false;
    if(element.type==="checkbox")element.checked=Boolean(value);else element.value=String(value);
    element.dispatchEvent(new Event(element.tagName==="SELECT"?"change":"input",{bubbles:true}));
    return true;
  }
  async setTransform(transform={}){
    await this.ready;
    this.rendererWindow?.dispatchEvent(new CustomEvent("ascii-forge-apply-transform",{detail:transform}));
  }
  async setSource(source,name){
    await this.ready;
    const blob=source instanceof Blob?source:await fetch(source).then(response=>{
      if(!response.ok)throw new Error("Unable to load ASCII source: "+response.status);
      return response.blob();
    });
    const inferredName=name||(typeof source==="string"?source.split("/").pop()?.split("?")[0]:"")||"ascii-source";
    const file=source instanceof File?source:new File([blob],inferredName,{type:blob.type});
    const transfer=new DataTransfer();
    transfer.items.add(file);
    const input=this._frame.contentDocument?.getElementById("file");
    if(!input)throw new Error("ASCII source input is unavailable");
    input.files=transfer.files;
    input.dispatchEvent(new Event("change",{bubbles:true}));
    return this;
  }
  destroy(){this._frame.src="about:blank";this.remove();}
}

if(!customElements.get(TAG_NAME))customElements.define(TAG_NAME,AsciiSimulationArt);

export function mountAsciiSimulationArt(target,options={}){
  if(!target)throw new Error("mountAsciiSimulationArt requires a target element");
  const element=document.createElement(TAG_NAME);
  if(options.className)element.className=options.className;
  if(options.style)Object.assign(element.style,options.style);
  target.append(element);
  return element;
}
`;
  download(new Blob([componentSource], { type: "text/javascript;charset=utf-8" }), "ascii-simulation-art.js");
}
function exportImage() {
  renderer.domElement.toBlob((blob) => blob && download(blob, "ascii-forge-" + canvasWidth + "x" + canvasHeight + ".png"), "image/png");
}
function exportVideo() {
  const label = document.querySelector("#recordStatus");
  if (typeof MediaRecorder === "undefined" || !renderer.domElement.captureStream) {
    label.textContent = "REC UNSUPPORTED";
    return;
  }
  const stream = renderer.domElement.captureStream(30), mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm", recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 12e6 }), chunks = [];
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  recorder.onstop = () => {
    download(new Blob(chunks, { type: mime }), "ascii-forge-" + canvasWidth + "x" + canvasHeight + ".webm");
    stream.getTracks().forEach((t) => t.stop());
    label.textContent = "REC COMPLETE";
  };
  recorder.start();
  label.textContent = "\u25CF REC 00:15";
  setTimeout(() => recorder.state === "recording" && recorder.stop(), 15e3);
}
document.querySelectorAll("[data-export]").forEach((button) => button.onclick = () => {
  ({ image: exportImage, video: exportVideo, code: exportConfig })[button.dataset.export]();
  exportMenu.classList.remove("open");
});
addEventListener("resize", resize);
document.querySelector("#canvasPreset").value = "9:16";
applyCanvasSize(1080, 1920);
builtIn();
applyCanvasScheme("prism");
selectPalette("ice");
const dynamicFrameBox = new THREE.Box3(), dynamicFrameCenter = new THREE.Vector3();
let last = performance.now(), frames = 0;
function animate(time) {
  requestAnimationFrame(animate);
  postMat.uniforms.animationTime.value = time / 1000;
  postMat.uniforms.animationActive.value = (currentMode === "image" || currentMode === "3d") && postMat.uniforms.animationMode.value > 0 ? 1 : 0;
  postMat.uniforms.depthActive.value = currentMode === "3d" ? 1 : 0;
  if (mediaTexture?.userData.draw) mediaTexture.userData.draw(time);
  dragX += (targetX - dragX) * 0.08;
  dragY += (targetY - dragY) * 0.08;
  content.scale.setScalar(currentMode === "3d" ? fitted3DScale() : modelZoom);
  if (currentMode === "3d") {
    content.position.set(0, 0, 0);
    content.rotation.x = dragX + Math.sin(time * 35e-5 * Math.abs(rotationSpeed)) * 0.16 * Math.min(1, Math.abs(rotationSpeed));
    content.rotation.y = dragY + time * 22e-5 * rotationSpeed;
    content.updateMatrixWorld(true);
    dynamicFrameBox.setFromObject(content).getCenter(dynamicFrameCenter);
    content.position.x = -dynamicFrameCenter.x + modelPanX;
    content.position.y = -dynamicFrameCenter.y + modelPanY;
  } else {
    content.rotation.set(0, 0, 0);
    content.position.set(modelPanX, modelPanY, 0);
    updateMediaBounds();
  }
  content.updateMatrixWorld(true);
  if (currentMode === "3d") {
    dynamicFrameBox.setFromObject(content);
    const surfaceNear = camera.position.z - dynamicFrameBox.max.z;
    const surfaceFar = camera.position.z - dynamicFrameBox.min.z;
    const surfaceSpan = Math.max(surfaceFar - surfaceNear, 0.01);
    postMat.uniforms.depthRangeNear.value = Math.max(camera.near, surfaceNear - surfaceSpan * 0.035);
    postMat.uniforms.depthRangeFar.value = Math.min(camera.far, surfaceFar + surfaceSpan * 0.035);
  }
  renderer.setRenderTarget(target);
  renderer.render(scene, camera);
  renderer.setRenderTarget(asciiTarget);
  renderer.render(postScene, postCamera);
  renderer.setRenderTarget(null);
  renderer.render(bloomScene, bloomCamera);
  frames++;
  if (time - last > 1e3) {
    document.querySelector("#fps").textContent = frames + " FPS";
    frames = 0;
    last = time;
  }
}
requestAnimationFrame(animate);

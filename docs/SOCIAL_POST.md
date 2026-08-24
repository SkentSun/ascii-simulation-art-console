# Social post

最近我做了一个实验性工具：**ASCII Simulation Art Console**。

最初只是想复刻一段视频里的 ASCII 卡片效果，后来逐渐把它做成了一个可以处理 **3D 模型、图片、透明 SVG 和视频** 的实时视觉控制台。

它不是把字符铺成大量 DOM 节点，而是先把不同媒体统一渲染为纹理，再通过 Three.js 和自定义 GLSL Shader 在 GPU 中完成字符采样、明暗映射、三色渐变、主体分离、深度检测与 Bloom。

其中最有挑战的是 3D：网络模型的尺寸、轴心、材质和光照都不统一，仅依赖普通亮度很容易把结构“照平”。最后我增加了专用法线分析通道，并把实时深度、局部梯度、曲率和轮廓共同映射到字符的类型、尺寸、透明度与间距，即使使用 `0/1` 这样的二进制字符，也能表达模型表面的起伏。

目前工具支持：

- GLB/GLTF、图片、SVG、MP4/WebM
- 自定义字符、密度、对比度、噪点和字符尺寸
- 三色渐变、经典混合模式、Light/Dark 主题
- 数字瀑布、扫描线、波浪和故障动画
- 9:16、16:9、1:1 及自定义画布
- 可编辑的 H1 与简介文字
- PNG、15 秒 WebM 和可嵌入 Web Component 导出

这次过程让我重新理解了一件事：ASCII effect 并不是简单的“亮度换字符”。真正决定画面是否清晰的，是采样尺度、字符视觉重量、深度归一化、边缘信号和颜色系统之间的配合。

接下来还想继续研究更稳定的实时分割、GPU 多尺度边缘检测，以及更适合动态品牌视觉的预设系统。

#ThreeJS #WebGL #GLSL #CreativeCoding #GenerativeArt #ASCIIArt #WebDesign #Frontend

## Short version

把最初想复刻的 ASCII 卡片效果，做成了一个实时视觉工具：**ASCII Simulation Art Console**。

它支持 3D、图片、透明 SVG 和视频，通过 Three.js + GLSL 在 GPU 中完成字符化、深度/法线分析、三色渐变、主体分离、Bloom 和字符动画，并可导出 PNG、15 秒 WebM 与可嵌入 Web Component。

最大的收获是：清晰的 ASCII 画面不只是“亮度换字符”，还依赖字符重量、尺寸、透明度、深度归一化和边缘信号的共同设计。

#ThreeJS #WebGL #CreativeCoding #ASCIIArt

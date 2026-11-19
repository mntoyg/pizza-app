# frontend/vendor

Self-hosted files for the on-device camera feature. Nothing here is loaded from a CDN, and no video
or landmarks ever leave the browser.

| File | What | Source |
| ---- | ---- | ------ |
| `pizza-core.iife.js` | PizzaCore (pose engine, rep counters, safety guard, local storage). Sets the global `PizzaCore`. | Built from `ai/` (`cd ai && npm ci && npm run build`, then copy `ai/dist/pizza-core.iife.js`). Rebuild and copy whenever `ai/` changes. |
| `mediapipe/vision_bundle.js` | `@mediapipe/tasks-vision` 0.10.14 (Apache-2.0), unmodified. Renamed from `vision_bundle.mjs` so that simple static servers send a JavaScript MIME type. | npm package `@mediapipe/tasks-vision@0.10.14` |
| `mediapipe/wasm/vision_wasm_internal.{js,wasm}` | MediaPipe WebAssembly runtime, **SIMD build only** (the non-SIMD build was left out to save ~9 MB, so browsers without WebAssembly SIMD fall back to the demo-animation mode). | same package, `wasm/` folder |
| `models/pose_landmarker_lite.task` | Pose Landmarker (lite) model, float16. | `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task` |

Total ~15 MB. SHA-256 (first 16 hex chars) when added on 2026-11-19:

```
e77f281f9619150d  mediapipe/vision_bundle.js
9440cf0cc0cea218  mediapipe/wasm/vision_wasm_internal.js
f82a8e6c05e08a44  mediapipe/wasm/vision_wasm_internal.wasm
59929e1d1ee95287  models/pose_landmarker_lite.task
```

To serve locally use `npx serve frontend` (or `python -m http.server 8080 -d frontend`). The camera needs
HTTPS or `localhost`.

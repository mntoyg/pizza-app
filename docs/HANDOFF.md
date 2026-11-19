# Handoff
- Main app: `frontend/index.html` + `frontend/app.js` (vanilla JS, no build step). The exercise data is in `const EX=` in `app.js`; see the README.
- `camera-prototype/`: the first React + MediaPipe prototype (arm-raise rep counting). It is not used by the main app (the main app has its own camera integration). To run it you need `npm install` and the `pose_landmarker_lite.task` model placed in `camera-prototype/public/models/`.
- A physiotherapist must review: the exercises, joint angles, speed, precautions, carer conditions, wording, and the links in the Knowledge center.
- Not yet tested on a wide range of real devices or with screen readers. `camera-prototype` has not been built or deployed.

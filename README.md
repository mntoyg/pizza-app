# PIZZA — Parkinson's home activity coach

A mobile-first web app that coaches a home exercise for people with Parkinson's. It uses the phone or laptop camera to count repetitions **on the device**: no video, image or body-landmark data ever leaves the browser.

**Live demo:** https://pizza-parkinson-camera.vercel.app (open it in Chrome or Safari, not inside an in-app browser such as LINE, Facebook or Instagram)
**Track:** Healthcare · STEM2Connect AI Hackathon 2026

> **Status: prototype.** PIZZA is an activity-support tool. It is **not a medical device**, does not diagnose or treat anything, does not replace a physiotherapist, and does not detect freezing, tremor or falls. All exercise demos are drafts that have **not been reviewed by a physiotherapist**, and every threshold and target (for example "5 reps") is a placeholder.

## The problem

People with Parkinson's are commonly encouraged to stay physically active, and much of that practice happens at home, where nobody is watching. It is hard for the person (or a carer) to know whether an exercise is actually being done, how often, and whether they are in a safe position to do it. We wanted a small, privacy-respecting coach that gives immediate feedback at home without sending video anywhere.

## What works today (and what does not)

| Area | Status |
| --- | --- |
| Exercise library with animated demos, steps and precautions (4 exercises) | Works. Demos are drafts, not clinically reviewed. |
| **Camera rep counting for the "High arm raise"** | Works. This is the only exercise we have tried with a real camera. |
| Other 3 exercises (seated alternating arm raise, sit-to-stand, seated trunk rotation) | Demo animation only. The counter follows the animation, not your movement, and the app says so. The counting logic for them exists and is unit-tested with synthetic landmarks, but it has **not** been tried with a real camera. |
| Session history and a 7-day chart | Works. Stored on the device (IndexedDB). "Delete all data" removes it. |
| Backend (Supabase: consent, sync, care links, audit log) | Built and tested against a local Supabase stack. **Not connected to the live demo**: no cloud project exists, so nothing is sent anywhere. |
| LLM / chatbot coach | Not built. |
| Thai UI, offline use | Not built (UI is English only; there is a manifest and icons so it can be added to the home screen, but no service worker). |
| Carers page | Sample data only, clearly labelled in the app. |

## Try it (for judges)

1. Open https://pizza-parkinson-camera.vercel.app on a phone or a laptop with a camera, in Chrome or Safari. The first load downloads about 15 MB (the pose model), so it can take a moment.
2. Finish the 3-step intro, open **Exercises → High arm raise → Start exercise**, tick the safety checklist and allow the camera when asked.
3. Prop the phone up at about waist height and tap **Start in 10 s**, then step back about 2 m so your **head down to your hips** is in view. Counting starts by itself once the camera sees you clearly.
4. Slowly raise both arms and lower them. The app counts reps (target: 5) and shows the time. If the camera cannot see you clearly it does **not** count (it fails safe instead of guessing).
5. Open **Progress** to see the saved session. **Profile → Delete all data** clears everything.

No account is needed. If you do not have a camera, or the camera cannot start, tap **Skip the camera and use practice mode** (it appears after a few seconds); that mode counts the demo animation, not your movement, and says so.

## How it works

```
camera -> MediaPipe Pose Landmarker (on device) -> joint angles -> signal filtering
       -> per-exercise rep-counter state machine -> rule-based cues
       -> safety guard (pause / stop on lost tracking, user stop, carer not confirmed)
       -> summary numbers (reps, duration, status) stored locally
```

- **Pose estimation** is the only machine-learning component: Google's MediaPipe Pose Landmarker (lite), run in the browser through WebAssembly. The model and runtime are self-hosted in `frontend/vendor/` (no CDN).
- **Counting and safety are deterministic rules**, not a language model or a learned classifier, on purpose: the app must never "guess" whether an exercise is correct or safe. Safety thresholds live in data and are placeholders until a physiotherapist signs them off.
- **Privacy:** video frames and landmarks never leave the device. The web app makes no third-party requests (no CDN, no web fonts, no analytics) and ships a strict Content-Security-Policy. The backend is designed so that only summary numbers can be uploaded, and only after an explicit, versioned, revocable consent enforced in the database.

## AI tools and how we used them

**AI inside the product**

- **MediaPipe Pose Landmarker (lite)** by Google (Apache-2.0), version 0.10.14 of `@mediapipe/tasks-vision`. It estimates body landmarks from camera frames, on the device. Sources and checksums of the vendored files are in [frontend/vendor/README.md](frontend/vendor/README.md).
- No LLM or hosted AI API is used by the app. A server-side LLM weekly summary was designed but **not built**.

**AI assistants used to build it (disclosure)**

- **Claude Code (Anthropic)**, an AI coding assistant, was used to help write and review the TypeScript engine in `ai/` (angle math, filters, rep counters, safety guard, the `PizzaCore` storage/consent/sync layer), the Supabase backend in `backend/` (SQL migrations with row-level security, edge functions, tests including mutation checks of the safety rules), the integration of the camera engine into the web UI, and the documentation. We reviewed and tested its output: unit and database tests, runs against a local Supabase stack, and real-camera tests on a laptop and an iPhone. Design decisions (local-first, rule-based safety, consent model) and the product direction were made by the team.
- The original single-file UI prototype (`frontend/index.html` before our changes) was written by a teammate; the git history shows it as the first commits.

## Evidence and honest limits

- Automated tests (last full run): `ai/` 284 unit tests, `backend/` 263 tests (PGlite for SQL and row-level-security policies, plus handler tests). Type-checking, ESLint and Prettier are clean. Safety rules were additionally checked by mutating the code and confirming that tests fail.
- Against a real local Supabase stack: end-to-end checks of sessions, consent, account deletion, anonymous-to-email upgrade, care links and the real client library (all passing at the last run).
- Camera: the arm raise was tried with real cameras three times: twice on a laptop webcam (Chrome, one person, the second time on the deployed site) and once on an iPhone. Each time, five real repetitions were counted as five. **That is three informal samples, not a measurement of accuracy.** We have not tested low light, several people in frame, tremor, other phones or older browsers.
- The camera needs the head-to-hips view (about 2 m away). With the hips out of frame the app measures nothing and counts nothing, by design.
- Browsers without WebAssembly SIMD fall back to practice mode.

## What we learned

- Doing the work on the device changes the design: the whole pipeline (filtering, a state machine, safety checks) has to be deterministic, testable and small enough to run in a phone browser.
- A UI that works on a laptop can be unusable on a phone. The first phone test showed that a "Start" button that unlocks only when you stand 2 m away cannot be pressed from 2 m away; we replaced it with a countdown.
- Writing the safety rules as data with tests (and checking the tests by mutation) found gaps that reading the code did not.
- Health-adjacent software needs careful wording. We removed claims we could not support and label what is a placeholder.

## What we would build next

1. Have a physiotherapist review the exercises, thresholds and wording, and assess the regulatory position before any clinical claim.
2. Test the camera with many more people and conditions, then extend it to the other exercises (the seated and fall-risk ones need a carer-confirmation flow tested for real).
3. Connect the already-built backend (consent, sync, care links) to the UI, and add a Thai interface and offline use.
4. Add an optional, privacy-preserving weekly summary generated from summary numbers only.

## Repository layout

| Path | What it is |
| --- | --- |
| `frontend/` | The web app: `index.html` + `app.js` (vanilla JS, no build step), `vendor/` (PizzaCore build, MediaPipe, model; about 15 MB), `manifest.webmanifest` + `icons/`, `vercel.json` (security headers). `camera-prototype/` is an earlier React prototype that the app no longer uses. |
| `ai/` | On-device engine in TypeScript: pose session, rep counters, safety guard, cues, and `PizzaCore` (IndexedDB storage, consent, sync, export/delete). |
| `backend/` | Supabase schema and row-level security, edge functions, test and end-to-end scripts. |
| `docs/` | `INTEGRATION.md` (how the engine and backend plug into the UI, CSP notes), `SAFETY_GUIDELINES.md`, `HANDOFF.md`. |

## Run it yourself

The frontend is static files with no build step. It must be served over `localhost` or HTTPS for the camera to work (opening the file directly does not work).

```bash
npx serve frontend            # or: python3 -m http.server 8080 -d frontend
# then open http://localhost:8080
```

Deploy: any static host. On Vercel, import the repository and set **Root Directory = `frontend`**; `vercel.json` adds the security headers.

Rebuild the engine bundle (only needed if you change `ai/`):

```bash
cd ai && npm ci && npm test && npm run typecheck && npm run lint && npm run build
# copy ai/dist/pizza-core.iife.js to frontend/vendor/ (see frontend/vendor/README.md)
```

Backend tests (Node 22; no Docker needed for the unit and policy tests):

```bash
cd backend && npm ci && npm test && npm run typecheck && npm run lint
```

End-to-end tests against a local Supabase stack (needs Docker Desktop):

```bash
cd backend
npm run db:start      # starts the local stack (first run pulls images)
npm run e2e           # sessions, consent, account deletion
npm run e2e:upgrade   # anonymous -> email upgrade keeping the same user id
npm run e2e:care      # care links, patient summary, audit log
npm run e2e:client    # the real client library against the local stack
npm run db:stop
```

## Safety and privacy stance

- Wellness and activity support only. No diagnosis, treatment, freezing/fall detection or clinical scores; the app shows neutral numbers (reps, duration, status).
- Exercises that risk a fall (such as sit-to-stand) need a carer nearby, and a stop control is always reachable.
- If tracking is lost or poor, counting pauses or stops. The app never guesses.
- Video, frames and landmarks stay on the device. Only summary numbers could ever be uploaded, and only with recorded consent.
- Any clinical claim would need a physiotherapist's review and the relevant regulatory review first.

## Credits

- MediaPipe Pose Landmarker by Google (Apache-2.0).
- Built for the STEM2Connect AI Hackathon 2026.

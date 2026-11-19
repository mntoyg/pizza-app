# PIZZA — Parkinson's home activity coach

แอปเว็บ (mobile-first, ติดตั้งลงหน้าจอหลักได้ด้วย manifest + ไอคอน, UI ภาษาอังกฤษ — ยังไม่มี service worker/ใช้ออฟไลน์) ผู้ช่วยออกกำลังกายที่บ้านสำหรับผู้ป่วยพาร์กินสัน
**PIZZA เป็นเพียงชื่อโปรเจกต์ ไม่เกี่ยวกับอาหาร**

> สถานะ: ต้นแบบ (prototype) ภาพสาธิตทุกท่า **ยังไม่ผ่านการตรวจสอบโดยนักกายภาพบำบัด** ไม่ใช่ท่าฝึกที่ได้รับการรับรอง
> ไม่ใช่เครื่องมือวินิจฉัยหรือทดแทนนักกายภาพ

## รันเอง (ไม่ต้อง build)
`frontend/` เป็นไฟล์ static ไม่มี build step (`index.html` + `app.js` + ไฟล์ self-host ใน `vendor/`) ต้องเปิดผ่าน server (เปิดไฟล์ตรง ๆ ใช้กล้องไม่ได้): `npx serve frontend` หรือ `python3 -m http.server 8080 -d frontend` กล้องต้องใช้ `localhost` หรือ HTTPS

## Deploy
- **Vercel:** push GitHub → Import project → Framework "Other" ไม่ต้องตั้ง build command · **ตั้ง Root Directory = `frontend`**
- **GitHub Pages:** Settings → Pages → Deploy from branch → โฟลเดอร์ `frontend`

## ฟีเจอร์ที่ทำงานแล้ว (ทดสอบด้วย Chromium headless)
Onboarding 3 ขั้น · หน้าแรก · คลังท่า (4 หมวด) · รายละเอียดท่า + Exercise Player · Session (เช็กความปลอดภัย, เวลา, นับครั้ง, หยุด/ทำต่อ/จบ, บันทึกตามสถานะจริง) · ความก้าวหน้า (กราฟ 7 วัน, ประวัติ) · ผู้ดูแล (ข้อมูลตัวอย่าง) · ศูนย์ความรู้ (ลิงก์ภายนอก) · ตั้งค่า (ขนาดตัวอักษร, เสียง, ลบข้อมูล) · โหมดมืด · รองรับ reduced motion

Animation 4 ท่า: ยกแขนสูง, นั่งยกแขนสลับข้าง, ลุก–นั่ง, หมุนลำตัวขณะนั่ง — SVG rig ควบคุมได้ (เล่น/หยุด/เล่นซ้ำ/0.5x–1x/ไทม์ไลน์/มุมหน้า-ข้าง/แสดงข้อต่อ/เส้นแนวมือ/คำบรรยาย)

**นับด้วยกล้องบนอุปกรณ์:** เฉพาะท่ายกแขน (ท่าอื่นเป็นโหมดจำลองที่นับตามแอนิเมชัน และมีป้าย "Demo animation only") — ขั้นตอนจัดเฟรม, ปุ่ม "Start in 10 s" ให้ถอยห่าง ~2 ม. แล้วเริ่มนับเองเมื่อกล้องเห็นตัวชัด, เก็บประวัติใน IndexedDB ในเครื่อง

## Backend + AI (`ai/` และ `backend/`)

ภาพรวม: ประมวลผลท่าทาง **บนอุปกรณ์** (MediaPipe) → มุมข้อต่อ → กรองสัญญาณ → นับครั้งด้วย state machine → cue จากกฎ
**วิดีโอ ภาพ และ landmark ไม่ออกจากเครื่อง** ขึ้นเซิร์ฟเวอร์ได้เฉพาะตัวเลขสรุป (จำนวนครั้ง เวลา สถานะ) และเฉพาะเมื่อผู้ใช้ยินยอม (PDPA)
ฝั่งเซิร์ฟเวอร์ใช้ Supabase (Auth + Postgres + RLS + Edge Functions) · ตัวตัดสินท่า/ความปลอดภัยเป็นกฎ ไม่ใช้ LLM/ML ตัดสิน

| ส่วน | ทำอะไร |
|------|--------|
| `ai/` | Pose engine, ตัวนับ 5 ท่า, safety guard (หยุดเมื่อกดหยุด/หลุดเฟรม/กล้องหยุด/ท่าเสี่ยงล้มที่ผู้ดูแลยังไม่ยืนยัน), `PizzaCore` (IndexedDB, consent, sync, ส่งออก/ลบข้อมูล) |
| `backend/` | ตาราง `profiles`, `consents` (+ประวัติแก้ไม่ได้), `exercises`, `sessions`, `care_links`, `audit_log` · RLS ทุกตาราง · Edge Functions `sessions-batch` `consents` `delete-me` `care-links` `patient-summary` |

**Care link (ผู้ป่วย ↔ ผู้ดูแล/นักกายภาพ):** ผู้ป่วยเป็นฝ่ายเชิญด้วยโค้ดใช้ครั้งเดียว (หมดอายุ 7 วัน, เก็บเฉพาะ hash, เดาโค้ดผิด 5 ครั้งใน 15 นาทีจะถูกล็อก) ฝั่งผู้รับเชิญต้องเป็นบัญชีจริง
บุคคลที่สามไม่มีสิทธิ์อ่านตาราง `sessions` ตรงๆ — อ่านได้ผ่านฟังก์ชัน `patient_summary()` ที่เดียว ซึ่งเช็กว่ามี link ที่ active **และ** ผู้ป่วยยังให้ consent `share_with_physio`
แล้วบันทึก `audit_log` ใน transaction เดียวกัน (อ่านโดยไม่ถูกบันทึกไม่ได้) ผู้ป่วยดูประวัติว่าใครเปิดดูได้ ถอน consent หรือยกเลิก link แล้วตัดสิทธิ์ทันที

### รันและทดสอบ
```bash
# ai/  (Node 22)
cd ai && npm ci && npm test && npm run typecheck && npm run lint && npm run build

# backend/  — unit/RLS tests ใช้ PGlite ไม่ต้องมี Docker
cd backend && npm ci && npm test && npm run typecheck && npm run lint
```
ทดสอบกับ Supabase จริงในเครื่อง (ต้องเปิด Docker Desktop):
```bash
cd backend
npm run db:start            # เปิด stack local (ครั้งแรกจะดึง image)
npm run e2e                 # sessions / consent / ลบบัญชี        (28 checks)
npm run e2e:upgrade         # anonymous -> email โดย user id เดิม  (10 checks)
npm run e2e:care            # care link + patient-summary + audit  (35 checks)
npm run db:stop
```
ตั้งบทบาท physio ให้บัญชีที่มีอยู่แล้ว (เฉพาะ stack local — สคริปต์ปฏิเสธ URL ที่ไม่ใช่ localhost; ผู้ใช้เลื่อนบทบาทตัวเองไม่ได้):
```bash
cd backend && npm run admin:set-role -- doctor@example.test physio
```

### สถานะการตรวจสอบ (ตามจริง)
- ผ่านแล้ว: `ai/` 284 tests · `backend/` 263 tests · typecheck / eslint / prettier สะอาด · e2e บน Supabase local 28/28, 10/10, 35/35 · `supabase db lint` สะอาด · มี mutation check กับกฎความปลอดภัย
- ทดสอบกล้องและโมเดล MediaPipe จริงแล้ว **เฉพาะท่ายกแขน** (Chrome บนคอม 1 คน: ยกจริง 5 ครั้ง ระบบนับได้ 5 ครั้ง · iPhone 1 เครื่อง: ผู้ทดสอบรายงานว่านับ 5/5 และประวัติถูกบันทึกในหน้า Progress — ทั้งสองเป็นตัวอย่างเดียว ไม่ได้บันทึกรุ่น iOS/เบราว์เซอร์ จึงยังสรุปความแม่นยำโดยรวมไม่ได้) ต้องยืนให้เห็นศีรษะถึงสะโพก ถ้าสะโพกอยู่นอกเฟรม ระบบจะวัดมุมไม่ได้และไม่นับ (fail-safe) — รายละเอียดใน `docs/INTEGRATION.md`
- **ยังไม่ได้ทดสอบ:** ท่าอื่นอีก 4 ท่าด้วยกล้องจริง (ทดสอบด้วย landmark สังเคราะห์เท่านั้น) · แสงน้อย/หลายคนในเฟรม/มือสั่น · โปรเจกต์ Supabase บน cloud (ใช้ local stack) · เครื่องจริง/screen reader (ไฟล์โมเดลไม่ได้อยู่ใน repo)
- ค่าเกณฑ์ของทุกท่า (มุม/จำนวนครั้ง) เป็น **placeholder** และทุกท่าเป็น draft จนกว่านักกายภาพจะอนุมัติ
- ยังไม่มี: LLM coach/RAG · ส่งอีเมลเชิญอัตโนมัติ
- แอปเป็นเครื่องมือส่งเสริมกิจกรรม **ไม่วินิจฉัย ไม่รักษา และไม่อ้างว่าตรวจจับ freezing หรือการล้มได้** — ตัวเลขที่ผู้ดูแลเห็นเป็นเพียงจำนวนครั้ง/เวลา ไม่ใช่คะแนนทางคลินิก

## เพิ่มท่าใหม่
แก้ array `EX` ใน `frontend/app.js` (หา `const EX=`): เพิ่ม object ที่มี `id, name, cat, sup, dur, steps, warn, cap, kf`
`kf` = keyframes `[เวลาวินาที, {มุมข้อต่อ}]` ค่าแรกต้องเท่าค่าสุดท้ายเพื่อให้วนต่อเนื่อง
พารามิเตอร์: `shL shR` (ไหล่), `el` (ศอก), `lean` (โน้มตัว), `tw` (หมุนลำตัว), `h` (สะโพก งอ), `k` (เข่า งอ), `fold` (กอดอก) · `fwd:true` = แขนเคลื่อนไปข้างหน้า (ภาพหน้าแสดงแบบสั้นลง)
ตำแหน่งสะโพก/เท้าคำนวณจากข้อต่อให้เท้าติดพื้นอัตโนมัติ

## งานที่ยังไม่ได้ทำ
1. ย้ายเป็น React + TypeScript + Vite + Tailwind ตามโครงสร้างใน Master Prompt (ตอนนี้เป็น vanilla JS ไฟล์เดียว) แยก engine/data/UI
2. ~~IndexedDB~~ ทำแล้วสำหรับประวัติเซสชัน (ผ่าน `PizzaCore`) · ตั้งค่าผู้ใช้ยังอยู่ใน localStorage
3. Service worker (ใช้ออฟไลน์) — manifest และไอคอน PWA ทำแล้ว
4. Unit tests ฝั่ง UI และชุดทดสอบ accessibility ด้วย screen reader จริง (ฝั่ง `ai/` และ `backend/` มี test แล้ว)
5. ต่อกล้องกับท่าอื่นอีก 4 ท่า (ตอนนี้ต่อแล้วเฉพาะท่ายกแขน) และทดสอบบนเครื่องจริงเพิ่ม
6. ตรวจสอบลิงก์ในศูนย์ความรู้ (ใส่ตามที่ผู้ใช้ให้มา ยังไม่ได้ตรวจเอง)
7. ให้นักกายภาพตรวจ: ท่า, มุม, ความเร็ว, ข้อควรระวัง, เงื่อนไขผู้ดูแล, ถ้อยคำทั้งหมด
8. ท่าเดิน/รำไทย/ไม้พลอง ยังไม่ได้สร้าง (ล็อกไว้ในคลัง)

## โฟลเดอร์
- `frontend/` UI: `index.html` + `app.js` แอปทั้งหมด · `vendor/` PizzaCore + MediaPipe + โมเดล (self-host ~15 MB) · `manifest.webmanifest` + `icons/` · `vercel.json` (CSP/headers) · `camera-prototype/` โปรเจกต์ React+MediaPipe รุ่นแรก (ต้อง npm install แยก ไม่ได้ใช้ในแอปหลักแล้ว)
- `ai/` เอนจินตรวจท่าบนอุปกรณ์ + `PizzaCore` (TypeScript)
- `backend/` Supabase: schema, RLS, Edge Functions, สคริปต์ทดสอบ
- `docs/` `HANDOFF.md` · `QA_PROMPT.md` · `SAFETY_GUIDELINES.md` · `INTEGRATION.md` (คู่มือเสียบ `ai/` + `backend/` เข้า UI)

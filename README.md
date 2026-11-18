# PIZZA — Parkinson's · In-home · Zestful · Zero-fall · Activity coach

แอปเว็บ (PWA-ready, mobile-first, ภาษาไทย) ผู้ช่วยออกกำลังกายที่บ้านสำหรับผู้ป่วยพาร์กินสัน
**PIZZA เป็นเพียงชื่อย่อ ไม่เกี่ยวกับอาหาร**

> สถานะ: ต้นแบบ (prototype) ภาพสาธิตทุกท่า **ยังไม่ผ่านการตรวจสอบโดยนักกายภาพบำบัด** ไม่ใช่ท่าฝึกที่ได้รับการรับรอง
> ไม่ใช่เครื่องมือวินิจฉัยหรือทดแทนนักกายภาพ

## รันเอง (ไม่ต้อง build)
`index.html` ไฟล์เดียว ไม่มี dependency เปิดตรง ๆ ได้ หรือรัน server: `npx serve .` หรือ `python3 -m http.server 8080`

## Deploy
- **Vercel:** push GitHub → Import project → Framework "Other" ไม่ต้องตั้ง build command
- **GitHub Pages:** Settings → Pages → Deploy from branch → root

## ฟีเจอร์ที่ทำงานแล้ว (ทดสอบด้วย Chromium headless)
Onboarding 3 ขั้น · หน้าแรก · คลังท่า (4 หมวด) · รายละเอียดท่า + Exercise Player · Session (เช็กความปลอดภัย, เวลา, นับครั้ง, หยุด/ทำต่อ/จบ, บันทึกตามสถานะจริง) · ความก้าวหน้า (กราฟ 7 วัน, ประวัติ) · ผู้ดูแล (ข้อมูลตัวอย่าง) · ศูนย์ความรู้ (ลิงก์ภายนอก) · ตั้งค่า (ขนาดตัวอักษร, เสียง, ลบข้อมูล) · โหมดมืด · รองรับ reduced motion

Animation 4 ท่า: ยกแขนสูง, นั่งยกแขนสลับข้าง, ลุก–นั่ง, หมุนลำตัวขณะนั่ง — SVG rig ควบคุมได้ (เล่น/หยุด/เล่นซ้ำ/0.5x–1x/ไทม์ไลน์/มุมหน้า-ข้าง/แสดงข้อต่อ/เส้นแนวมือ/คำบรรยายไทย)

## เพิ่มท่าใหม่
แก้ array `EX` ใน `index.html` (หา `const EX=`): เพิ่ม object ที่มี `id, name, cat, sup, dur, steps, warn, cap, kf`
`kf` = keyframes `[เวลาวินาที, {มุมข้อต่อ}]` ค่าแรกต้องเท่าค่าสุดท้ายเพื่อให้วนต่อเนื่อง
พารามิเตอร์: `shL shR` (ไหล่), `el` (ศอก), `lean` (โน้มตัว), `tw` (หมุนลำตัว), `h` (สะโพก งอ), `k` (เข่า งอ), `fold` (กอดอก) · `fwd:true` = แขนเคลื่อนไปข้างหน้า (ภาพหน้าแสดงแบบสั้นลง)
ตำแหน่งสะโพก/เท้าคำนวณจากข้อต่อให้เท้าติดพื้นอัตโนมัติ

## งานที่ยังไม่ได้ทำ
1. ย้ายเป็น React + TypeScript + Vite + Tailwind ตามโครงสร้างใน Master Prompt (ตอนนี้เป็น vanilla JS ไฟล์เดียว) แยก engine/data/UI
2. IndexedDB + Repository layer (ตอนนี้ใช้ localStorage ใน `save()` / `DB`)
3. Service worker + ไอคอน PWA (192/512)
4. Unit tests (Vitest) และชุดทดสอบ accessibility ด้วย screen reader จริง
5. ต่อ `camera-prototype/` (MediaPipe) เข้ากับหน้า Session
6. ตรวจสอบลิงก์ในศูนย์ความรู้ (ใส่ตามที่ผู้ใช้ให้มา ยังไม่ได้ตรวจเอง)
7. ให้นักกายภาพตรวจ: ท่า, มุม, ความเร็ว, ข้อควรระวัง, เงื่อนไขผู้ดูแล, ถ้อยคำทั้งหมด
8. ท่าเดิน/รำไทย/ไม้พลอง ยังไม่ได้สร้าง (ล็อกไว้ในคลัง)

## โฟลเดอร์
`index.html` แอปทั้งหมด · `camera-prototype/` โปรเจกต์ React+MediaPipe รุ่นแรก (ต้อง npm install แยก) · `SAFETY_GUIDELINES.md` · `docs/HANDOFF.md` · `docs/QA_PROMPT.md` (prompt ตรวจระบบ)

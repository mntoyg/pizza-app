// นักกายภาพแก้ไขท่าและเกณฑ์ที่ไฟล์นี้ (ต่อไปควรย้ายไปฐานข้อมูล)
export const MOVES = [
  { id: 'arm-raise', name: 'ยกแขนสูง', group: 'ท่ากว้าง', needsCarer: false,
    metric: 'shoulder-angle', targetAngle: 150, reps: 10,
    steps: ['นั่งหลังตรง เท้าวางพื้น', 'ยกแขนสองข้างเหนือศีรษะให้ใหญ่ที่สุด', 'ค้างนับ 1–2 แล้วลดลงช้า ๆ', 'ทำ 10 ครั้ง'],
    clipQuery: 'LSVT BIG exercises Parkinson seated big arm raise' },
  { id: 'sit-stand', name: 'ลุก–นั่งจากเก้าอี้', group: 'ลุก–นั่ง', needsCarer: true,
    metric: 'knee-angle', targetAngle: 160, reps: 5,
    steps: ['ใช้เก้าอี้มั่นคงไม่มีล้อ ชิดผนัง', 'โน้มตัวไปหน้า ดันเท้าลุกยืนเต็มที่', 'ยืนนิ่ง 1 วินาที แล้วนั่งลงช้า ๆ', 'ทำ 5 ครั้ง'],
    clipQuery: 'sit to stand exercise Parkinson disease physiotherapy' },
  { id: 'big-step', name: 'ก้าวยาว เดินเป็นจังหวะ', group: 'เดิน', needsCarer: true,
    metric: 'step-length', targetAngle: 0, reps: 10,
    steps: ['ยืนใกล้ราวหรือผู้ดูแล', 'ก้าวเท้าให้ยาว ส้นแตะพื้นก่อน', 'แกว่งแขนสวนกับขา', 'เดิน 10 ก้าว หยุดทันทีถ้าติดขัด'],
    clipQuery: 'Parkinson walking big steps exercise physiotherapy' },
]

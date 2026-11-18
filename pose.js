// มุมที่จุด b ระหว่างเส้น b→a และ b→c (องศา) จาก landmark {x,y}
export function angle(a, b, c) {
  const r = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x)
  const d = Math.abs((r * 180) / Math.PI)
  return d > 180 ? 360 - d : d
}
// MediaPipe landmark index: 11/12 ไหล่ L/R, 13/14 ศอก, 15/16 ข้อมือ, 23/24 สะโพก, 25/26 เข่า, 27/28 ข้อเท้า
export function armRaiseAngle(lm) {
  const l = angle(lm[23], lm[11], lm[15]), r = angle(lm[24], lm[12], lm[16])
  return { l, r, avg: (l + r) / 2, symmetry: 100 - Math.min(100, Math.abs(l - r)) }
}
// ตัวนับครั้ง: ผ่านเมื่อมุมถึงเป้าแล้วกลับลงต่ำกว่า 40 องศา เก็บมุมสูงสุดของแต่ละครั้ง
export function makeCounter(target) {
  let up = false, peak = 0, reps = 0
  const scores = []
  return (a) => {
    peak = Math.max(peak, a)
    if (!up && a >= target) up = true
    if (up && a < 40) { reps++; scores.push(Math.min(100, Math.round((peak / target) * 100))); up = false; peak = 0 }
    return { reps, scores: [...scores], peak }
  }
}

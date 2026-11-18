import { useRef, useState } from 'react'
import { usePose } from '../hooks/usePose.js'
import { armRaiseAngle, makeCounter } from '../lib/pose.js'
import { saveSession, speak } from '../lib/store.js'
export default function Practice({ move, go }) {
  const video = useRef(), counter = useRef(null), last = useRef(0)
  const [ok, setOk] = useState(!move?.needsCarer), [run, setRun] = useState(false)
  const [s, setS] = useState({ reps: 0, msg: 'พร้อมเริ่ม', angle: 0 })
  const status = usePose(video, lm => {
    // MVP รองรับเฉพาะท่ายกแขน; ท่าอื่นเพิ่มใน src/lib/pose.js ตาม move.metric
    const { avg } = armRaiseAngle(lm)
    counter.current ||= makeCounter(move.targetAngle)
    const r = counter.current(avg)
    const msg = avg < move.targetAngle - 20 ? 'ยกแขนสูงอีกนิด' : 'ดีมาก ค้างไว้'
    if (r.reps !== last.current) { last.current = r.reps; speak(`ครั้งที่ ${r.reps}`) }
    setS({ reps: r.reps, msg, angle: Math.round(avg) })
    if (r.reps >= move.reps) finish(r)
  }, run && !!move)
  if (!move) return <><p>เลือกท่าก่อน</p><button onClick={() => go('moves')}>เลือกท่า</button></>
  function finish(r) {
    const acc = r.scores.length ? Math.round(r.scores.reduce((a, b) => a + b) / r.scores.length) : 0
    saveSession({ moveId: move.id, reps: r.reps, accuracy: acc }); setRun(false); speak('เสร็จแล้ว เก่งมาก'); go('report')
  }
  if (!ok) return (<><h1>ก่อนเริ่ม</h1><div className="note">ท่านี้เสี่ยงล้ม ต้องมีผู้ดูแลอยู่ใกล้ตัว</div>
    <button className="full" onClick={() => setOk(true)}>มีผู้ดูแลอยู่ใกล้แล้ว</button></>)
  return (<>
    <h1>{move.name}</h1>
    <div className={'cam ' + (s.msg.startsWith('ดี') ? 'good' : '')}>
      <video ref={video} playsInline muted /><b>{status === 'loading' ? 'กำลังโหลดกล้อง…' : status === 'error' ? 'เปิดกล้องไม่ได้' : s.msg}</b></div>
    <div className="row"><div className="card grow c">ครั้งที่<br /><big>{s.reps}/{move.reps}</big></div><div className="card grow c">มุมแขน<br /><big>{s.angle}°</big></div></div>
    {!run ? <button className="full" onClick={() => setRun(true)}>เปิดกล้องและเริ่ม</button>
      : <button className="btn line full" onClick={() => setRun(false)}>หยุดพัก</button>}
    {/* TODO: ตรวจ freezing/เสียการทรงตัวแล้วหยุดท่าและแจ้งผู้ดูแล (ระยะหลัง) */}
  </>)
}

import { loadSessions } from '../lib/store.js'
import { MOVES } from '../data/moves.js'
export default function Report() {
  const all = loadSessions().slice(-10).reverse()
  return (<><h1>ผลการฝึก</h1><p className="sub">เก็บในเครื่องนี้เท่านั้น</p>
    {!all.length && <div className="card">ยังไม่มีข้อมูล ลองฝึกท่าแรกดู</div>}
    {all.map((s, i) => (<div className="card" key={i}><b>{MOVES.find(m => m.id === s.moveId)?.name}</b>
      <div className="sub">{new Date(s.at).toLocaleString('th-TH')} · {s.reps} ครั้ง</div>
      <div className="bar"><i style={{ width: s.accuracy + '%' }} /></div>ความถูกต้อง {s.accuracy}%</div>))}
    {/* TODO: ส่งสรุปตัวเลขให้นักกายภาพ/ญาติ (ต้องมี backend + ขอความยินยอม PDPA) */}</>)
}

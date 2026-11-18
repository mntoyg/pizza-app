import { MOVES } from '../data/moves.js'
import { loadSessions } from '../lib/store.js'
export default function Home({ go }) {
  const day = new Date().toISOString().slice(0, 10)
  const done = new Set(loadSessions().filter(s => s.at.slice(0, 10) === day).map(s => s.moveId)).size
  return (<>
    <h1>สวัสดี</h1><p className="sub">วันนี้ฝึกแล้ว {done} จาก {MOVES.length} ท่า</p>
    <div className="card"><div className="bar"><i style={{ width: `${(done / MOVES.length) * 100}%` }} /></div>
      <button className="full" onClick={() => go('moves')}>เริ่มฝึก</button></div>
    <div className="note">ท่าทรงตัวและเดินต้องมีผู้ดูแลอยู่ใกล้ทุกครั้ง</div>
  </>)
}

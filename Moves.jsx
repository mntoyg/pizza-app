import { MOVES } from '../data/moves.js'
const yt = q => 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q)
export default function Moves({ go, pick, move }) {
  if (!move) return (<>
    <h1>ท่าฝึก</h1><p className="sub">แตะท่าเพื่อดูตัวอย่างก่อนฝึก</p>
    {MOVES.map(m => (<div className="card" key={m.id}><b>{m.name}</b>
      <div><span className={'pill' + (m.needsCarer ? ' w' : '')}>{m.needsCarer ? 'ต้องมีผู้ดูแล' : m.group}</span></div>
      <button onClick={() => pick(m)}>ดูตัวอย่าง</button></div>))}</>)
  return (<>
    <button className="back" onClick={() => pick(null)}>‹ กลับ</button><h1>{move.name}</h1>
    <ol className="steps">{move.steps.map(s => <li key={s}>{s}</li>)}</ol>
    {/* TODO: ฝังคลิปสอนที่นักกายภาพอนุมัติ: <video src=... controls> แทนลิงก์ค้นหา */}
    <a className="btn line full" href={yt(move.clipQuery)} target="_blank" rel="noopener noreferrer">▶ ดูคลิปสอนบน YouTube</a>
    <a className="btn line full" href="https://www.chulapd.org/" target="_blank" rel="noopener noreferrer">ความรู้จากศูนย์พาร์กินสัน จุฬาฯ</a>
    {move.needsCarer && <div className="note">ท่านี้ต้องมีผู้ดูแลอยู่ใกล้ ก่อนเริ่มโปรดยืนยัน</div>}
    <button className="full" onClick={() => go('practice')}>เริ่มฝึกหน้ากล้อง</button>
  </>)
}

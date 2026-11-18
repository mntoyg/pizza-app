// ต้นแบบ: ยังไม่มีระบบอัปโหลด/เล่นวิดีโอ ต้องเพิ่มหลังบ้านและระบบตรวจเนื้อหา
const CLIPS = [{ t: 'รำไทยท่านั่ง ช่วงเช้า', by: 'คุณลุงสมชาย', sync: 86, checked: true }, { t: 'เดินตามบีตกับลูกสาว', by: 'ป้าวิไล', sync: null, checked: false }]
export default function Community() {
  return (<><h1>PIZZA Moves</h1><p className="sub">คลิปเต้นบำบัดจากชุมชน (ตัวอย่าง)</p>
    {CLIPS.map(c => (<div className="card" key={c.t}><b>{c.t}</b><div className="sub">{c.by}</div>
      {c.sync && <span className="pill">จังหวะตรง {c.sync}%</span>} <span className={'pill' + (c.checked ? '' : ' w')}>{c.checked ? 'นักกายภาพตรวจแล้ว' : 'รอตรวจ'}</span></div>))}
    <div className="note">ค่าเริ่มต้น "เห็นได้เฉพาะฉัน" และต้องได้รับความยินยอมตาม PDPA ก่อนแชร์</div></>)
}

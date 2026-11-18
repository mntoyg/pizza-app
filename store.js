// เก็บผลฝึกในเครื่อง (localStorage) ส่งเฉพาะตัวเลขสรุปไปหลังบ้านในอนาคต
const K = 'pizza.sessions'
export const loadSessions = () => { try { return JSON.parse(localStorage.getItem(K) || '[]') } catch { return [] } }
export function saveSession(s) { localStorage.setItem(K, JSON.stringify([...loadSessions(), { ...s, at: new Date().toISOString() }])) }
export const speak = (t) => { try { const u = new SpeechSynthesisUtterance(t); u.lang = 'th-TH'; speechSynthesis.cancel(); speechSynthesis.speak(u) } catch {} }

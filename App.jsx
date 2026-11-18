import { useState } from 'react'
import Home from './pages/Home.jsx'
import Moves from './pages/Moves.jsx'
import Practice from './pages/Practice.jsx'
import Report from './pages/Report.jsx'
import Community from './pages/Community.jsx'
const TABS = [['home', 'หน้าหลัก'], ['moves', 'ท่าฝึก'], ['community', 'ชุมชน'], ['report', 'ผลฝึก']]
export default function App() {
  const [page, go] = useState('home'), [move, pick] = useState(null)
  const nav = p => { go(p); window.scrollTo(0, 0) }
  const view = { home: <Home go={nav} />, moves: <Moves go={nav} pick={pick} move={move} />,
    practice: <Practice move={move} go={nav} />, report: <Report />, community: <Community /> }[page]
  return (<><main className="app">{view}</main>
    <nav className="nav">{TABS.map(([k, l]) => <button key={k} className={(page === k || (page === 'practice' && k === 'moves')) ? 'on' : ''} onClick={() => nav(k)}>{l}</button>)}</nav></>)
}

"use client";
import Link from "next/link";
const modules = [
  {id:"01", title:"Login + Role", path:"/login", icon:"🔐", desc:"Auth & roles"},
  {id:"02", title:"My HR Portal", path:"/portal", icon:"👤", desc:"Self service"},
  {id:"03", title:"Approval Queue", path:"/approvals", icon:"✅", desc:"Leave approvals"},
  {id:"04", title:"Employee Files", path:"/employees", icon:"📁", desc:"Master data"},
  {id:"05", title:"Leave Calendar", path:"/leave", icon:"📅", desc:"Calendar view"},
  {id:"06", title:"Payslips", path:"/payslips", icon:"🧾", desc:"Monthly slips"},
  {id:"07", title:"Staff Directory", path:"/directory", icon:"👥", desc:"Team contacts"},
  {id:"08", title:"Payroll Engine", path:"/payroll", icon:"💰", desc:"UGX 82M pool"},
  {id:"09", title:"Audit Log", path:"/audit", icon:"📊", desc:"Logs"},
  {id:"10", title:"Notifications", path:"/notifications", icon:"🔔", desc:"Alerts"},
  {id:"11", title:"Settings", path:"/settings", icon:"⚙️", desc:"System config"},
  {id:"12", title:"Reports", path:"/reports", icon:"📈", desc:"HR analytics"},
  {id:"13", title:"Attendance", path:"/attendance", icon:"⏱️", desc:"Clock in/out"},
  {id:"14", title:"Assets", path:"/assets", icon:"💻", desc:"Company assets"},
  {id:"15", title:"Recruitment", path:"/recruitment", icon:"🎯", desc:"Hiring"},
  {id:"16", title:"CEO Dashboard", path:"/ceo", icon:"👑", desc:"Executive view"},
];
export default function Home() {
  return (
    <div className="min-h-screen bg-[#f6f7f9] flex">
      <aside className="hidden md:flex w-64 bg-gray-900 text-white flex-col p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center font-bold">B</div>
          <div><p className="font-bold text-sm">BAIGAMATS</p><p className="text-xs text-gray-400">TECHNOLOGIES</p></div>
        </div>
        <nav className="space-y-1 flex-1">
          <Link href="/" className="flex gap-3 px-3 py-2.5 bg-white/10 rounded-xl text-sm font-medium">🏠 Dashboard</Link>
          <Link href="/directory" className="flex gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl text-sm text-gray-400">👥 Directory</Link>
          <Link href="/employees" className="flex gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl text-sm text-gray-400">📁 Employees</Link>
          <Link href="/attendance" className="flex gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl text-sm text-gray-400">⏱️ Attendance</Link>
          <Link href="/payroll" className="flex gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl text-sm text-gray-400">💰 Payroll</Link>
        </nav>
        <div className="bg-white/5 rounded-xl p-3 text-xs"><p className="text-gray-400">Payroll Pool</p><p className="font-bold text-white">UGX 82,986,600</p><p className="text-green-400 mt-1">● LIVE</p></div>
      </aside>
      <main className="flex-1 md:ml-64">
        <header className="bg-white border-b sticky top-0 z-10 px-6 md:px-8 py-4 flex justify-between items-center">
          <div><h1 className="text-2xl font-bold">All 16 Screens Operational ✓</h1><p className="text-sm text-gray-500">Pool: <b className="text-gray-900">UGX 82,986,600</b> • Click any card • Ready for team</p></div>
          <div className="flex items-center gap-3"><span className="hidden md:inline bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold">16 SCREENS • LIVE</span><Link href="/login" className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center">B</Link></div>
        </header>
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {modules.map(m => (
              <Link key={m.id} href={m.path} className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group">
                <div className="flex justify-between items-start mb-3"><span className="text-xs text-gray-400 font-mono">{m.id}</span><span className="text-xl group-hover:scale-110 transition">{m.icon}</span></div>
                <h3 className="font-bold text-gray-900">{m.title}</h3><p className="text-xs text-gray-500 mt-1">{m.desc}</p>
                <p className="text-xs text-emerald-600 font-medium mt-4">→ Open</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
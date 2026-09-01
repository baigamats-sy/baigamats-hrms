"use client"
import Link from "next/link"

export default function Home(){
  const screens = [
    {path:"/login", n:"01", t:"Login + Role"},
    {path:"/my-hr", n:"02", t:"My HR Portal"},
    {path:"/hr/requests", n:"03", t:"Approval Queue"},
    {path:"/employees", n:"04", t:"Employee Files"},
    {path:"/leave-calendar", n:"05", t:"Leave Calendar"},
    {path:"/payslips", n:"06", t:"Payslips"},
    {path:"/directory", n:"07", t:"Staff Directory"},
    {path:"/payroll", n:"08", t:"Payroll Engine"},
    {path:"/audit", n:"09", t:"Audit Log"},
    {path:"/notifications", n:"10", t:"Notifications"},
    {path:"/settings", n:"11", t:"Settings"},
    {path:"/reports", n:"12", t:"Reports"},
    {path:"/attendance", n:"13", t:"Attendance"},
    {path:"/assets", n:"14", t:"Assets"},
    {path:"/recruitment", n:"15", t:"Recruitment"},
    {path:"/dashboard", n:"16", t:"CEO Dashboard"},
  ];
  return (
    <div style={{minHeight:"100vh", background:"#F8FAFC", fontFamily:"system-ui"}}>
      <div style={{background:"#0F172A", color:"white", padding:"16px 32px", display:"flex", justifyContent:"space-between"}}>
        <b>BAIGAMATS TECHNOLOGIES</b><span style={{background:"#10B981", padding:"4px 12px", borderRadius:20, fontSize:12}}>16 SCREENS • LIVE</span>
      </div>
      <div style={{padding:32, maxWidth:1200, margin:"0 auto"}}>
        <h1 style={{fontSize:32, fontWeight:800}}>All 16 Screens Operational ✓</h1>
        <p style={{color:"#64748B", marginTop:8}}>Pool: <b style={{color:"black"}}>UGX 82,986,600</b> • Click any card</p>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16, marginTop:24}}>
          {screens.map(s=>(
            <Link key={s.path} href={s.path} style={{textDecoration:"none", color:"black", background:"white", border:"1px solid #E2E8F0", borderRadius:16, padding:20, display:"block"}}>
              <div style={{fontSize:12, color:"#94A3B8"}}>{s.n}</div>
              <div style={{fontWeight:700, marginTop:4}}>{s.t}</div>
              <div style={{marginTop:8, fontSize:12, color:"#10B981"}}>→ Open</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
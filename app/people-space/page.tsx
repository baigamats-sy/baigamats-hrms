"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
type Tab = 'workspace'|'leave'|'requests'|'approvals'|'recognition'|'disciplinary'|'org';
export default function PeopleSpace(){
  const [tab,setTab]=useState<Tab>('workspace');
  const [me,setMe]=useState<any>(null);
  const [employees,setEmployees]=useState<any[]>([]);
  const [myRequests,setMyRequests]=useState<any[]>([]);
  const [teamRequests,setTeamRequests]=useState<any[]>([]);
  const [leaves,setLeaves]=useState<any[]>([]);
  const [recognitions,setRecognitions]=useState<any[]>([]);
  const [disciplinary,setDisciplinary]=useState<any[]>([]);
  const [orgUnits,setOrgUnits]=useState<any[]>([]);
  const [isManager,setIsManager]=useState(false);
  const [fullName,setFullName]=useState('');
  const [logisticType,setLogisticType]=useState('Laptop');
  const [amount,setAmount]=useState('');
  const [leaveType,setLeaveType]=useState('Annual');
  const [leaveDays,setLeaveDays]=useState('');
  const [leaveReason,setLeaveReason]=useState('');
  useEffect(()=>{loadData()},[]);
  const getName=(e:any)=>e?.full_name||e?.name||e?.employee_name||'—';
  async function loadData(){
    const {data:{user}}=await supabase.auth.getUser();
    const {data:emps}=await supabase.from('employees').select('*');
    if(emps){
      setEmployees(emps);
      const myRec = user?.id? emps.find((e:any)=>e.auth_user_id===user.id) : null || emps[0];
      setMe(myRec);
      const managerRoles=['manager','line_manager','hr','admin','lead','head'];
      if(myRec && managerRoles.includes((myRec.role||'').toLowerCase())) setIsManager(true);
      if(myRec){
        const {data:reqs}=await supabase.from('employee_requests').select('*').eq('employee_id',myRec.id).order('created_at',{ascending:false});
        if(reqs) setMyRequests(reqs);
        const {data:lv}=await supabase.from('leave_requests').select('*').eq('employee_id',myRec.id).order('created_at',{ascending:false});
        if(lv) setLeaves(lv);
        const {data:rec}=await supabase.from('recognitions').select('*').eq('employee_id',myRec.id).order('created_at',{ascending:false});
        if(rec) setRecognitions(rec);
        const {data:dis}=await supabase.from('disciplinary_records').select('*').eq('employee_id',myRec.id).order('created_at',{ascending:false});
        if(dis) setDisciplinary(dis);
        const {data:allReq}=await supabase.from('employee_requests').select('*').eq('status','pending');
        const {data:allLeave}=await supabase.from('leave_requests').select('*').eq('status','pending');
        if(allReq||allLeave) setTeamRequests([...(allReq||[]),...(allLeave||[])]);
      }
    }
    const {data:orgs}=await supabase.from('org_units').select('*');
    if(orgs) setOrgUnits(orgs);
  }
  async function submitProfileChange(){
    if(!me||!fullName) return alert('Enter name');
    const {error}=await supabase.from('employee_requests').insert({employee_id:me.id,type:'profile_change',data:{new_name:fullName},status:'pending'});
    if(error) alert(error.message); else {alert('Sent for HR approval'); setFullName(''); loadData();}
  }
  async function submitLogistics(){
    if(!me) return;
    const {error}=await supabase.from('employee_requests').insert({employee_id:me.id,type:'logistics',data:{item:logisticType},status:'pending'});
    if(error) alert(error.message); else {alert('Requested '+logisticType); loadData(); setTab('requests');}
  }
  async function submitExpense(){
    if(!me||!amount) return alert('Amount?');
    const {error}=await supabase.from('employee_requests').insert({employee_id:me.id,type:'expense',data:{amount_ugx:amount},status:'pending'});
    if(error) alert(error.message); else {alert('Expense submitted'); setAmount(''); loadData(); setTab('requests');}
  }
  async function submitLeave(){
    if(!me||!leaveDays) return alert('Days?');
    const {error}=await supabase.from('leave_requests').insert({employee_id:me.id,type:leaveType,days:Number(leaveDays),reason:leaveReason,status:'pending'});
    if(error) alert('Create leave_requests table: '+error.message); else {alert('Leave applied'); setLeaveDays(''); setLeaveReason(''); loadData(); setTab('requests');}
  }
  async function approveReq(id:number, table:string){
    const {error}=await supabase.from(table).update({status:'approved'}).eq('id',id);
    if(error) alert(error.message); else {alert('Approved'); loadData();}
  }
  async function rejectReq(id:number, table:string){
    const {error}=await supabase.from(table).update({status:'rejected'}).eq('id',id);
    if(error) alert(error.message); else {alert('Rejected'); loadData();}
  }
  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <div className="w-[240px] bg-[#0B1220] text-white p-5 flex flex-col fixed h-full">
        <h1 className="text-lg font-bold mb-10">BaigaMats HRMS</h1>
        <p className="text-[10px] tracking-widest text-white/40 mb-3">MENU</p>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm mb-1">🏠 Dashboard</Link>
        <Link href="/employees" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm mb-1">👥 Human Resource</Link>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm">🧑‍💼 People Space</div>
      </div>
      <div className="flex-1 ml-[240px] p-8">
        <h1 className="text-[28px] font-bold">People Space</h1>
        <p className="text-sm text-gray-500 mb-6">{me?`${getName(me)} • ${me.role||me.department||'Staff'}`:'My Workspace'} • Employee Self-Service {isManager&&'• Line Manager'}</p>
        <div className="flex gap-5 border-b mb-6 overflow-x-auto">
          {[
            ['workspace','My Workspace'],['leave','Leave'],['requests',`My Requests (${myRequests.length+leaves.length})`],
          ...(isManager?[['approvals',`My Approvals (${teamRequests.length})`] as any]:[]),
            ['recognition','Recognition'],['disciplinary','Files & Disciplinary'],['org','Org Structure']
          ].map(([k,l]:any)=>(
            <button key={k} onClick={()=>setTab(k)} className={`pb-3 whitespace-nowrap text-sm font-medium border-b-2 ${tab===k?'border-black text-black':'border-transparent text-gray-500'}`}>{l}</button>
          ))}
        </div>
        {tab==='workspace' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border shadow-sm"><h3 className="font-semibold mb-1">My Profile</h3><p className="text-xs text-gray-500 mb-3">Current: {getName(me)}</p><input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="New full name" className="w-full border rounded-lg px-3 py-2 text-sm mb-3"/><button onClick={submitProfileChange} className="w-full bg-black text-white rounded-lg py-2.5 text-sm">Request Change - HR Approval</button></div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm"><h3 className="font-semibold mb-3">Logistics</h3><select value={logisticType} onChange={e=>setLogisticType(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mb-3"><option>Laptop</option><option>Internet / Data</option><option>Transport</option><option>Office Chair</option><option>Other</option></select><button onClick={submitLogistics} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm">Request Item</button></div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm"><h3 className="font-semibold mb-3">Expense / Advance</h3><input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount UGX" type="number" className="w-full border rounded-lg px-3 py-2 text-sm mb-3"/><button onClick={submitExpense} className="w-full bg-green-600 text-white rounded-lg py-2.5 text-sm">Submit Request</button></div>
          </div>
        )}
        {tab==='leave' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border"><h3 className="font-semibold mb-3">Apply Leave</h3><select value={leaveType} onChange={e=>setLeaveType(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mb-3"><option>Annual</option><option>Sick</option><option>Maternity</option><option>Paternity</option><option>Unpaid</option></select><input value={leaveDays} onChange={e=>setLeaveDays(e.target.value)} placeholder="Days (e.g. 3)" type="number" className="w-full border rounded-lg px-3 py-2 text-sm mb-3"/><textarea value={leaveReason} onChange={e=>setLeaveReason(e.target.value)} placeholder="Reason" className="w-full border rounded-lg px-3 py-2 text-sm mb-3"/><button onClick={submitLeave} className="w-full bg-black text-white rounded-lg py-2.5 text-sm">Submit Leave</button></div>
            <div className="md:col-span-2 bg-white rounded-2xl border overflow-hidden"><div className="p-4 border-b font-semibold text-sm">My Leave History</div><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Date</th><th className="p-3">Type</th><th className="p-3">Days</th><th className="p-3">Status</th></tr></thead><tbody>{leaves.map((l:any)=><tr key={l.id} className="border-t"><td className="p-3 text-xs text-gray-500">{new Date(l.created_at).toLocaleDateString()}</td><td className="p-3">{l.type}</td><td className="p-3">{l.days}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${l.status==='pending'?'bg-yellow-100 text-yellow-800':l.status==='approved'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{l.status}</span></td></tr>)}</tbody></table>{leaves.length===0&&<p className="p-6 text-center text-gray-400 text-sm">No leave yet</p>}</div>
          </div>
        )}
        {tab==='requests' && (
          <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-4 border-b font-semibold text-sm">All My Requests</div><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Date</th><th className="p-3">Type</th><th className="p-3">Details</th><th className="p-3">Status</th></tr></thead><tbody>{[...myRequests.map(r=>({...r,table:'employee_requests'})),...leaves.map(l=>({...l,table:'leave_requests',data:l.reason}))].sort((a:any,b:any)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime()).map((r:any)=><tr key={r.table+r.id} className="border-t"><td className="p-3 text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td><td className="p-3">{r.type}</td><td className="p-3 text-gray-600 truncate max-w-[200px]">{JSON.stringify(r.data||r.reason||r.days||'')}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${r.status==='pending'?'bg-yellow-100 text-yellow-800':r.status==='approved'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{r.status}</span></td></tr>)}</tbody></table></div>
        )}
        {tab==='approvals' && (
          <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-4 border-b flex justify-between"><h3 className="font-semibold text-sm">Team Approvals - Line Manager View</h3><span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{teamRequests.length} pending</span></div><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Employee</th><th className="p-3">Type</th><th className="p-3">Details</th><th className="p-3">Actions</th></tr></thead><tbody>{teamRequests.map((r:any)=><tr key={r.id} className="border-t"><td className="p-3">Staff #{r.employee_id?.slice(0,6)}</td><td className="p-3">{r.type}</td><td className="p-3 text-gray-600">{JSON.stringify(r.data||r.reason||'').slice(0,60)}</td><td className="p-3 flex gap-2"><button onClick={()=>approveReq(r.id, r.days!==undefined?'leave_requests':'employee_requests')} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Approve</button><button onClick={()=>rejectReq(r.id, r.days!==undefined?'leave_requests':'employee_requests')} className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs">Reject</button></td></tr>)}</tbody></table>{teamRequests.length===0&&<p className="p-6 text-center text-gray-400 text-sm">No pending team approvals</p>}</div>
        )}
        {tab==='recognition' && (
          <div className="grid md:grid-cols-3 gap-4">{recognitions.length>0?recognitions.map((rec:any)=><div key={rec.id} className="bg-white p-5 rounded-2xl border"><p className="text-2xl mb-2">🏆</p><p className="font-semibold text-sm">{rec.title||'Kudos'}</p><p className="text-xs text-gray-500 mt-1">{rec.description||rec.reason}</p><p className="text-[10px] text-gray-400 mt-3">{new Date(rec.created_at).toLocaleDateString()}</p></div>):<div className="col-span-3 bg-white p-12 rounded-2xl border text-center"><p className="text-4xl mb-3">🌟</p><p className="font-semibold">No recognitions yet</p><p className="text-xs text-gray-500 mt-1">HR can add Employee of Month, Kudos, Awards here</p></div>}</div>
        )}
        {tab==='disciplinary' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-4 border-b font-semibold text-sm">My Files (Contracts, Payslips)</div><div className="p-6 text-sm text-gray-500">📄 Employment Contract.pdf • Added by HR<br/>📄 NDA.pdf<br/>📄 Payslip Jan 2026<br/><span className="text-xs text-gray-400 mt-3 block">HR uploads files to storage and links to your ID</span></div></div>
            <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-4 border-b font-semibold text-sm flex justify-between">Disciplinary Records <span className="text-xs font-normal text-gray-500">{disciplinary.length} records</span></div>{disciplinary.length>0?disciplinary.map((d:any)=><div key={d.id} className="p-4 border-t"><p className="font-medium text-sm text-red-700">{d.type||'Warning'}</p><p className="text-xs text-gray-600 mt-1">{d.description}</p><p className="text-[10px] text-gray-400 mt-2">{new Date(d.created_at).toLocaleDateString()} • by {d.issued_by||'HR'}</p></div>):<p className="p-8 text-center text-sm text-green-600">✅ Clean record - No disciplinary issues</p>}</div>
          </div>
        )}
        {tab==='org' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{orgUnits.length>0?orgUnits.map((u:any)=><div key={u.id} className="bg-white p-4 rounded-2xl border"><p className="font-semibold text-sm">{u.name}</p><p className="text-xs text-gray-500 mt-1">{employees.filter(e=>e.org_unit_id===u.id).length} members</p></div>):<div className="col-span-4 bg-white p-6 rounded-2xl border"><div className="flex flex-wrap gap-2">{[...new Set(employees.map(e=>e.department).filter(Boolean))].map((d:any)=><span key={d} className="px-3 py-1 bg-gray-100 rounded-full text-xs">{d}: {employees.filter(e=>e.department===d).length}</span>)}</div></div>}</div>
        )}
      </div>
    </div>
  );
}
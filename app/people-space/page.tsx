"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const LEAVE_CONFIG:any = { Annual: 21, Sick: 14, Maternity: 60, Paternity: 7, Unpaid: 365, Study: 15, Compassionate: 5 };

type Tab = 'workspace'|'leave'|'requests'|'approvals'|'recognition'|'disciplinary'|'org';

function calcWorkingDays(startStr:string, endStr:string){
  if(!startStr||!endStr) return 0;
  const start=new Date(startStr); const end=new Date(endStr);
  if(end < start) return 0;
  let count=0; let cur=new Date(start);
  while(cur <= end){ const day=cur.getDay(); if(day!==0 && day!==6) count++; cur.setDate(cur.getDate()+1); }
  return count;
}
function addReturnDate(endStr:string){
  if(!endStr) return '-';
  const d=new Date(endStr); d.setDate(d.getDate()+1);
  // skip weekend for return
  if(d.getDay()===0) d.setDate(d.getDate()+1);
  if(d.getDay()===6) d.setDate(d.getDate()+2);
  return d.toLocaleDateString('en-GB',{weekday:'short', day:'2-digit', month:'short', year:'numeric'});
}

export default function PeopleSpace(){
  const [tab,setTab]=useState<Tab>('leave');
  const [me,setMe]=useState<any>(null);
  const [employees,setEmployees]=useState<any[]>([]);
  const [myRequests,setMyRequests]=useState<any[]>([]);
  const [teamRequests,setTeamRequests]=useState<any[]>([]);
  const [leaves,setLeaves]=useState<any[]>([]);
  const [recognitions,setRecognitions]=useState<any[]>([]);
  const [disciplinary,setDisciplinary]=useState<any[]>([]);
  const [isManager,setIsManager]=useState(false);
  const [fullName,setFullName]=useState('');
  const [logisticType,setLogisticType]=useState('Laptop');
  const [amount,setAmount]=useState('');
  // Leave states
  const [leaveType,setLeaveType]=useState('Annual');
  const [startDate,setStartDate]=useState('');
  const [endDate,setEndDate]=useState('');
  const [leaveReason,setLeaveReason]=useState('');
  const [coveringPerson,setCoveringPerson]=useState('');
  const [handoverFile,setHandoverFile]=useState<File|null>(null);
  const [uploading,setUploading]=useState(false);

  const totalDays = calcWorkingDays(startDate,endDate);
  const maxDays = LEAVE_CONFIG[leaveType]||21;
  const returnDate = addReturnDate(endDate);
  const usedDays = leaves.filter(l=>l.type===leaveType && l.status==='approved').reduce((a,b)=>a+(b.days||0),0);
  const balance = maxDays - usedDays;

  useEffect(()=>{loadData()},[]);
  const getName=(e:any)=>e?.full_name||e?.name||e?.employee_name||'—';

  async function loadData(){
    const {data:{user}}=await supabase.auth.getUser();
    const {data:emps}=await supabase.from('employees').select('*');
    if(emps){
      setEmployees(emps);
      let myRec:any = emps[0];
      if(user?.id){ const found = emps.find((e:any)=>e.auth_user_id===user.id); if(found) myRec=found; }
      setMe(myRec);
      if(myRec && ['manager','line_manager','hr','admin','lead','head'].includes((myRec.role||'').toLowerCase())) setIsManager(true);
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
  }

  async function submitLeave(){
    if(!me) return;
    if(!startDate ||!endDate) return alert('Select Start and End Date');
    if(totalDays===0) return alert('End date must be after start date');
    if(totalDays > maxDays) return alert(`You requested ${totalDays} days but ${leaveType} max is ${maxDays} days`);
    if(totalDays > balance) return alert(`Insufficient balance. You have ${balance} days left for ${leaveType}`);
    if(!coveringPerson) return alert('Select person covering your seat');
    if(!handoverFile) return alert('Attach Handover Report');

    setUploading(true);
    let handoverUrl = '';
    try{
      if(handoverFile){
        const fileName = `${me.id}_${Date.now()}_${handoverFile.name}`;
        const {data, error} = await supabase.storage.from('handover-reports').upload(fileName, handoverFile);
        if(error){ // bucket may not exist, try without bucket
          console.log('Upload error', error);
        } else {
          const {data: pub}= supabase.storage.from('handover-reports').getPublicUrl(fileName);
          handoverUrl = pub.publicUrl;
        }
      }
      const {error}=await supabase.from('leave_requests').insert({
        employee_id: me.id,
        type: leaveType,
        days: totalDays,
        start_date: startDate,
        end_date: endDate,
        return_date: new Date(endDate).toISOString(),
        reason: leaveReason,
        covering_person_id: coveringPerson,
        handover_url: handoverUrl,
        handover_filename: handoverFile?.name || '',
        status: 'pending'
      });
      if(error) throw error;
      alert(`Leave Applied! Total: ${totalDays} days. Return: ${returnDate}. Sent to Line Manager & HR.`);
      setStartDate(''); setEndDate(''); setLeaveReason(''); setCoveringPerson(''); setHandoverFile(null);
      loadData();
    }catch(e:any){ alert('Error: '+e.message); }
    finally{ setUploading(false); }
  }

  async function submitProfileChange(){
    if(!me||!fullName) return alert('Enter name');
    const {error}=await supabase.from('employee_requests').insert({employee_id:me.id,type:'profile_change',data:{new_name:fullName},status:'pending'});
    if(error) alert(error.message); else {alert('Sent for HR approval'); setFullName(''); loadData();}
  }
  async function submitLogistics(){
    const {error}=await supabase.from('employee_requests').insert({employee_id:me.id,type:'logistics',data:{item:logisticType},status:'pending'});
    if(error) alert(error.message); else {alert('Requested '+logisticType); loadData();}
  }
  async function submitExpense(){
    if(!amount) return alert('Amount?');
    const {error}=await supabase.from('employee_requests').insert({employee_id:me.id,type:'expense',data:{amount_ugx:amount},status:'pending'});
    if(error) alert(error.message); else {alert('Expense submitted'); setAmount(''); loadData();}
  }
  async function approveReq(id:number, table:string){
    await supabase.from(table).update({status:'approved'}).eq('id',id); loadData();
  }
  async function rejectReq(id:number, table:string){
    await supabase.from(table).update({status:'rejected'}).eq('id',id); loadData();
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <div className="w-[240px] bg-[#0B1220] text-white p-5 flex flex-col fixed h-full">
        <h1 className="text-lg font-bold mb-10">BaigaMats HRMS</h1>
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm mb-1">🏠 Dashboard</Link>
        <Link href="/employees" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm mb-1">👥 Human Resource</Link>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm">🧑‍💼 People Space</div>
      </div>
      <div className="flex-1 ml-[240px] p-8">
        <h1 className="text-[28px] font-bold">People Space</h1>
        <p className="text-sm text-gray-500 mb-6">{me?`${getName(me)} • ${me.role||'Staff'}`:''} • Employee Self-Service {isManager&&'• Line Manager'}</p>

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
            <div className="bg-white p-5 rounded-2xl border"><h3 className="font-semibold mb-1">My Profile</h3><p className="text-xs text-gray-500 mb-3">Current: {getName(me)}</p><input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="New full name" className="w-full border rounded-lg px-3 py-2 text-sm mb-3"/><button onClick={submitProfileChange} className="w-full bg-black text-white rounded-lg py-2.5 text-sm">Request Change</button></div>
            <div className="bg-white p-5 rounded-2xl border"><h3 className="font-semibold mb-3">Logistics</h3><select value={logisticType} onChange={e=>setLogisticType(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mb-3"><option>Laptop</option><option>Internet / Data</option><option>Transport</option><option>Office Chair</option><option>Other</option></select><button onClick={submitLogistics} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm">Request Item</button></div>
            <div className="bg-white p-5 rounded-2xl border"><h3 className="font-semibold mb-3">Expense</h3><input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount UGX" type="number" className="w-full border rounded-lg px-3 py-2 text-sm mb-3"/><button onClick={submitExpense} className="w-full bg-green-600 text-white rounded-lg py-2.5 text-sm">Submit</button></div>
          </div>
        )}

        {tab==='leave' && (
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-5 bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="font-semibold mb-1">Apply Leave</h3>
              <p className="text-xs text-gray-500 mb-4">Balance: {balance} days left for {leaveType} • Max {maxDays} days</p>

              <label className="text-xs font-medium">Leave Type</label>
              <select value={leaveType} onChange={e=>setLeaveType(e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm mb-3 mt-1">
                {Object.keys(LEAVE_CONFIG).map(t=><option key={t} value={t}>{t} ({LEAVE_CONFIG[t]} days)</option>)}
              </select>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div><label className="text-xs font-medium">Start Date</label><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm mt-1"/></div>
                <div><label className="text-xs font-medium">End Date</label><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm mt-1"/></div>
              </div>

              {totalDays>0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-3 text-sm">
                  <div className="flex justify-between"><span>Total Days:</span><b>{totalDays} working days</b></div>
                  <div className="flex justify-between mt-1"><span>Return Date:</span><b>{returnDate}</b></div>
                  {totalDays > maxDays && <p className="text-red-600 text-xs mt-2">⚠️ Exceeds max {maxDays} days for {leaveType}</p>}
                  {totalDays > balance && <p className="text-red-600 text-xs mt-1">⚠️ Insufficient balance ({balance} left)</p>}
                </div>
              )}

              <label className="text-xs font-medium">Who will cover your seat? *</label>
              <select value={coveringPerson} onChange={e=>setCoveringPerson(e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm mb-3 mt-1">
                <option value="">Select Staff</option>
                {employees.map((emp:any)=><option key={emp.id} value={emp.id}>{getName(emp)} - {emp.department||emp.role}</option>)}
              </select>

              <label className="text-xs font-medium">Attach Handover Report *</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={e=>setHandoverFile(e.target.files?.[0]||null)} className="w-full border rounded-lg px-3 py-2 text-sm mb-3 mt-1 file:mr-3 file:bg-black file:text-white file:px-3 file:py-1 file:rounded-full file:border-0"/>
              {handoverFile && <p className="text-xs text-green-600 mb-3">📎 {handoverFile.name}</p>}

              <label className="text-xs font-medium">Reason</label>
              <textarea value={leaveReason} onChange={e=>setLeaveReason(e.target.value)} placeholder="Handover details, tasks completed..." className="w-full border rounded-lg px-3 py-2.5 text-sm mb-4 mt-1 h-20"/>

              <button disabled={uploading || totalDays>maxDays || totalDays>balance} onClick={submitLeave} className="w-full bg-black text-white rounded-lg py-3 text-sm font-semibold disabled:bg-gray-300">{uploading?'Uploading...':'Submit Leave Request'}</button>
            </div>

            <div className="md:col-span-7 bg-white rounded-2xl border overflow-hidden">
              <div className="p-4 border-b flex justify-between"><h3 className="font-semibold text-sm">My Leave History</h3><span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{leaves.length} requests</span></div>
              <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Date</th><th className="p-3">Type</th><th className="p-3">Days</th><th className="p-3">Return</th><th className="p-3">Cover</th><th className="p-3">Status</th></tr></thead><tbody>{leaves.map((l:any)=><tr key={l.id} className="border-t"><td className="p-3 text-xs">{l.start_date? new Date(l.start_date).toLocaleDateString() : new Date(l.created_at).toLocaleDateString()}</td><td className="p-3">{l.type}</td><td className="p-3 text-center">{l.days}</td><td className="p-3 text-xs">{l.end_date? new Date(new Date(l.end_date).getTime()+86400000).toLocaleDateString() : '-'}</td><td className="p-3 text-xs">{employees.find((e:any)=>e.id===l.covering_person_id)? getName(employees.find((e:any)=>e.id===l.covering_person_id)) : l.covering_person_id?.slice(0,6)||'-'}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${l.status==='pending'?'bg-yellow-100 text-yellow-800':l.status==='approved'?'bg-green-100 text-green-800':'bg-red-100'}`}>{l.status}</span></td></tr>)}</tbody></table>
              {leaves.length===0&&<p className="p-12 text-center text-gray-400 text-sm">No leave yet — apply on left</p>}
            </div>
          </div>
        )}

        {tab==='requests' && (
          <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-4 border-b font-semibold text-sm">All My Requests</div><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Date</th><th className="p-3">Type</th><th className="p-3">Details</th><th className="p-3">Status</th></tr></thead><tbody>{[...myRequests,...leaves].sort((a:any,b:any)=>new Date(b.created_at).getTime()-new Date(a.created_at).getTime()).map((r:any)=><tr key={r.id} className="border-t"><td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td><td className="p-3">{r.type}</td><td className="p-3 text-xs text-gray-600">{r.days? `${r.days} days, ${r.reason||''}`: JSON.stringify(r.data||'').slice(0,80)}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${r.status==='pending'?'bg-yellow-100':r.status==='approved'?'bg-green-100':'bg-red-100'}`}>{r.status}</span></td></tr>)}</tbody></table></div>
        )}
        {tab==='approvals' && (
          <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-4 border-b flex justify-between"><h3 className="font-semibold text-sm">Team Approvals - Line Manager</h3><span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{teamRequests.length} pending</span></div><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Employee</th><th className="p-3">Type</th><th className="p-3">Details</th><th className="p-3">Handover</th><th className="p-3">Actions</th></tr></thead><tbody>{teamRequests.map((r:any)=><tr key={r.id} className="border-t"><td className="p-3 text-xs">{r.employee_id?.slice(0,8)}</td><td className="p-3">{r.type}</td><td className="p-3 text-xs">{r.days?`${r.days} days • ${r.start_date||''} to ${r.end_date||''} • Cover: ${r.covering_person_id?.slice(0,6)}`: JSON.stringify(r.data||'').slice(0,50)}</td><td className="p-3 text-xs">{r.handover_filename? `📎 ${r.handover_filename}`: '-'}</td><td className="p-3 flex gap-2"><button onClick={()=>approveReq(r.id, r.days!==undefined?'leave_requests':'employee_requests')} className="bg-green-600 text-white px-3 py-1 rounded text-xs">Approve</button><button onClick={()=>rejectReq(r.id, r.days!==undefined?'leave_requests':'employee_requests')} className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs">Reject</button></td></tr>)}</tbody></table>{teamRequests.length===0&&<p className="p-6 text-center text-gray-400 text-sm">No pending approvals</p>}</div>
        )}
        {tab==='recognition' && <div className="bg-white p-12 rounded-2xl border text-center"><p className="text-4xl mb-3">🌟</p><p className="font-semibold">No recognitions yet</p></div>}
        {tab==='disciplinary' && <div className="bg-white p-8 rounded-2xl border text-center text-sm text-green-600">✅ Clean record</div>}
        {tab==='org' && <div className="bg-white p-6 rounded-2xl border"><div className="flex flex-wrap gap-2">{[...new Set(employees.map((e:any)=>e.department).filter(Boolean))].map((d:any)=><span key={d} className="px-3 py-1 bg-gray-100 rounded-full text-xs">{String(d)}</span>)}</div></div>}
      </div>
    </div>
  );
}
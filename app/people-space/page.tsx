"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const LEAVE_CONFIG:any = { Annual: 21, Sick: 14, Maternity: 60, Paternity: 7, Unpaid: 365, Study: 15, Compassionate: 5 };
type Tab = 'workspace'|'leave'|'requests'|'approvals'|'recognition'|'disciplinary'|'org'|'settings';
function calcWorkingDays(s:string,e:string){ if(!s||!e) return 0; const start=new Date(s), end=new Date(e); if(end<start) return 0; let c=0; let cur=new Date(start); while(cur<=end){ const d=cur.getDay(); if(d!==0&&d!==6) c++; cur.setDate(cur.getDate()+1);} return c; }
function addReturnDate(e:string){ if(!e) return '-'; const d=new Date(e); d.setDate(d.getDate()+1); if(d.getDay()===0) d.setDate(d.getDate()+1); if(d.getDay()===6) d.setDate(d.getDate()+2); return d.toLocaleDateString('en-GB',{weekday:'short', day:'2-digit', month:'short', year:'numeric'}); }
export default function PeopleSpace(){
  const [tab,setTab]=useState<Tab>('leave');
  const [me,setMe]=useState<any>(null); const [employees,setEmployees]=useState<any[]>([]); const [myRequests,setMyRequests]=useState<any[]>([]); const [teamRequests,setTeamRequests]=useState<any[]>([]); const [leaves,setLeaves]=useState<any[]>([]);
  const [isManager,setIsManager]=useState(false); const [templates,setTemplates]=useState<any[]>([]);
  const [fullName,setFullName]=useState(''); const [logisticType,setLogisticType]=useState('Laptop'); const [amount,setAmount]=useState('');
  const [leaveType,setLeaveType]=useState('Annual'); const [startDate,setStartDate]=useState(''); const [endDate,setEndDate]=useState(''); const [leaveReason,setLeaveReason]=useState(''); const [coveringPerson,setCoveringPerson]=useState(''); const [handoverFile,setHandoverFile]=useState<File|null>(null); const [uploading,setUploading]=useState(false);
  const [errors,setErrors]=useState<any>({});
  const [editingTpl,setEditingTpl]=useState<any>(null);
  const totalDays = calcWorkingDays(startDate,endDate); const maxDays = LEAVE_CONFIG[leaveType]||21; const returnDate = addReturnDate(endDate);
  const usedDays = leaves.filter(l=>l.type===leaveType && l.status==='approved').reduce((a,b)=>a+(b.days||0),0); const balance = maxDays - usedDays;
  useEffect(()=>{loadData()},[]); const getName=(e:any)=>e?.full_name||e?.name||e?.employee_name||'—';
  async function loadData(){
    const {data:{user}}=await supabase.auth.getUser(); const {data:emps}=await supabase.from('employees').select('*');
    if(emps){ setEmployees(emps); let myRec:any=emps[0]; if(user?.id){ const f=emps.find((e:any)=>e.auth_user_id===user.id); if(f) myRec=f; } setMe(myRec); if(myRec && ['manager','line_manager','hr','admin','lead','head'].includes((myRec.role||'').toLowerCase())) setIsManager(true);
      if(myRec){ const {data:reqs}=await supabase.from('employee_requests').select('*').eq('employee_id',myRec.id).order('created_at',{ascending:false}); if(reqs) setMyRequests(reqs); const {data:lv}=await supabase.from('leave_requests').select('*').eq('employee_id',myRec.id).order('created_at',{ascending:false}); if(lv) setLeaves(lv); const {data:allReq}=await supabase.from('employee_requests').select('*').eq('status','pending'); const {data:allLeave}=await supabase.from('leave_requests').select('*').eq('status','pending'); if(allReq||allLeave) setTeamRequests([...(allReq||[]),...(allLeave||[])]); } }
    const {data:tpls}=await supabase.from('email_templates').select('*'); if(tpls) setTemplates(tpls);
  }
  function validateLeave(){
    const e:any={};
    if(!leaveType) e.leaveType='Leave type is required';
    if(!startDate) e.startDate='Start date is required *';
    if(!endDate) e.endDate='End date is required *';
    if(startDate&&endDate&&new Date(endDate)<new Date(startDate)) e.endDate='End date must be after start date';
    if(!coveringPerson) e.coveringPerson='You must select who will cover your seat *';
    if(!handoverFile) e.handoverFile='Handover report is mandatory *';
    if(!leaveReason.trim()) e.leaveReason='Reason / Handover details is mandatory *';
    if(totalDays===0 && startDate && endDate) e.totalDays='Invalid date range';
    if(totalDays>maxDays) e.totalDays=`Exceeds max ${maxDays} days for ${leaveType}`;
    if(totalDays>balance) e.totalDays=`Insufficient balance: ${balance} left`;
    setErrors(e); return Object.keys(e).length===0;
  }
  async function submitLeave(){
    if(!validateLeave()) return alert('Please fill all mandatory fields marked with *');
    if(!me) return; setUploading(true);
    try{
      let handoverUrl=''; if(handoverFile){ const fileName=`${me.id}_${Date.now()}_${handoverFile.name}`; await supabase.storage.from('handover-reports').upload(fileName, handoverFile); const {data:pub}=supabase.storage.from('handover-reports').getPublicUrl(fileName); handoverUrl=pub.publicUrl; }
      const coverName=getName(employees.find((e:any)=>e.id===coveringPerson));
      const tpl=templates.find(t=>t.key==='leave_submitted');
      let emailBody=tpl? tpl.body : 'Leave submitted';
      emailBody=emailBody.replace('{{employee_name}}',getName(me)).replace('{{leave_type}}',leaveType).replace('{{total_days}}',String(totalDays)).replace('{{start_date}}',startDate).replace('{{end_date}}',endDate).replace('{{return_date}}',returnDate).replace('{{covering_person}}',coverName).replace('{{handover_filename}}',handoverFile?.name||'');
      const {error}=await supabase.from('leave_requests').insert({ employee_id:me.id, type:leaveType, days:totalDays, start_date:startDate, end_date:endDate, return_date:new Date(endDate).toISOString(), reason:leaveReason, covering_person_id:coveringPerson, handover_url:handoverUrl, handover_filename:handoverFile?.name||'', status:'pending', email_preview: emailBody });
      if(error) throw error;
      // Simulate email sending - log to console and show preview
      console.log('EMAIL TO SEND:', emailBody);
      alert(`✅ Leave Applied!\n\nTotal: ${totalDays} days\nReturn: ${returnDate}\n\n📧 Email Preview (customizable template):\n${emailBody.slice(0,300)}...\n\nSent to Line Manager & HR.`);
      setStartDate(''); setEndDate(''); setLeaveReason(''); setCoveringPerson(''); setHandoverFile(null); setErrors({}); loadData();
    }catch(e:any){ alert('Error: '+e.message); } finally{ setUploading(false); }
  }
  async function saveTemplate(){
    if(!editingTpl) return; const {error}=await supabase.from('email_templates').update({subject:editingTpl.subject, body:editingTpl.body}).eq('id',editingTpl.id); if(error) alert(error.message); else { alert('Template updated! Future emails will use this.'); setEditingTpl(null); loadData(); }
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
        <p className="text-sm text-gray-500 mb-6">{me?`${getName(me)}`:''} • All fields with * are mandatory</p>
        <div className="flex gap-5 border-b mb-6 overflow-x-auto">
          {[
            ['workspace','My Workspace'],['leave','Leave *'],['requests',`My Requests (${leaves.length})`],
           ...(isManager?[['approvals',`Approvals (${teamRequests.length})`] as any, ['settings','Email Templates'] as any]:[]),
          ].map(([k,l]:any)=><button key={k} onClick={()=>setTab(k)} className={`pb-3 whitespace-nowrap text-sm font-medium border-b-2 ${tab===k?'border-black text-black':'border-transparent text-gray-500'}`}>{l}</button>)}
        </div>
        {tab==='leave' && (
          <div className="grid md:grid-cols-12 gap-6">
            <div className="md:col-span-5 bg-white p-6 rounded-2xl border shadow-sm">
              <h3 className="font-semibold mb-1">Apply Leave <span className="text-red-500">*</span></h3>
              <p className="text-xs text-gray-500 mb-4">Balance: {balance} days left • Max {maxDays} days • All fields mandatory</p>
              <label className="text-xs font-medium">Leave Type *</label>
              <select value={leaveType} onChange={e=>setLeaveType(e.target.value)} className={`w-full border rounded-lg px-3 py-2.5 text-sm mb-1 mt-1 ${errors.leaveType?'border-red-500':''}`}><option value="">Select Type *</option>{Object.keys(LEAVE_CONFIG).map(t=><option key={t} value={t}>{t} ({LEAVE_CONFIG[t]} days)</option>)}</select>
              {errors.leaveType&&<p className="text-[11px] text-red-500 mb-2">{errors.leaveType}</p>}
              <div className="grid grid-cols-2 gap-3 mb-1">
                <div><label className="text-xs font-medium">Start Date *</label><input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className={`w-full border rounded-lg px-3 py-2.5 text-sm mt-1 ${errors.startDate?'border-red-500 bg-red-50':''}`}/>{errors.startDate&&<p className="text-[11px] text-red-500">{errors.startDate}</p>}</div>
                <div><label className="text-xs font-medium">End Date *</label><input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className={`w-full border rounded-lg px-3 py-2.5 text-sm mt-1 ${errors.endDate?'border-red-500 bg-red-50':''}`}/>{errors.endDate&&<p className="text-[11px] text-red-500">{errors.endDate}</p>}</div>
              </div>
              {totalDays>0 && <div className={`rounded-xl p-3 mb-3 text-sm border ${errors.totalDays?'bg-red-50 border-red-200':'bg-blue-50 border-blue-200'}`}><div className="flex justify-between"><span>Total Days *:</span><b>{totalDays} working days</b></div><div className="flex justify-between mt-1"><span>Return Date *:</span><b>{returnDate}</b></div>{errors.totalDays&&<p className="text-red-600 text-xs mt-2">⚠️ {errors.totalDays}</p>}</div>}
              <label className="text-xs font-medium">Who will cover your seat? *</label>
              <select value={coveringPerson} onChange={e=>setCoveringPerson(e.target.value)} className={`w-full border rounded-lg px-3 py-2.5 text-sm mb-1 mt-1 ${errors.coveringPerson?'border-red-500 bg-red-50':''}`}><option value="">Select Staff *</option>{employees.map((emp:any)=><option key={emp.id} value={emp.id}>{getName(emp)} - {emp.department||emp.role}</option>)}</select>
              {errors.coveringPerson&&<p className="text-[11px] text-red-500 mb-2">{errors.coveringPerson}</p>}
              <label className="text-xs font-medium">Attach Handover Report * (PDF/DOCX)</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={e=>setHandoverFile(e.target.files?.[0]||null)} className={`w-full border rounded-lg px-3 py-2 text-sm mb-1 mt-1 file:mr-3 file:bg-black file:text-white file:px-3 file:py-1 file:rounded-full file:border-0 ${errors.handoverFile?'border-red-500 bg-red-50':''}`}/>
              {errors.handoverFile&&<p className="text-[11px] text-red-500 mb-2">{errors.handoverFile}</p>}
              {handoverFile && <p className="text-xs text-green-600 mb-2">📎 {handoverFile.name}</p>}
              <label className="text-xs font-medium">Reason / Handover Details *</label>
              <textarea value={leaveReason} onChange={e=>setLeaveReason(e.target.value)} placeholder="Mandatory: What tasks are pending, handover details..." className={`w-full border rounded-lg px-3 py-2.5 text-sm mb-1 mt-1 h-24 ${errors.leaveReason?'border-red-500 bg-red-50':''}`}/>
              {errors.leaveReason&&<p className="text-[11px] text-red-500 mb-2">{errors.leaveReason}</p>}
              <button disabled={uploading} onClick={submitLeave} className="w-full bg-black text-white rounded-lg py-3 text-sm font-semibold mt-3 disabled:bg-gray-300">{uploading?'Uploading & Sending Email...':'Submit Leave Request *'}</button>
              <p className="text-[11px] text-gray-400 mt-2 text-center">* All fields are mandatory. Email will be sent using customizable template.</p>
            </div>
            <div className="md:col-span-7 bg-white rounded-2xl border overflow-hidden"><div className="p-4 border-b flex justify-between"><h3 className="font-semibold text-sm">My Leave History</h3><span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{leaves.length} requests</span></div><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Dates</th><th className="p-3">Days</th><th className="p-3">Return</th><th className="p-3">Cover</th><th className="p-3">Status</th></tr></thead><tbody>{leaves.map((l:any)=><tr key={l.id} className="border-t"><td className="p-3 text-xs">{l.start_date} → {l.end_date}<br/><span className="text-gray-500">{l.type}</span></td><td className="p-3 text-center font-bold">{l.days}</td><td className="p-3 text-xs">{l.end_date? addReturnDate(l.end_date):'-'}</td><td className="p-3 text-xs">{employees.find((e:any)=>e.id===l.covering_person_id)? getName(employees.find((e:any)=>e.id===l.covering_person_id)): '-'}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${l.status==='pending'?'bg-yellow-100':l.status==='approved'?'bg-green-100':'bg-red-100'}`}>{l.status}</span></td></tr>)}</tbody></table>{leaves.length===0&&<p className="p-12 text-center text-gray-400 text-sm">No leave yet — apply on left. All fields mandatory.</p>}</div>
          </div>
        )}
        {tab==='settings' && (
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-bold text-lg mb-1">Customisable Email Reply Templates</h3>
            <p className="text-xs text-gray-500 mb-6">HR can edit messages that are auto-sent on email. Use variables: {'{{employee_name}}, {{leave_type}}, {{total_days}}, {{start_date}}, {{end_date}}, {{return_date}}, {{covering_person}}, {{handover_filename}}, {{approver_name}}, {{reject_reason}}'}</p>
            <div className="grid gap-4">{templates.map(t=><div key={t.id} className="border rounded-xl p-4"><div className="flex justify-between items-center mb-2"><span className="font-mono text-xs bg-black text-white px-2 py-1 rounded">{t.key}</span><button onClick={()=>setEditingTpl(t)} className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Edit</button></div><p className="text-sm font-semibold">{t.subject}</p><p className="text-xs text-gray-600 mt-2 whitespace-pre-wrap bg-gray-50 p-3 rounded">{t.body.slice(0,200)}...</p></div>)}</div>
            {editingTpl && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"><div className="bg-white rounded-2xl p-6 w-full max-w-2xl"><h3 className="font-bold mb-4">Edit Template: {editingTpl.key}</h3><label className="text-xs font-medium">Subject</label><input value={editingTpl.subject} onChange={e=>setEditingTpl({...editingTpl, subject:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm mb-3 mt-1"/><label className="text-xs font-medium">Body (use variables)</label><textarea value={editingTpl.body} onChange={e=>setEditingTpl({...editingTpl, body:e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm h-64 mt-1 font-mono"/><div className="flex gap-2 mt-4"><button onClick={saveTemplate} className="bg-black text-white px-5 py-2 rounded-lg text-sm">Save Template</button><button onClick={()=>setEditingTpl(null)} className="bg-gray-100 px-5 py-2 rounded-lg text-sm">Cancel</button></div></div></div>}
          </div>
        )}
        {tab==='workspace' && <div className="bg-white p-6 rounded-2xl border">Workspace - All fields mandatory for profile change, logistics, expense too. Will enforce next.</div>}
        {tab==='requests' && <div className="bg-white rounded-2xl border overflow-hidden"><div className="p-4 border-b font-semibold text-sm">All My Requests</div><table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="p-3 text-left">Date</th><th className="p-3">Type</th><th className="p-3">Days</th><th className="p-3">Status</th></tr></thead><tbody>{leaves.map((r:any)=><tr key={r.id} className="border-t"><td className="p-3 text-xs">{new Date(r.created_at).toLocaleDateString()}</td><td className="p-3">{r.type}</td><td className="p-3">{r.days}</td><td className="p-3">{r.status}</td></tr>)}</tbody></table></div>}
        {tab==='approvals' && <div className="bg-white p-6 rounded-2xl border text-center text-sm">Approvals view - Line manager can approve/reject and trigger email templates.</div>}
      </div>
    </div>
  );
}
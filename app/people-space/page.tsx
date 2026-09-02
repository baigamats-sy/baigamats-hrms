"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Tab = 'workspace' | 'myrequests' | 'org';

export default function PeopleSpace() {
  const [tab, setTab] = useState<Tab>('workspace');
  const [me, setMe] = useState<any>(null);
  const [myRequests, setMyRequests] = useState<any[]>([]);
  const [orgUnits, setOrgUnits] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [fullName, setFullName] = useState('');
  const [logisticType, setLogisticType] = useState('Laptop');
  const [amount, setAmount] = useState('');

  useEffect(()=>{ loadData(); },[]);

  function getName(e:any){ return e?.full_name || e?.name || e?.employee_name || '—'; }

  async function loadData(){
    const { data: { user } } = await supabase.auth.getUser();
    const { data: emps } = await supabase.from('employees').select('*');
    if(emps){
      setEmployees(emps);
      const myRec = (user?.id? emps.find((e:any)=>e.auth_user_id===user.id): null) || emps[0];
      setMe(myRec);
      if(myRec){
        const { data: reqs } = await supabase.from('employee_requests').select('*').eq('employee_id', myRec.id).order('created_at',{ascending:false});
        if(reqs) setMyRequests(reqs);
      }
    }
    const { data: orgs } = await supabase.from('org_units').select('*');
    if(orgs) setOrgUnits(orgs);
  }

  async function submitProfileChange(){
    if(!me||!fullName) return alert('Enter new name');
    const { error } = await supabase.from('employee_requests').insert({ employee_id: me.id, type: 'profile_change', data: { new_name: fullName }, status: 'pending' });
    if(error) alert(error.message); else { alert('Profile change sent for HR approval'); setFullName(''); loadData(); }
  }
  async function submitLogistics(){
    if(!me) return;
    const { error } = await supabase.from('employee_requests').insert({ employee_id: me.id, type: 'logistics', data: { item: logisticType }, status: 'pending' });
    if(error) alert(error.message); else { alert('Requested: '+logisticType); loadData(); setTab('myrequests'); }
  }
  async function submitExpense(){
    if(!me||!amount) return alert('Enter amount');
    const { error } = await supabase.from('employee_requests').insert({ employee_id: me.id, type: 'expense', data: { amount_ugx: amount }, status: 'pending' });
    if(error) alert(error.message); else { alert('Expense submitted'); setAmount(''); loadData(); setTab('myrequests'); }
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <div className="w-[240px] bg-[#0B1220] text-white p-5 flex flex-col fixed h-full">
        <h1 className="text-lg font-bold mb-10">BaigaMats HRMS</h1>
        <p className="text-[10px] tracking-widest text-white/40 mb-3">MENU</p>
        <div className="flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm">🏠 Dashboard</Link>
          <Link href="/employees" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm">👥 Human Resource</Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm">🧑‍💼 People Space</div>
        </div>
      </div>

      <div className="flex-1 ml-[240px] p-8">
        <h1 className="text-[28px] font-bold tracking-tight">People Space</h1>
        <p className="text-sm text-gray-500 mb-6">{me? `${getName(me)} • ${me.role||me.department||'Staff'}`: 'My Workspace'} • Employee Self-Service</p>

        <div className="flex gap-6 border-b mb-6">
          <button onClick={()=>setTab('workspace')} className={`pb-3 text-sm font-medium border-b-2 ${tab==='workspace'?'border-black text-black':'border-transparent text-gray-500'}`}>My Workspace</button>
          <button onClick={()=>setTab('myrequests')} className={`pb-3 text-sm font-medium border-b-2 ${tab==='myrequests'?'border-black text-black':'border-transparent text-gray-500'}`}>My Requests ({myRequests.length})</button>
          <button onClick={()=>setTab('org')} className={`pb-3 text-sm font-medium border-b-2 ${tab==='org'?'border-black text-black':'border-transparent text-gray-500'}`}>Org Structure</button>
        </div>

        {tab==='workspace' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border shadow-sm"><h3 className="font-semibold mb-1">My Profile</h3><p className="text-xs text-gray-500 mb-3">Current: {getName(me)} • To change name, request HR approval</p><input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="New full name" className="w-full border rounded-lg px-3 py-2 text-sm mb-3"/><button onClick={submitProfileChange} className="w-full bg-black text-white rounded-lg py-2.5 text-sm">Request Change - Needs HR Approval</button></div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm"><h3 className="font-semibold mb-3">Logistics</h3><p className="text-xs text-gray-500 mb-3">Request work tools</p><select value={logisticType} onChange={e=>setLogisticType(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mb-3"><option>Laptop</option><option>Internet / Data</option><option>Transport</option><option>Office Chair</option><option>Other</option></select><button onClick={submitLogistics} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm">Request Item</button></div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm"><h3 className="font-semibold mb-3">Expense / Advance</h3><p className="text-xs text-gray-500 mb-3">Request advance in UGX</p><input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount UGX" type="number" className="w-full border rounded-lg px-3 py-2 text-sm mb-3"/><button onClick={submitExpense} className="w-full bg-green-600 text-white rounded-lg py-2.5 text-sm">Submit Request</button></div>
          </div>
        )}

        {tab==='myrequests' && (
          <div className="bg-white rounded-2xl border overflow-hidden">
            <div className="p-4 border-b flex justify-between"><h3 className="font-semibold text-sm">My Request History</h3><span className="text-xs text-gray-500">{myRequests.filter(r=>r.status==='pending').length} pending</span></div>
            <table className="w-full text-sm"><thead className="bg-gray-50 text-left"><tr><th className="p-3">Date</th><th className="p-3">Type</th><th className="p-3">Details</th><th className="p-3">Status</th></tr></thead><tbody>{myRequests.map(r=>(<tr key={r.id} className="border-t"><td className="p-3 text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td><td className="p-3">{r.type}</td><td className="p-3 text-gray-600">{JSON.stringify(r.data)}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${r.status==='pending'?'bg-yellow-100 text-yellow-800':r.status==='approved'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{r.status}</span></td></tr>))}</tbody></table>
            {myRequests.length===0 && <p className="p-8 text-center text-gray-400 text-sm">No requests yet. Submit from My Workspace.</p>}
          </div>
        )}

        {tab==='org' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {orgUnits.length>0? orgUnits.map(u=>(<div key={u.id} className="bg-white p-4 rounded-2xl border"><p className="font-semibold text-sm">{u.name}</p><p className="text-xs text-gray-500 mt-1">{employees.filter(e=>e.org_unit_id===u.id).length} members</p></div>)) : (
              <div className="col-span-4 bg-white p-6 rounded-2xl border"><p className="text-sm font-semibold mb-3">Departments</p><div className="flex flex-wrap gap-2">{[...new Set(employees.map(e=>e.department).filter(Boolean))].map((d:any)=>(<span key={d} className="px-3 py-1 bg-gray-100 rounded-full text-xs">{d}: {employees.filter(e=>e.department===d).length}</span>))}</div><p className="text-xs text-gray-400 mt-4">Org chart is read-only for staff. HR manages structure.</p></div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
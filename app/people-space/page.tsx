"use client"
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Tab = 'workspace' | 'directory' | 'org' | 'approvals';

export default function PeopleSpace() {
  const [tab, setTab] = useState<Tab>('workspace');
  const [me, setMe] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [orgUnits, setOrgUnits] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [fullName, setFullName] = useState('');
  const [logisticType, setLogisticType] = useState('Laptop');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    // Try to get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Get all employees
    const { data: emps } = await supabase.from('employees').select('*, org_units(name)').order('created_at', { ascending: false });
    if (emps) {
      setEmployees(emps);
      // Try to find me by auth id, else first admin
      let myRec = emps.find((e:any) => e.auth_user_id === user?.id) || emps[0];
      setMe(myRec);
    }

    const { data: orgs } = await supabase.from('org_units').select('*');
    if (orgs) setOrgUnits(orgs);

    const { data: reqs } = await supabase.from('employee_requests').select('*, employees(full_name)').order('created_at', { ascending: false });
    if (reqs) setRequests(reqs);
  }

  async function submitProfileChange() {
    if (!me ||!fullName) return alert('Enter new name');
    const { error } = await supabase.from('employee_requests').insert({
      employee_id: me.id,
      type: 'profile_change',
      data: { new_name: fullName },
      status: 'pending'
    });
    if (error) alert(error.message);
    else { alert('Profile change request sent — needs HR approval'); setFullName(''); loadData(); }
  }

  async function submitLogistics() {
    if (!me) return;
    const { error } = await supabase.from('employee_requests').insert({
      employee_id: me.id,
      type: 'logistics',
      data: { item: logisticType },
      status: 'pending'
    });
    if (error) alert(error.message);
    else { alert('Logistics request sent: ' + logisticType); loadData(); }
  }

  async function submitExpense() {
    if (!me ||!amount) return alert('Enter amount');
    const { error } = await supabase.from('employee_requests').insert({
      employee_id: me.id,
      type: 'expense',
      data: { amount_ugx: amount },
      status: 'pending'
    });
    if (error) alert(error.message);
    else { alert('Expense request sent: ' + amount + ' UGX'); setAmount(''); loadData(); }
  }

  async function approveReq(id: string, status: 'approved' | 'rejected') {
    const { error } = await supabase.from('employee_requests').update({ status }).eq('id', id);
    if (error) alert(error.message);
    else loadData();
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      {/* SIDEBAR */}
      <div className="w-[240px] bg-[#0B1220] text-white p-5 flex flex-col fixed h-full">
        <h1 className="text-lg font-bold mb-10">BaigaMats HRMS</h1>
        <p className="text-[10px] tracking-widest text-white/40 mb-3">MENU</p>
        <div className="flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm">🏠 Dashboard</Link>
          <Link href="/employees" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm">👥 Human Resource</Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm">🧑‍💼 People Space</div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 ml-[240px] p-8">
        <h1 className="text-[28px] font-bold tracking-tight text-[#0B1220]">People Space</h1>
        <p className="text-sm text-gray-500 mb-6">
          {me? `${me.full_name} • ${me.role || me.org_units?.name || 'Staff'} • ${me.org_unit_id? 'Linked' : ''}` : 'Loading profile...'} • {employees.length} employees
        </p>

        {/* TABS */}
        <div className="flex gap-6 border-b mb-6">
          {[
            { k: 'workspace', l: 'My Workspace' },
            { k: 'directory', l: 'Directory' },
            { k: 'org', l: 'Org Structure' },
            { k: 'approvals', l: `Approvals (${requests.filter(r=>r.status==='pending').length})` },
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k as Tab)} className={`pb-3 text-sm font-medium border-b-2 ${tab===t.k? 'border-black text-black' : 'border-transparent text-gray-500'}`}>{t.l}</button>
          ))}
        </div>

        {tab === 'workspace' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-2xl border">
              <h3 className="font-semibold mb-3">My Profile</h3>
              <p className="text-xs text-gray-500 mb-2">Current: {me?.full_name}</p>
              <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="New full name" className="w-full border rounded-lg px-3 py-2 text-sm mb-3" />
              <button onClick={submitProfileChange} className="w-full bg-black text-white rounded-lg py-2.5 text-sm">Request Change - Needs HR Approval</button>
            </div>
            <div className="bg-white p-5 rounded-2xl border">
              <h3 className="font-semibold mb-3">Logistics</h3>
              <select value={logisticType} onChange={e=>setLogisticType(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm mb-3">
                <option>Laptop</option><option>Internet / Data</option><option>Transport</option><option>Office Chair</option><option>Other</option>
              </select>
              <button onClick={submitLogistics} className="w-full bg-blue-600 text-white rounded-lg py-2.5 text-sm">Request Item</button>
            </div>
            <div className="bg-white p-5 rounded-2xl border">
              <h3 className="font-semibold mb-3">Expense / Advance</h3>
              <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount UGX" type="number" className="w-full border rounded-lg px-3 py-2 text-sm mb-3" />
              <button onClick={submitExpense} className="w-full bg-green-600 text-white rounded-lg py-2.5 text-sm">Submit Request</button>
            </div>
          </div>
        )}

        {tab === 'directory' && (
          <div className="bg-white rounded-2xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Unit</th><th className="p-3">Role</th></tr></thead>
              <tbody>{employees.map(e=>(<tr key={e.id} className="border-t"><td className="p-3 font-medium">{e.full_name}</td><td className="p-3 text-gray-500">{e.email}</td><td className="p-3">{e.org_units?.name || '-'}</td><td className="p-3">{e.role || '-'}</td></tr>))}</tbody>
            </table>
          </div>
        )}

        {tab === 'org' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {orgUnits.map(u=>(<div key={u.id} className="bg-white p-4 rounded-2xl border"><p className="font-semibold text-sm">{u.name}</p><p className="text-xs text-gray-500 mt-1">{employees.filter(e=>e.org_unit_id===u.id).length} members</p></div>))}
          </div>
        )}

        {tab === 'approvals' && (
          <div className="bg-white rounded-2xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left"><tr><th className="p-3">Employee</th><th className="p-3">Type</th><th className="p-3">Details</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead>
              <tbody>{requests.map(r=>(<tr key={r.id} className="border-t"><td className="p-3">{r.employees?.full_name || r.employee_id.slice(0,8)}</td><td className="p-3">{r.type}</td><td className="p-3 text-gray-600">{JSON.stringify(r.data)}</td><td className="p-3"><span className={`px-2 py-1 rounded-full text-xs ${r.status==='pending'?'bg-yellow-100':r.status==='approved'?'bg-green-100':'bg-red-100'}`}>{r.status}</span></td><td className="p-3 flex gap-2">{r.status==='pending' && <><button onClick={()=>approveReq(r.id,'approved')} className="px-3 py-1 bg-black text-white rounded-lg text-xs">Approve</button><button onClick={()=>approveReq(r.id,'rejected')} className="px-3 py-1 bg-gray-200 rounded-lg text-xs">Reject</button></>}</td></tr>))}</tbody>
            </table>
            {requests.length===0 && <p className="p-6 text-center text-gray-400 text-sm">No requests yet — submit one from My Workspace</p>}
          </div>
        )}
      </div>
    </div>
  );
}
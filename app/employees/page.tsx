'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
export default function EmployeesPage(){
  const [emps, setEmps] = useState<any[]>([]);
  const [form, setForm] = useState({name:'', email:'', role:'', department:'General', salary:''});
  const load = async () => { const {data}=await supabase.from('employees').select('*').order('created_at',{ascending:false}); if(data) setEmps(data); };
  useEffect(()=>{load();},[]);
  const add = async (e:any) => {
    e.preventDefault();
    const {error}=await supabase.from('employees').insert({name:form.name, email:form.email, role:form.role, department:form.department, salary: Number(form.salary)||0});
    if(!error){ setForm({name:'', email:'', role:'', department:'General', salary:''}); load(); alert('Employee Added ✓'); } else alert(error.message);
  };
  const totalSalary = emps.reduce((s,e)=>s+Number(e.salary||0),0);
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">04 Employee Files - LIVE DB</h1>
      <p className="text-gray-500 mb-6">{emps.length} employees • Total Payroll: UGX {totalSalary.toLocaleString()}</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Add Employee</h2>
          <form onSubmit={add} className="space-y-3">
            <input required placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border p-2 rounded"/>
            <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full border p-2 rounded"/>
            <input placeholder="Role (e.g. Developer)" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="w-full border p-2 rounded"/>
            <select value={form.department} onChange={e=>setForm({...form,department:e.target.value})} className="w-full border p-2 rounded"><option>General</option><option>HR</option><option>Finance</option><option>Engineering</option><option>Sales</option></select>
            <input required type="number" placeholder="Salary UGX" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} className="w-full border p-2 rounded"/>
            <button className="w-full bg-indigo-600 text-white p-3 rounded font-bold">Save Employee</button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-xl shadow max-h-[600px] overflow-auto">
          <h2 className="font-bold mb-4">Staff Directory ({emps.length})</h2>
          <div className="space-y-2">
            {emps.map((e:any)=><div key={e.id} className="border p-3 rounded flex justify-between"><div><div className="font-bold">{e.name}</div><div className="text-xs text-gray-500">{e.role} - {e.department}</div></div><div className="text-sm font-bold">UGX {Number(e.salary).toLocaleString()}</div></div>)}
            {emps.length===0 && <p className="text-gray-400 text-sm">No employees yet - add first one!</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
export default function PayrollPage(){
  const [emps, setEmps] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [month, setMonth] = useState('2026-09');
  const load = async () => {
    const {data: eData}=await supabase.from('employees').select('*');
    if(eData) setEmps(eData);
    const {data: pData}=await supabase.from('payroll_records').select('*').order('created_at',{ascending:false});
    if(pData) setRecords(pData);
  };
  useEffect(()=>{load();},[]);
  const runPayroll = async () => {
    if(emps.length===0){ alert('Add employees first in /employees'); return; }
    for(const emp of emps){
      const gross = Number(emp.salary)||0;
      const deductions = gross * 0.15;
      const net = gross - deductions;
      await supabase.from('payroll_records').insert({employee_name: emp.name, month, gross_salary: gross, deductions, net_salary: net, status:'Processed'});
    }
    alert('Payroll Run for ' + month + ' - UGX ' + emps.reduce((s,e)=>s+Number(e.salary||0),0).toLocaleString() + ' processed!');
    load();
  };
  const totalNet = records.filter(r=>r.month===month).reduce((s,r)=>s+Number(r.net_salary||0),0);
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">08 Payroll Engine - LIVE DB</h1>
      <p className="text-gray-500 mb-6">Employees: {emps.length} • This Month Net: UGX {totalNet.toLocaleString()}</p>
      <div className="bg-white p-6 rounded-xl shadow mb-6 flex gap-4 items-end">
        <div><label className="text-sm font-bold">Payroll Month</label><input type="month" value={month} onChange={e=>setMonth(e.target.value)} className="border p-2 rounded ml-2"/></div>
        <button onClick={runPayroll} className="bg-green-600 text-white px-6 py-2 rounded font-bold">Run Payroll Now</button>
        <button onClick={load} className="bg-gray-100 px-4 py-2 rounded">Refresh</button>
      </div>
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-bold mb-4">Payroll History ({records.length})</h2>
        <div className="space-y-2 max-h-[500px] overflow-auto">
          {records.map((r:any)=><div key={r.id} className="border p-3 rounded flex justify-between text-sm"><span>{r.employee_name} - {r.month}</span><span>Gross: {Number(r.gross_salary).toLocaleString()}</span><span className="font-bold text-green-700">Net: {Number(r.net_salary).toLocaleString()}</span><span className="px-2 py-1 bg-green-100 rounded text-xs">{r.status}</span></div>)}
          {records.length===0 && <p className="text-gray-400">No payroll runs yet - click Run Payroll</p>}
        </div>
      </div>
    </div>
  )
}

'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
export default function Dashboard(){
  const [stats, setStats] = useState({emps:0, payroll:0, leaves:0, assets:0, pendingLeaves:0});
  useEffect(()=>{
    async function load(){
      const {count: eCount}=await supabase.from('employees').select('*',{count:'exact', head:true});
      const {data: payroll}=await supabase.from('payroll_records').select('net_salary');
      const {count: lCount}=await supabase.from('leave_requests').select('*',{count:'exact', head:true});
      const {count: pCount}=await supabase.from('leave_requests').select('*',{count:'exact', head:true}).eq('status','Pending');
      const {count: aCount}=await supabase.from('company_assets').select('*',{count:'exact', head:true});
      const total = payroll?.reduce((s:any,r:any)=>s+Number(r.net_salary||0),0) || 0;
      setStats({emps: eCount||0, payroll: total, leaves: lCount||0, assets: aCount||0, pendingLeaves: pCount||0});
    }
    load();
  },[]);
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-2">🏢 HRMS CEO Dashboard - LIVE</h1>
      <p className="text-gray-500 mb-8">Real-time from Supabase • Kampala, UG • {new Date().toLocaleDateString()}</p>
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-indigo-600"><div className="text-sm text-gray-500">Total Employees</div><div className="text-3xl font-bold">{stats.emps}</div><div className="text-xs text-green-600 mt-2">✓ LIVE DB</div></div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-600"><div className="text-sm text-gray-500">Monthly Payroll</div><div className="text-2xl font-bold">UGX {stats.payroll.toLocaleString()}</div><div className="text-xs text-green-600 mt-2">✓ Processed</div></div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-orange-600"><div className="text-sm text-gray-500">Assets Tracked</div><div className="text-3xl font-bold">{stats.assets}</div><div className="text-xs text-orange-600 mt-2">{stats.assets} laptop assigned</div></div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-600"><div className="text-sm text-gray-500">Pending Approvals</div><div className="text-3xl font-bold">{stats.pendingLeaves}</div><div className="text-xs text-red-600 mt-2">Needs action</div></div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow"><h2 className="font-bold mb-4">Quick Links - All LIVE</h2><div className="grid grid-cols-2 gap-3">
          <a href="/employees" className="bg-indigo-50 p-4 rounded-lg text-center font-bold hover:bg-indigo-100">👥 Employees ({stats.emps})</a>
          <a href="/my-hr" className="bg-blue-50 p-4 rounded-lg text-center font-bold hover:bg-blue-100">📝 My HR ({stats.leaves})</a>
          <a href="/approvals" className="bg-red-50 p-4 rounded-lg text-center font-bold hover:bg-red-100">✅ Approvals ({stats.pendingLeaves})</a>
          <a href="/payroll" className="bg-green-50 p-4 rounded-lg text-center font-bold hover:bg-green-100">💰 Payroll</a>
          <a href="/assets" className="bg-orange-50 p-4 rounded-lg text-center font-bold hover:bg-orange-100">💻 Assets ({stats.assets})</a>
          <a href="/leave-calendar" className="bg-purple-50 p-4 rounded-lg text-center font-bold hover:bg-purple-100">📅 Calendar</a>
        </div></div>
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl shadow text-white"><h2 className="font-bold text-xl mb-2">You Built This! 🚀</h2><p className="text-sm opacity-90 mb-4">6 modules live on Supabase. Real payroll: UGX {stats.payroll.toLocaleString()} for {stats.emps} employees.</p><div className="bg-white/20 p-3 rounded text-sm">• Leave workflow: Employee → HR Approval<br/>• Payroll: Auto 15% deduction<br/>• Assets: Assigned to staff<br/>• All data in Supabase cloud</div></div>
      </div>
    </div>
  )
}

'use client';
import { useState } from 'react';
import Link from 'next/link';

const tabs = ['Directory','Attendance','Leave','Assets','Approvals','Calendar'];

export default function HRPage(){
  const [active, setActive] = useState('Directory');

  return (
    <div className="min-h-screen flex bg-[#f6f7fb]">
      {/* SAME SIDEBAR - so it stays consistent */}
      <aside className="w-[280px] bg-[#0B1220] text-white flex flex-col p-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center font-black text-[18px]">B</div>
          <div><div className="font-extrabold tracking-widest text-[13px]">BAIGAMATS</div><div className="text-[10px] tracking-[0.2em] text-white/60 font-semibold">TECHNOLOGIES</div></div>
        </div>
        <div className="mt-10 space-y-2">
          <p className="text-[10px] tracking-widest text-white/40 mb-3">MENU</p>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm">🏠 Dashboard</Link>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm">👥 Human Resource</div>
        </div>
        <div className="mt-auto">
          <div className="bg-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-bold">B</div>
            <div><div className="text-sm font-semibold">Baigamats Admin</div><div className="text-[11px] text-white/50">baigamatsinquiries@gmail.com</div></div>
          </div>
          <div className="text-[11px] text-white/30 text-center mt-3">Powered by Baigamats © 2026</div>
        </div>
      </aside>

      {/* HR CONTENT */}
      <main className="flex-1 p-8">
        <h1 className="text-[28px] font-bold tracking-tight text-[#0B1220]">Human Resource</h1>
        <p className="text-sm text-gray-500 mt-1">All HR operations in one module • No scattering</p>

        <div className="flex gap-2 mt-6 bg-white p-2 rounded-2xl w-fit shadow-sm border">
          {tabs.map(t=>(
            <button key={t} onClick={()=>setActive(t)} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${active===t?'bg-black text-white':'text-gray-600 hover:bg-gray-100'}`}>{t}</button>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-[24px] p-8 shadow-sm border border-black/[0.04] min-h-[400px]">
          {active==='Directory' && (
            <div>
              <div className="flex justify-between items-center mb-6"><h2 className="font-bold text-lg">Directory - 3 Employees</h2><button className="bg-black text-white px-4 py-2 rounded-xl text-sm">+ Add Employee</button></div>
              <div className="space-y-3">
                <div className="flex justify-between p-4 bg-gray-50 rounded-xl"><span>John Doe - Developer</span><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span></div>
                <div className="flex justify-between p-4 bg-gray-50 rounded-xl"><span>Jane Smith - HR</span><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span></div>
                <div className="flex justify-between p-4 bg-gray-50 rounded-xl"><span>Baigamats Admin - CEO</span><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span></div>
              </div>
            </div>
          )}
          {active==='Attendance' && <div><h2 className="font-bold text-lg">Attendance</h2><p className="text-sm text-gray-500 mt-2">Check-in / Check-out logs will appear here. No payroll pollution.</p><div className="mt-6 grid grid-cols-3 gap-4"><div className="p-4 bg-gray-50 rounded-xl">Today: 3 Present</div><div className="p-4 bg-gray-50 rounded-xl">Late: 0</div><div className="p-4 bg-gray-50 rounded-xl">Absent: 0</div></div></div>}
          {active==='Leave' && <div><h2 className="font-bold text-lg">Leave & My HR</h2><p className="text-sm text-gray-500 mt-2">Leave requests, self-service portal.</p></div>}
          {active==='Assets' && <div><h2 className="font-bold text-lg">Assets - 1 Assigned</h2><p className="text-sm text-gray-500 mt-2">Laptop - Assigned to John Doe</p><div className="mt-4 p-4 bg-gray-50 rounded-xl">💻 Dell Laptop - SN: 12345 - John Doe</div></div>}
          {active==='Approvals' && <div><h2 className="font-bold text-lg">Approvals</h2><p className="text-sm text-gray-500 mt-2">0 pending. All clear.</p></div>}
          {active==='Calendar' && <div><h2 className="font-bold text-lg">Leave Calendar</h2><p className="text-sm text-gray-500 mt-2">Calendar view coming here.</p></div>}
        </div>
      </main>
    </div>
  )
}
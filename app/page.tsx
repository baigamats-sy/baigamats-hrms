'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex bg-[#f6f7fb]">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-[#0B1220] text-white flex flex-col p-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center font-black text-[18px]">B</div>
          <div>
            <div className="font-extrabold tracking-widest text-[13px]">BAIGAMATS</div>
            <div className="text-[10px] tracking-[0.2em] text-white/60 font-semibold">TECHNOLOGIES</div>
          </div>
        </div>
        <div className="mt-10 space-y-2">
          <p className="text-[10px] tracking-widest text-white/40 mb-3">MENU</p>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm">🏠 Dashboard</div>
          <Link href="/employees" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm">👥 Human Resource</Link>
        </div>
        <div className="mt-auto text-[11px] text-white/30 text-center">Powered by Baigamats © 2026</div>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        {/* TOP BAR WITH PROFILE - NO LIVE BADGE */}
        <div className="h-[64px] bg-white border-b flex items-center justify-between px-8">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-[#0B1220]">Dashboard</h1>
            <p className="text-[12px] text-gray-500">Kampala, UG • 2 Sept 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-semibold">Baigamats Admin</div>
              <div className="text-[11px] text-gray-500">baigamatsinquiries@gmail.com</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0B1220] text-white flex items-center justify-center font-bold">B</div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-3 gap-5">
            <div className="bg-white rounded-[20px] p-6 shadow-sm border">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Total Employees</div>
              <div className="text-3xl font-bold mt-2">3</div>
              <div className="text-xs text-gray-500 mt-3">Directory</div>
            </div>
            <div className="bg-white rounded-[20px] p-6 shadow-sm border">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Assets Assigned</div>
              <div className="text-3xl font-bold mt-2">1</div>
              <div className="text-xs text-gray-500 mt-3">Laptop tracked</div>
            </div>
            <div className="bg-white rounded-[20px] p-6 shadow-sm border">
              <div className="text-xs text-gray-500 uppercase tracking-widest">Pending Approvals</div>
              <div className="text-3xl font-bold mt-2">0</div>
              <div className="text-xs text-emerald-600 mt-3">All clear</div>
            </div>
          </div>

          <div className="mt-6 bg-[#0B1220] rounded-[24px] p-8 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Human Resource Module</h2>
              <p className="text-sm text-white/60 mt-1">Everything HR — employees, attendance, leave, assets, calendar — inside one place.</p>
            </div>
            <Link href="/employees" className="bg-white text-black px-6 py-3 rounded-xl text-sm font-semibold">Open HR →</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
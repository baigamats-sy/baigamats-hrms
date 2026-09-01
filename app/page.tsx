'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Home() {
  const path = usePathname();
  return (
    <div className="min-h-screen flex bg-[#f6f7fb] font-sans">
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
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm">🏠 Dashboard</Link>
          <Link href="/employees" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm">👥 Human Resource</Link>
        </div>

        <div className="mt-auto space-y-4">
          <div className="bg-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-bold">B</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Baigamats Admin</div>
              <div className="text-[11px] text-white/50">baigamatsinquiries@gmail.com</div>
            </div>
          </div>
          <div className="text-[11px] text-white/30 text-center">Powered by Baigamats © 2026</div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[#0B1220]">HRMS Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Kampala, UG • {new Date().toLocaleDateString()}</p>
          </div>
          <div className="bg-black text-white text-xs px-4 py-2 rounded-full">LIVE • Supabase</div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-black/[0.04]">
            <div className="text-xs text-gray-500">Total Employees</div>
            <div className="text-3xl font-bold mt-2">3</div>
            <div className="text-xs text-emerald-600 mt-3">● Active in DB</div>
          </div>
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-black/[0.04]">
            <div className="text-xs text-gray-500">Assets Assigned</div>
            <div className="text-3xl font-bold mt-2">1</div>
            <div className="text-xs text-gray-500 mt-3">1 laptop assigned</div>
          </div>
          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-black/[0.04]">
            <div className="text-xs text-gray-500">Pending Approvals</div>
            <div className="text-3xl font-bold mt-2">0</div>
            <div className="text-xs text-amber-600 mt-3">All clear</div>
          </div>
        </div>

        <div className="mt-6 bg-[#0B1220] rounded-[24px] p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Human Resource Module</h2>
              <p className="text-sm text-white/60 mt-2">Your only active module. Everything HR lives here.</p>
            </div>
            <Link href="/employees" className="bg-white text-black px-6 py-3 rounded-xl text-sm font-semibold">Open HR →</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
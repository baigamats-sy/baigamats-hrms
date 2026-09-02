"use client"
import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      {/* SIDEBAR */}
      <div className="w-[240px] bg-[#0B1220] text-white p-5 flex flex-col">
        <h1 className="text-lg font-bold mb-10">BaigaMats HRMS</h1>

        <p className="text-[10px] tracking-widest text-white/40 mb-3">MENU</p>
        <div className="flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white text-black font-semibold text-sm">🏠 Dashboard</Link>
          <Link href="/employees" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm">👥 Human Resource</Link>
          <Link href="/people-space" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 text-sm">🧑‍💼 People Space</Link>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">
        <h1 className="text-[28px] font-bold tracking-tight text-[#0B1220]">Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome to Next-Gen HRMS</p>

        <div className="grid grid-cols-3 gap-6">
          <Link href="/employees" className="bg-white p-6 rounded-2xl border hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">Human Resource Module</h2>
            <p className="text-sm text-gray-500 mt-2">Manage employees, org structure, roles</p>
          </Link>

          <Link href="/people-space" className="bg-white p-6 rounded-2xl border hover:shadow-lg transition border-black">
            <h2 className="text-xl font-semibold">🧑‍💼 People Space (NEW)</h2>
            <p className="text-sm text-gray-500 mt-2">My Workspace, Directory, Requests</p>
            <span className="inline-block mt-3 text-xs bg-black text-white px-3 py-1 rounded-full">Click to Open</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
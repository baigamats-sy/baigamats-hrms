'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const hrItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Employees (3)', href: '/employees' },
  { label: 'Payroll', href: '/payroll' },
  { label: 'Assets (1)', href: '/assets' },
  { label: 'Approvals (0)', href: '/approvals' },
  { label: 'My HR (Leave)', href: '/my-hr' },
  { label: 'Calendar', href: '/calendar' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-[260px] bg-[#0f172a] text-white p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center font-bold">B</div>
          <div><div className="font-bold text-sm">BAIGAMATS</div><div className="text-[11px] text-gray-400">TECHNOLOGIES</div></div>
        </div>

        <nav className="flex-1 space-y-6">
          <div>
            <button onClick={()=>setOpen(!open)} className="w-full text-left text-xs uppercase tracking-widest text-gray-400 mb-3 flex justify-between">
              HR Management {open? '−' : '+'}
            </button>
            {open && (
              <div className="space-y-1">
                {hrItems.map(i=>{
                  const active = pathname===i.href;
                  return <Link key={i.href} href={i.href} className={`block px-3 py-2.5 rounded-lg text-sm ${active?'bg-white text-black font-semibold':'text-gray-300 hover:bg-white/10'}`}>{i.label}</Link>
                })}
              </div>
            )}
          </div>
        </nav>

        <div className="mt-auto bg-white/5 rounded-xl p-3">
          <div className="text-xs font-bold">UGX 82,986,600</div>
          <div className="text-[11px] text-green-400">● LIVE Supabase</div>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:underline">← Back to Dashboard</Link>
          <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full">LIVE</span>
        </div>
        {children}
      </main>
    </div>
  )
}
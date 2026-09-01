'use client';
import { useState } from 'react';
export default function LoginPage() {
  const [show, setShow] = useState(false);
  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT - ENTERPRISE BRAND */}
      <div className="hidden lg:flex w-[52%] bg-[#0a1110] relative overflow-hidden p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-black" />
        <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[130px]" />
        <div className="relative z-10 flex justify-between">
          <div className="w-12 h-12 bg-[#16a34a] rounded-[14px] flex items-center justify-center font-bold text-white">B</div>
          <div className="text-white/40 text-xs border border-white/10 rounded-full px-3 py-1">15+ INDUSTRIES • MULTITENANT</div>
        </div>
        <div className="relative z-10">
          <div className="inline-flex gap-2 mb-6">
            {['HRMS','Finance','Projects','Retail','Construction','Logistics'].map(t=>(
              <span key={t} className="text-[10px] bg-white/10 text-white/70 px-2.5 py-1 rounded-full border border-white/10">{t}</span>
            ))}
            <span className="text-[10px] bg-emerald-500 text-black px-2.5 py-1 rounded-full font-bold">+9 MORE</span>
          </div>
          <h1 className="text-[48px] font-bold text-white leading-[0.95] tracking-tight">Welcome to<br/>Baigamats.</h1>
          <p className="text-white/50 mt-6 text-[17px] max-w-[420px] leading-relaxed">One platform to run your entire business. Multitenant, secure, built for scale across 15+ industries.</p>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-[420px]">
            <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-4"><p className="text-white font-bold">99.9%</p><p className="text-white/40 text-xs mt-1">Uptime SLA</p></div>
            <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-4"><p className="text-white font-bold">Multi</p><p className="text-white/40 text-xs mt-1">Tenant Ready</p></div>
            <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-4"><p className="text-white font-bold">15+</p><p className="text-white/40 text-xs mt-1">Industries</p></div>
          </div>
        </div>
        <div className="relative z-10 text-white/20 text-xs">© 2026 Baigamats Technologies • Enterprise OS</div>
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col">
        <div className="p-8 flex justify-between items-center">
          <span className="lg:hidden font-bold">BAIGAMATS</span>
          <span className="text-sm text-gray-500 ml-auto">Enterprise Platform</span>
        </div>
        <div className="flex-1 flex items-center justify-center p-8 -mt-10">
          <div className="w-full max-w-[380px]">
            <h2 className="text-4xl font-bold">Sign in</h2>
            <p className="text-gray-500 mt-3 text-[15px]">Select your workspace to continue</p>

            <div className="mt-8 bg-gray-50 border rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-black text-white rounded-lg flex items-center justify-center font-bold text-sm">B</div>
              <div className="flex-1"><p className="text-sm font-semibold">Baigamats Demo Org</p><p className="text-xs text-gray-500">baigamats.com • Admin</p></div>
              <span className="text-xs bg-white border px-2 py-1 rounded-lg">▼</span>
            </div>

            <div className="mt-6 space-y-4">
              <div><label className="text-sm font-semibold">Work Email</label><input className="mt-2 w-full h-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black outline-none px-4" placeholder="you@company.com" /></div>
              <div><label className="text-sm font-semibold">Password</label><div className="mt-2 relative"><input type={show?'text':'password'} className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-black outline-none px-4 pr-12" placeholder="••••••••" /><button onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-gray-200 w-8 h-8 rounded-full">👁️</button></div></div>
              <button className="w-full h-12 bg-black text-white rounded-xl font-semibold mt-2">Continue to Workspace →</button>
              <div className="text-center text-xs text-gray-400 pt-6">Secure • Multitenant • Encrypted</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
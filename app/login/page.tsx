"use client"
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Login(){
  const router=useRouter();
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [show,setShow]=useState(false); const [loading,setLoading]=useState(false); const [errors,setErrors]=useState<any>({});

  function validate(){ const e:any={}; if(!email.trim()) e.email='Email required *'; else if(!email.includes('@')) e.email='Valid email *'; if(!password) e.password='Password *'; setErrors(e); return!Object.keys(e).length; }
  async function handleLogin(e:any){ e.preventDefault(); if(!validate()) return; setLoading(true); const {error}=await supabase.auth.signInWithPassword({email,password}); setLoading(false); if(error){ alert('❌ '+error.message); return; } router.push('/people-space'); }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <div className="hidden lg:flex w-[55%] bg-[#0A0F1F] text-white p-10 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-[120px] -mr-40 -mt-40"></div>
        <div className="relative z-10 flex items-center gap-3"><div className="w-9 h-9 bg-white rounded-[10px] flex items-center justify-center text-black font-bold">B</div><div><h1 className="text-[18px] font-bold leading-none">Baigamats Technologies</h1><p className="text-[10px] tracking-widest text-white/40 mt-1">POWERED BY BAIGAMATS TECHNOLOGIES</p></div><span className="text-[9px] bg-white/10 px-2 py-1 rounded-full ml-2 border border-white/10">MULTI-TENANT PLATFORM</span></div>

        <div className="relative z-10">
          <h2 className="text-[58px] font-bold leading-[0.9] tracking-tight">Manage<br/>All Institutional<br/><span className="text-[#7C93FF]">Process.</span></h2>
          <p className="text-white/60 mt-6 max-w-[420px] text-[15px] leading-relaxed">CRM, People, Sales, Leave, Logistics, Expenses, Recognition — One platform for entire institution. Each company gets isolated workspace. Free Trial. Go Pro.</p>
          <div className="flex gap-3 mt-8">
            <Link href="/signup" className="bg-white text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-100">Start Free Trial →</Link>
            <Link href="/pricing" className="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/20">Go Pro</Link>
          </div>
          <div className="flex gap-3 mt-8"><div className="bg-white/[0.07] border border-white/10 rounded-2xl p-4"><p className="text-2xl font-bold">500+</p><p className="text-[11px] text-white/50">Institutions</p></div><div className="bg-white/[0.07] border border-white/10 rounded-2xl p-4"><p className="text-2xl font-bold">100%</p><p className="text-[11px] text-white/50">Isolated Data</p></div></div>
        </div>
        <p className="relative z-10 text-[11px] text-white/30">© 2026 Baigamats Technologies • powered by Baigamats Technologies</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          <div className="bg-white p-8 rounded-[28px] border shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <div className="mb-7"><h1 className="text-[24px] font-bold">Welcome back 👋</h1><p className="text-[13px] text-gray-500 mt-1">Login to your institution — All * mandatory</p></div>
            <form onSubmit={handleLogin}>
              <label className="text-[11px] font-semibold tracking-widest text-gray-600">WORK EMAIL *</label><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@institution.com *" className={`w-full border rounded-xl px-4 py-[13px] text-[14px] mt-1.5 ${errors.email?'border-red-500 bg-red-50':'border-gray-200 bg-gray-50'}`}/>{errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}<div className="h-4"></div>
              <label className="text-[11px] font-semibold tracking-widest text-gray-600">PASSWORD *</label><div className="relative mt-1.5"><input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="•••••••• *" className={`w-full border rounded-xl px-4 py-[13px] text-[14px] pr-14 ${errors.password?'border-red-500 bg-red-50':'border-gray-200 bg-gray-50'}`}/><button type="button" onClick={()=>setShow(!show)} className="absolute right-2 top-[6px] bg-white border text-[11px] px-3 py-1.5 rounded-lg">{show?'Hide':'Show'}</button></div>{errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
              <div className="flex justify-between items-center mt-3"><span className="text-[11px] text-gray-400">powered by Baigamats Technologies</span><Link href="/forgot-password" className="text-[12px] font-medium underline">Forgot?</Link></div>
              <button disabled={loading} type="submit" className="w-full bg-black text-white rounded-xl py-[13px] text-[14px] font-semibold mt-6">{loading?'Signing in...':'Sign In * →'}</button>
            </form>
            <div className="mt-6 pt-6 border-t text-center"><p className="text-[12px] text-gray-500">New institution? <Link href="/signup" className="font-semibold text-black underline">Start Free Trial</Link> • <Link href="/pricing" className="font-semibold text-black underline">Go Pro</Link></p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
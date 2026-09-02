"use client"
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Login(){
  const router = useRouter();
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [show,setShow]=useState(false);
  const [loading,setLoading]=useState(false);
  const [errors,setErrors]=useState<any>({});

  function validate(){
    const e:any={};
    if(!email.trim()) e.email='Email is required *';
    else if(!email.includes('@')) e.email='Valid email required *';
    if(!password) e.password='Password is required *';
    setErrors(e);
    return Object.keys(e).length===0;
  }

  async function handleLogin(e:any){
    e.preventDefault();
    if(!validate()) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if(error){ alert('❌ '+error.message); return; }
    router.push('/people-space');
  }

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Left Branding - Multi Tenancy */}
      <div className="hidden lg:flex w-[55%] bg-[#0A0F1F] text-white p-10 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -mr-40 -mt-40"></div>
        <div>
          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold">B</div><h1 className="text-xl font-bold tracking-tight">BaigaMats</h1><span className="text-[10px] bg-white/10 px-2 py-1 rounded-full ml-2">MULTI-TENANT HRMS</span></div>
        </div>
        <div className="relative z-10">
          <h2 className="text-[56px] font-bold leading-[0.9] tracking-tight">Manage<br/>People.<br/><span className="text-[#7C93FF]">Simply.</span></h2>
          <p className="text-white/60 mt-6 max-w-[380px] text-[15px] leading-relaxed">One platform for Leave, Expenses, Logistics, Recognition. Each company gets isolated workspace. Secure. Scalable. Mandatory * fields enforced.</p>
          <div className="flex gap-3 mt-8"><div className="bg-white/10 border border-white/10 rounded-2xl p-4"><p className="text-2xl font-bold">500+</p><p className="text-[11px] text-white/50">Companies</p></div><div className="bg-white/10 border border-white/10 rounded-2xl p-4"><p className="text-2xl font-bold">100%</p><p className="text-[11px] text-white/50">Isolated Data</p></div></div>
        </div>
        <p className="text-[11px] text-white/30">© 2026 BaigaMats • Multi-Tenancy Architecture</p>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px]">
          <div className="bg-white p-8 rounded-[28px] border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            <div className="mb-7"><h1 className="text-[24px] font-bold tracking-tight">Welcome back 👋</h1><p className="text-[13px] text-gray-500 mt-1">Login to your organization workspace — All * mandatory</p></div>

            <form onSubmit={handleLogin}>
              <label className="text-[11px] font-semibold tracking-widest text-gray-600">WORK EMAIL *</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com *" className={`w-full border rounded-xl px-4 py-[13px] text-[14px] mt-1.5 outline-none focus:ring-2 focus:ring-black/10 transition ${errors.email?'border-red-500 bg-red-50':'border-gray-200 bg-gray-50 focus:bg-white'}`}/>
              {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              <div className="h-4"></div>

              <label className="text-[11px] font-semibold tracking-widest text-gray-600">PASSWORD *</label>
              <div className="relative mt-1.5">
                <input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="•••••••• *" className={`w-full border rounded-xl px-4 py-[13px] text-[14px] pr-14 outline-none focus:ring-2 focus:ring-black/10 transition ${errors.password?'border-red-500 bg-red-50':'border-gray-200 bg-gray-50 focus:bg-white'}`}/>
                <button type="button" onClick={()=>setShow(!show)} className="absolute right-2 top-[6px] bg-white border text-[11px] px-3 py-1.5 rounded-lg font-medium hover:bg-gray-50">{show?'Hide':'Show'}</button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}

              <div className="flex justify-end mt-3"><Link href="/forgot-password" className="text-[12px] font-medium text-gray-600 hover:text-black underline">Forgot password?</Link></div>

              <button disabled={loading} type="submit" className="w-full bg-black text-white rounded-xl py-[13px] text-[14px] font-semibold mt-6 hover:bg-zinc-800 disabled:bg-gray-300 transition">{loading?'Signing in...':'Sign In * →'}</button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-[12px] text-gray-500">Don't have workspace? <Link href="/signup" className="font-semibold text-black underline">Create Organization Account</Link></p>
              <p className="text-[10px] text-gray-400 mt-3">* Mandatory fields • Multi-tenant isolation enabled</p>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-6">Secure login • Tenant isolated • Supabase Auth</p>
        </div>
      </div>
    </div>
  )
}
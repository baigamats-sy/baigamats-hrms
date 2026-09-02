"use client"
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

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
    if(!email.includes('@')) e.email='Valid email required *';
    if(!password) e.password='Password is required *';
    setErrors(e);
    return Object.keys(e).length===0;
  }

  async function handleLogin(e:any){
    e.preventDefault();
    if(!validate()) return;
    setLoading(true);
    const {data,error} = await supabase.auth.signInWithPassword({email,password});
    setLoading(false);
    if(error){ alert(error.message); return; }
    router.push('/people-space');
  }

  return (
    <div className="min-h-screen flex bg-[#F5F7FB]">
      <div className="hidden md:flex w-[50%] bg-[#0B1220] text-white p-12 flex-col justify-between">
        <div><h1 className="text-2xl font-bold">BaigaMats HRMS</h1></div>
        <div><h2 className="text-4xl font-bold">Manage<br/>People.<br/>Simply.</h2></div>
        <p className="text-xs text-white/40">© 2026 BaigaMats</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <form onSubmit={handleLogin} className="w-full max-w-[380px] bg-white p-8 rounded-[24px] border shadow-sm">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">All * mandatory</p>
          <label className="text-xs font-medium">Work Email *</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@baigamats.com *" className={`w-full border rounded-xl px-4 py-3 text-sm mt-1 mb-2 ${errors.email?'border-red-500 bg-red-50':''}`} />
          {errors.email && <p className="text-[11px] text-red-500 mb-3">{errors.email}</p>}
          <label className="text-xs font-medium">Password *</label>
          <div className="relative mt-1">
            <input type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="******** *" className={`w-full border rounded-xl px-4 py-3 text-sm ${errors.password?'border-red-500 bg-red-50':''}`} />
            <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-3 text-xs">{show?'Hide':'Show'}</button>
          </div>
          {errors.password && <p className="text-[11px] text-red-500 mt-1 mb-3">{errors.password}</p>}
          <button disabled={loading} type="submit" className="w-full bg-black text-white rounded-xl py-3 text-sm font-semibold mt-5">{loading?'Signing in...':'Sign In *'}</button>
        </form>
      </div>
    </div>
  )
}
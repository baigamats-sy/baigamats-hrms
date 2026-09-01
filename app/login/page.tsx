'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage(){
  const [show,setShow]=useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white rounded-2xl border p-8 w-full max-w-[380px]">
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold">B</div>
        <h1 className="text-2xl font-bold mt-6">Sign in</h1>
        <p className="text-sm text-gray-500 mt-2">Your email will take you to your company</p>
        <input className="mt-6 w-full h-12 rounded-xl border px-4 bg-gray-50" placeholder="you@company.com" />
        <input type="password" className="mt-3 w-full h-12 rounded-xl border px-4 bg-gray-50" placeholder="Password" />
        <Link href="/forgot-password" className="text-xs underline mt-3 block">Forgot password?</Link>
        <button className="mt-4 w-full h-12 bg-black text-white rounded-xl">Sign In</button>
        <p className="text-sm text-center mt-6">New? <Link href="/get-started" className="underline font-bold">Get Started Free - 14 days</Link></p>
      </div>
    </div>
  )
}
"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const router = useRouter();
  async function login() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message); else router.push("/");
    setLoading(false);
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border">
        <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-6">B</div>
        <h1 className="text-2xl font-bold">Baigamats HRMS</h1>
        <p className="text-gray-500 text-sm mt-1 mb-8">Login to access your portal</p>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 border rounded-xl mb-3 outline-none focus:ring-2 focus:ring-green-500" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 border rounded-xl mb-6 outline-none focus:ring-2 focus:ring-green-500" />
        <button onClick={login} disabled={loading} className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-black">{loading ? "Signing in..." : "Sign In"}</button>
        <p className="text-xs text-gray-400 mt-6 text-center">Pool: UGX 82,986,600 • Secure</p>
      </div>
    </div>
  )
}
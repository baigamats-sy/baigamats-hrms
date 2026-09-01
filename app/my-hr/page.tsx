'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function MyHRPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ type: 'Annual', start_date: '', end_date: '', reason: '' });

  const fetchLeaves = async () => {
    const { data, error } = await supabase.from('leave_requests').select('*').order('created_at', { ascending: false });
    console.log('Fetched:', data, error);
    if (data) setLeaves(data);
  };
  useEffect(() => { fetchLeaves(); }, []);

  const submitLeave = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('leave_requests').insert({
      employee_name: 'Current User', type: form.type, start_date: form.start_date, end_date: form.end_date, reason: form.reason, status: 'Pending'
    });
    if (!error) {
      await fetchLeaves();
      setForm({ type: 'Annual', start_date: '', end_date: '', reason: '' });
      alert('✅ Saved! Check Supabase Table Editor — it is there!');
    } else alert(error.message);
    setLoading(false);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">02 My HR Portal • LIVE DB ✓</h1>
      <p className="text-gray-500 mb-6">Total in DB: {leaves.length} — Connected to Supabase</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-4">Request Leave</h2>
          <form onSubmit={submitLeave} className="space-y-3">
            <select value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="w-full border p-2 rounded"><option>Annual</option><option>Sick</option><option>Maternity</option><option>Unpaid</option></select>
            <input type="date" required value={form.start_date} onChange={e=>setForm({...form, start_date: e.target.value})} className="w-full border p-2 rounded" />
            <input type="date" required value={form.end_date} onChange={e=>setForm({...form, end_date: e.target.value})} className="w-full border p-2 rounded" />
            <textarea required placeholder="Reason" value={form.reason} onChange={e=>setForm({...form, reason: e.target.value})} className="w-full border p-2 rounded" />
            <button disabled={loading} className="w-full bg-emerald-600 text-white p-3 rounded font-bold">{loading? 'Saving...' : 'Submit to Supabase'}</button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-4">My Requests ({leaves.length})</h2>
          <button onClick={fetchLeaves} className="text-xs bg-gray-100 px-2 py-1 rounded mb-3">↻ Refresh</button>
          <div className="space-y-2 max-h-[400px] overflow-auto">
            {leaves.map((l:any)=><div key={l.id} className="border p-3 rounded"><div className="font-bold text-sm">{l.type} • {l.status}</div><div className="text-xs text-gray-500">{l.start_date} → {l.end_date}</div><div className="text-xs mt-1">{l.reason}</div></div>)}
            {leaves.length===0 && <p className="text-gray-400 text-sm">Click Refresh — data is in Supabase Table Editor!</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
export default function AssetsPage(){
  const [assets, setAssets] = useState<any[]>([]);
  const [form, setForm] = useState({asset_name:'', category:'Laptop', serial_number:'', assigned_to:''});
  const load = async () => { const {data}=await supabase.from('company_assets').select('*').order('created_at',{ascending:false}); if(data) setAssets(data); };
  useEffect(()=>{load();},[]);
  const add = async (e:any) => {
    e.preventDefault();
    const {error}=await supabase.from('company_assets').insert({...form, status:'Assigned'});
    if(!error){ setForm({asset_name:'', category:'Laptop', serial_number:'', assigned_to:''}); load(); alert('Asset Added ✓'); } else alert(error.message);
  };
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">07 Assets - LIVE DB</h1>
      <p className="text-gray-500 mb-6">{assets.length} assets tracked</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Add Asset</h2>
          <form onSubmit={add} className="space-y-3">
            <input required placeholder="Asset Name (e.g. MacBook Pro)" value={form.asset_name} onChange={e=>setForm({...form,asset_name:e.target.value})} className="w-full border p-2 rounded"/>
            <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border p-2 rounded"><option>Laptop</option><option>Phone</option><option>Monitor</option><option>Desk</option><option>Other</option></select>
            <input placeholder="Serial Number" value={form.serial_number} onChange={e=>setForm({...form,serial_number:e.target.value})} className="w-full border p-2 rounded"/>
            <input placeholder="Assigned To (Employee Name)" value={form.assigned_to} onChange={e=>setForm({...form,assigned_to:e.target.value})} className="w-full border p-2 rounded"/>
            <button className="w-full bg-orange-600 text-white p-3 rounded font-bold">Assign Asset</button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">Inventory ({assets.length})</h2>
          <div className="space-y-2">
            {assets.map((a:any)=><div key={a.id} className="border p-3 rounded flex justify-between"><div><div className="font-bold">{a.asset_name}</div><div className="text-xs text-gray-500">{a.category} - {a.serial_number}</div></div><div className="text-xs bg-gray-100 px-2 py-1 rounded h-fit">{a.assigned_to || 'Unassigned'}</div></div>)}
          </div>
        </div>
      </div>
    </div>
  )
}


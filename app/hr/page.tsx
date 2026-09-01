'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
export default function ApprovalQueue() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const load = async () => {
    const { data } = await supabase.from('leave_requests').select('*').eq('status','Pending').order('created_at', {ascending:false});
    if(data) setLeaves(data);
  };
  useEffect(()=>{ load(); }, []);
  const updateStatus = async (id:string, status:string) => {
    console.log('Updating', id, status);
    const { data, error } = await supabase.from('leave_requests').update({ status }).eq('id', id).select();
    if(error){ alert('ERROR: ' + error.message); console.error(error); }
    else { alert(status + ' SUCCESS!'); load(); }
  };
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-2">03 Approval Queue (HR Only) - LIVE DB</h1>
      <p className="text-gray-500 mb-6">Pending: {leaves.length}</p>
      <button onClick={load} className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm">Refresh</button>
      <div className="space-y-3">
        {leaves.map((l:any)=>(
          <div key={l.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
            <div><div className="font-bold">{l.employee_name} - {l.type}</div><div className="text-sm text-gray-500">{l.start_date} to {l.end_date} - {l.reason}</div></div>
            <div className="flex gap-2">
              <button onClick={()=>updateStatus(l.id,'Approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded font-bold">Approve</button>
              <button onClick={()=>updateStatus(l.id,'Rejected')} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-bold">Reject</button>
            </div>
          </div>
        ))}
        {leaves.length===0 && <div className="bg-white p-8 rounded text-center text-gray-400">No pending - Create one in /my-hr</div>}
      </div>
    </div>
  )
}


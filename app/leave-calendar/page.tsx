'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function LeaveCalendarPage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('leave_requests').select('*').order('start_date');
      if (data) setLeaves(data);
    };
    load();
  }, []);
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">06 Leave Calendar - LIVE</h1>
      <div className="bg-white rounded-xl shadow p-6">
        <div className="space-y-2">
          {leaves.map((l:any) => (
            <div key={l.id} className="p-3 border rounded flex justify-between">
              <span>{l.employee_name} - {l.type}</span>
              <span className="text-sm text-gray-500">{l.start_date} to {l.end_date}</span>
              <span className="px-2 py-1 rounded text-xs bg-yellow-100">{l.status}</span>
            </div>
          ))}
          {leaves.length===0 && <p className="text-gray-400">No leave scheduled</p>}
        </div>
      </div>
    </div>
  )
}

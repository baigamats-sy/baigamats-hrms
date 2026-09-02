"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PeopleSpace() {
  const [activeTab, setActiveTab] = useState('my-workspace');
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data: employee } = await supabase.from('employees')
      .select('*, org_units(name), roles(name, data_scope)')
      .eq('auth_user_id', user.id).single();
    setMe(employee);
    setLoading(false);
  }

  async function createRequest(type: string) {
    if (!me) return;
    await supabase.from('requests').insert({
      organisation_id: me.organisation_id,
      requester_id: me.id,
      module: 'people',
      request_type: type,
      data: { requested_at: new Date() },
      status: 'pending'
    });
    alert(type + ' submitted for approval');
  }

  if (loading) return <div className="p-8">Loading People Space...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold">People Space</h1>
      <p className="text-gray-500 mb-6">{me?.full_name} • {me?.roles?.name} • {me?.org_units?.name}</p>

      <div className="flex gap-2 mb-6 border-b">
        {['my-workspace','directory','org-structure','approvals'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 capitalize ${activeTab===tab ? 'border-b-2 border-black font-semibold' : 'text-gray-500'}`}>{tab.replace('-',' ')}</button>
        ))}
      </div>

      {activeTab==='my-workspace' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border">
            <h3 className="font-bold mb-3">My Profile</h3>
            <input defaultValue={me?.full_name} className="w-full border p-2 rounded mb-2" placeholder="Full name" />
            <button onClick={() => createRequest('profile_change')} className="w-full bg-black text-white p-2 rounded">Request Change - Needs HR Approval</button>
          </div>
          <div className="bg-white p-5 rounded-xl border">
            <h3 className="font-bold mb-3">Logistics</h3>
            <select className="w-full border p-2 rounded mb-3"><option>Laptop</option><option>Bag</option><option>ID Card</option></select>
            <button onClick={() => createRequest('logistics')} className="w-full bg-blue-600 text-white p-2 rounded">Request Item</button>
          </div>
          <div className="bg-white p-5 rounded-xl border">
            <h3 className="font-bold mb-3">Expense / Advance</h3>
            <input type="number" placeholder="Amount UGX" className="w-full border p-2 rounded mb-3" />
            <button onClick={() => createRequest('expense')} className="w-full bg-green-600 text-white p-2 rounded">Submit Request</button>
          </div>
        </div>
      )}
    </div>
  );
}
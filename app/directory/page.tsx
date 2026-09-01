"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DirectoryPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("employees").select("*").order("full_name");
      setStaff(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const depts = ["All", ...Array.from(new Set(staff.map(s => s.department || s.dept || "General")))];
  
  const filtered = staff.filter(s => {
    const matchSearch = `${s.full_name} ${s.email} ${s.role}`.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "All" || (s.department || s.dept || "General") === deptFilter;
    return matchSearch && matchDept;
  });

  if (loading) return <div className="p-8 flex justify-center"><div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-green-600 text-white w-10 h-10 rounded-xl flex items-center justify-center">07</span>
                Staff Directory
              </h1>
              <p className="text-gray-500 mt-2">{staff.length} team members • Baigamats HR • Live</p>
            </div>
            <div className="flex gap-2">
              <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">● Live DB</span>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <div className="flex-1 relative">
              <input 
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, email, role..."
                className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
              <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
            </div>
            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-4 py-3 border rounded-xl bg-white min-w-[160px]">
              {depts.map(d => <option key={d} value={d}>{d} Dept</option>)}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => {
            const initial = (s.full_name || s.name || "U").charAt(0).toUpperCase();
            return (
              <div key={s.id} className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition-all hover:-translate-y-1">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 text-white flex items-center justify-center text-xl font-bold shadow">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{s.full_name || s.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{s.email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">{s.role || s.position || "Staff"}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{s.department || s.dept || "General"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-gray-400 text-xs">SALARY</p><p className="font-semibold">UGX {Number(s.salary || 0).toLocaleString()}</p></div>
                  <div><p className="text-gray-400 text-xs">STATUS</p><p className="text-green-600 font-semibold">● Active</p></div>
                </div>

                <div className="mt-4 flex gap-2">
                  <a href={`mailto:${s.email}`} className="flex-1 bg-gray-900 text-white text-sm py-2.5 rounded-xl text-center font-medium hover:bg-black">Email</a>
                  <a href={`https://wa.me/${s.phone || ''}`} target="_blank" className="flex-1 bg-green-600 text-white text-sm py-2.5 rounded-xl text-center font-medium hover:bg-green-700">WhatsApp</a>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl mt-4 border">
            <p className="text-gray-400">No staff found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

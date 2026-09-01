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

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false });
      setStaff(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-8">Loading directory...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">07 Staff Directory</h1>
      <p className="text-gray-600 mb-6">All staff contact + roles + departments - LIVE DB ({staff.length} staff)</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((s) => (
          <div key={s.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <h3 className="font-bold text-lg">{s.full_name || s.name}</h3>
            <p className="text-sm text-blue-600">{s.email}</p>
            <div className="mt-2 text-sm">
              <p><span className="font-semibold">Role:</span> {s.role || s.position || "Staff"}</p>
              <p><span className="font-semibold">Dept:</span> {s.department || s.dept || "General"}</p>
              <p><span className="font-semibold">Salary:</span> UGX {Number(s.salary || 0).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      {staff.length === 0 && <p>No staff found.</p>}
    </div>
  );
}

$pages = @(
@{p="portal"; t="My HR Portal"; d="Self service portal"},
@{p="approvals"; t="Approval Queue"; d="Leave approvals"},
@{p="employees"; t="Employee Files"; d="Master data"},
@{p="leave"; t="Leave Calendar"; d="Calendar view"},
@{p="payslips"; t="Payslips"; d="Monthly slips"},
@{p="directory"; t="Staff Directory"; d="Team contacts"},
@{p="payroll"; t="Payroll Engine"; d="UGX 82,986,600 pool"},
@{p="audit"; t="Audit Log"; d="System logs"},
@{p="notifications"; t="Notifications"; d="Alerts center"},
@{p="settings"; t="Settings"; d="System config"},
@{p="reports"; t="Reports"; d="HR analytics"},
@{p="attendance"; t="Attendance"; d="Clock in/out"},
@{p="assets"; t="Assets"; d="Company assets"},
@{p="recruitment"; t="Recruitment"; d="Hiring pipeline"},
@{p="ceo"; t="CEO Dashboard"; d="Executive view"}
)
foreach ($pg in $pages) {
  $dir = "app\$($pg.p)"
  if (!(Test-Path $dir)) { mkdir $dir | Out-Null }
  $content = "'use client'; import Link from 'next/link'; export default function Page(){return (<div className='min-h-screen bg-[#f6f7f9] flex'><aside className='w-64 bg-gray-900 text-white flex-col p-6 fixed h-full hidden md:flex'><div className='flex items-center gap-3 mb-10'><div className='w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center font-bold'>B</div><div><p className='font-bold text-sm'>BAIGAMATS</p><p className='text-xs text-gray-400'>TECHNOLOGIES</p></div></div><nav className='space-y-1 flex-1'><Link href='/' className='flex gap-3 px-3 py-2.5 hover:bg-white/5 rounded-xl text-sm text-gray-400'>Dashboard</Link><Link href='/directory' className='flex gap-3 px-3 py-2.5 bg-white/10 rounded-xl text-sm font-medium'>Directory</Link></nav><div className='bg-white/5 rounded-xl p-3 text-xs'><p className='text-gray-400'>Pool</p><p className='font-bold'>UGX 82,986,600</p></div></aside><main className='flex-1 md:ml-64'><header className='bg-white border-b px-8 py-4 flex justify-between items-center'><Link href='/'>Back</Link><span className='bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-bold'>LIVE</span></header><div className='p-8'><h1 className='text-3xl font-bold'>$($pg.t)</h1><p className='text-gray-500'>$($pg.d)</p><div className='mt-8 bg-white rounded-2xl border p-8'>Module ready. Status Active.</div></div></main></div>)}"
  Set-Content -Path "$dir\page.tsx" -Value $content
}

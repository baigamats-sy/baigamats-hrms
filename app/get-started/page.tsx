import Link from 'next/link';

export default function Forgot(){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-8">
      <div className="bg-white rounded-2xl border p-8 w-full max-w-[400px]">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="text-sm text-gray-500 mt-2">We will send OTP to your email</p>
        <input className="mt-6 w-full h-12 rounded-xl border px-4" placeholder="you@company.com" />
        <button className="mt-4 w-full h-12 bg-black text-white rounded-xl">Send OTP</button>
        <Link href="/login" className="text-sm underline mt-6 block text-center">Back to login</Link>
      </div>
    </div>
  )
}
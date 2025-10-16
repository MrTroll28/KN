import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login(){
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@hub.dev');
  const [password, setPassword] = useState('Admin@123');

  const submit = async (e)=>{
    e.preventDefault();
    try { await login(email, password); window.location.href = '/'; }
    catch (e){ alert(e.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-96 space-y-3">
        <h1 className="text-xl font-semibold text-center">Đăng nhập</h1>
        <input className="w-full border px-3 py-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border px-3 py-2 rounded" placeholder="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-indigo-600 text-white py-2 rounded">Đăng nhập</button>
      </form>
    </div>
  );
}

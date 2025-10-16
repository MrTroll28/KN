import Navbar from '../components/Navbar.jsx';
import { api } from '../lib/fetcher';
import { useEffect, useState } from 'react';

export default function AdminUsers(){
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ email:'', password:'', name:'', role:'USER' });

  async function load(){ setList(await api('/users', { auth:true })); }
  useEffect(()=>{ load(); }, []);

  async function submit(e){
    e.preventDefault();
    await api('/users', { method:'POST', auth:true, body: form });
    setForm({ email:'', password:'', name:'', role:'USER' });
    load();
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-4">
        <h2 className="text-lg font-semibold mb-3">Quản lý người dùng</h2>
        <form onSubmit={submit} className="flex gap-2 items-end mb-4 flex-wrap">
          <input className="border px-2 py-1 rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input className="border px-2 py-1 rounded" placeholder="Mật khẩu" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
          <input className="border px-2 py-1 rounded" placeholder="Tên" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <select className="border px-2 py-1 rounded" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
            <option>USER</option>
            <option>ADMIN</option>
          </select>
          <button className="px-3 py-1 rounded bg-indigo-600 text-white">Thêm</button>
        </form>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-50">
              <th className="border p-2">ID</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Tên</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Tạo lúc</th>
            </tr>
          </thead>
          <tbody>
            {list.map(u=> (
              <tr key={u.id}>
                <td className="border p-2">{u.id}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.name||'-'}</td>
                <td className="border p-2">{u.role}</td>
                <td className="border p-2">{new Date(u.createdAt).toLocaleString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

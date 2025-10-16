import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="font-bold">ScheduleHub</div>
      <div className="flex items-center gap-3">
        <Link to="/">Bảng lịch</Link>
        {user?.role === "ADMIN" && (
          <Link to="/admin/users">Quản lý người dùng</Link>
        )}
        {user?.role === "ADMIN" && <Link to="/admin/summary">Tổng hợp</Link>}
        <span className="text-gray-600">{user?.email}</span>
        <button onClick={logout} className="px-3 py-1 rounded border">
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

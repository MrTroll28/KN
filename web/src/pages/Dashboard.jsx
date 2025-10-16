import Navbar from '../components/Navbar.jsx';
import ScheduleGrid from '../components/ScheduleGrid.jsx';

export default function Dashboard(){
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-lg font-semibold">Lịch cá nhân (5 khung giờ/ngày)</h2>
        <ScheduleGrid />
      </div>
    </div>
  );
}

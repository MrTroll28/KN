export default function WeekPicker({ value, onChange }){
  const toInputValue = (d)=> d.toISOString().slice(0,10);
  const handle = (e)=> onChange(new Date(e.target.value));
  return (
    <div className="flex items-center gap-2">
      <label className="font-medium">Chọn tuần bắt đầu: </label>
      <input type="date" value={toInputValue(value)} onChange={handle} className="border px-2 py-1 rounded" />
    </div>
  );
}

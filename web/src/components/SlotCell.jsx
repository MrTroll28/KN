export default function SlotCell({ active, label, onToggle }){
  return (
    <button onClick={onToggle}
      className={`px-2 py-1 rounded border text-sm ${active? 'bg-green-500 text-white':'bg-white hover:bg-gray-100'}`}
      title={label}
    >{label}{active? ' ✓':''}</button>
  );
}

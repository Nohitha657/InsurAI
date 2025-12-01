export default function Sidebar({ selected, setSelected }) {
  const options = ["Profile", "Dashboard", "Appointments", "Agents", "Plans"];
  return (
    <nav className="flex flex-col space-y-2">
      {options.map(opt => (
        <button
          key={opt}
          className={`block p-2 rounded text-left hover:bg-blue-100 ${selected === opt ? "bg-blue-600 text-white" : "text-blue-700"}`}
          onClick={() => setSelected(opt)}
        >
          {opt}
        </button>
      ))}
    </nav>
  );
}

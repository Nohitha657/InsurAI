import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";

export function AddUserForm({ onAdd }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      toast.error("Please fill all fields.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAdd(form);
      toast.success("User added!");
      setForm({ fullName: "", email: "", password: "" });
    }, 700);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold text-blue-700 flex gap-2 items-center mb-2">
        <UserPlus /> Add User
      </h2>
      <input
        type="text"
        placeholder="Full Name"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.fullName}
        onChange={e => setForm({ ...form, fullName: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border text-black border-blue-200 rounded-lg p-2"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 shadow"
        disabled={isLoading}
      >
        {isLoading ? "Adding..." : "Add User"}
      </button>
    </form>
  );
}

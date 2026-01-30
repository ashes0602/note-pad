"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewNotePage() {
  const router = useRouter();
    const [form, setForm] = useState({color: "", title: "", content: "",textcolor:"" });
    useEffect(()=>{
      const store=JSON.parse(localStorage.getItem("formData")||"{}");
      setForm(store);
    },[]);
    


  const handleSave = async () => {
  if (!form.content) return;
  try {
    const res = await fetch("http://localhost:5000/auth/createpage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    // ✅ Save new note into local state + storage
    const existing = JSON.parse(localStorage.getItem("notes") || "[]");
    const updated = [...existing, data];
    localStorage.setItem("notes", JSON.stringify(updated));

    router.push("/home");
  } catch (error) {
    console.error(error);
    alert("Failed to Save");
  }
};

  
  // main
  return (
    <div className="bg-gray-100 px-7 py-7 pt-30">
      <h1 className="text-3xl font-bold text-green-900 text-center">{form.title}</h1>
    
         <h2 className="text-2xl text-green-900 font-bold mb-4">Create New Note</h2>

        <textarea
          placeholder="Content..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full h-150 text-gray-400 bg-white border  rounded-lg px-3 py-2 mb-3 leading-10"
          style={{ backgroundColor: form.color }}
          rows="3"
        />

        <div className="flex justify-between">
          <button
            onClick={() => router.push("/home")}
            className="px-3 py-1 absolute top-4 left-4 bg-gray-600 rounded-lg hover:bg-gray-500"
          >
             ✕
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 bg-green-900 absolute top-4 right-4 text-white rounded-lg hover:bg-green-700"
          >
            Save
          </button>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Add the color utility functions here too
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

const isLightColor = (color) => {
  const rgb = hexToRgb(color);
  if (!rgb) return true;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
};

const getTextColor = (backgroundColor) => {
  if (isLightColor(backgroundColor)) {
    const rgb = hexToRgb(backgroundColor);
    if (!rgb) return '#000000';
    const darkenedR = Math.max(0, Math.floor(rgb.r * 0.4));
    const darkenedG = Math.max(0, Math.floor(rgb.g * 0.4));
    const darkenedB = Math.max(0, Math.floor(rgb.b * 0.4));
    return rgbToHex(darkenedR, darkenedG, darkenedB);
  } else {
    const rgb = hexToRgb(backgroundColor);
    if (!rgb) return '#ffffff';
    const lightenedR = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * 0.7));
    const lightenedG = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * 0.7));
    const lightenedB = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * 0.7));
    return rgbToHex(lightenedR, lightenedG, lightenedB);
  }
};

export default function NewNotePage() {
  const router = useRouter();
  const [form, setForm] = useState({color: "", title: "", content: "", textcolor: "" });
  
  useEffect(() => {
    const store = JSON.parse(localStorage.getItem("formData") || "{}");
    // Ensure textcolor is set
    if (store.color && !store.textcolor) {
      store.textcolor = getTextColor(store.color);
    }
    setForm(store);
  }, []);

  const handleSave = async () => {
    if (!form.content) {
      alert("Please add content to your note");
      return;
    }
    
    // Ensure textcolor is calculated before saving
    const dataToSave = {
      ...form,
      textcolor: form.textcolor || getTextColor(form.color)
    };

    try {
      const res = await fetch("http://localhost:5000/auth/createpage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Note saved:", data);

      // Clear localStorage after successful save
      localStorage.removeItem("formData");

      router.push("/home");
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to Save: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-7 py-7">
      <h1 className="text-3xl font-bold text-green-900 text-center mb-8">
        {form.title || "Untitled Note"}
      </h1>
    
      <h2 className="text-2xl text-green-900 font-bold mb-4">Create New Note</h2>

      <textarea
        placeholder="Start writing your note..."
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
        className="w-full h-96 border rounded-lg px-4 py-3 mb-3 leading-7 focus:outline-none focus:ring-2 focus:ring-green-900"
        style={{ 
          backgroundColor: form.color,
          color: form.textcolor || getTextColor(form.color)
        }}
        rows="10"
      />

      <div className="flex justify-between">
        <button
          onClick={() => {
            localStorage.removeItem("formData");
            router.push("/home");
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
        >
          ✕ Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!form.content}
          className="px-4 py-2 bg-green-900 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          💾 Save Note
        </button>
      </div>
    </div>
  );
}
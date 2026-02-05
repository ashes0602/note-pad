"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Color utility functions
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

const darkenColor = (color, amount = 0.3) => {
  const rgb = hexToRgb(color);
  if (!rgb) return '#000000'; // fallback to black
  
  const darkenedR = Math.max(0, Math.floor(rgb.r * (1 - amount)));
  const darkenedG = Math.max(0, Math.floor(rgb.g * (1 - amount)));
  const darkenedB = Math.max(0, Math.floor(rgb.b * (1 - amount)));
  
  return rgbToHex(darkenedR, darkenedG, darkenedB);
};

// Check if color is light or dark to determine text visibility
const isLightColor = (color) => {
  const rgb = hexToRgb(color);
  if (!rgb) return true;
  
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
};

// Get appropriate text color based on background
const getTextColor = (backgroundColor) => {
  if (isLightColor(backgroundColor)) {
    return darkenColor(backgroundColor, 0.6); // Dark text for light backgrounds
  } else {
    // For dark backgrounds, lighten the color instead
    const rgb = hexToRgb(backgroundColor);
    if (!rgb) return '#ffffff';
    
    const lightenedR = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * 0.7));
    const lightenedG = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * 0.7));
    const lightenedB = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * 0.7));
    
    return rgbToHex(lightenedR, lightenedG, lightenedB);
  }
};

export default function Notepad() {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ color: "#fef3c7", title: "",textColor:"" });
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Available color options
  const colorOptions = [
    "#fef3c7", // yellow
    "#fecaca", // red
    "#bbf7d0", // green
    "#bfdbfe", // blue
    "#e9d5ff", // purple
    "#fed7d7", // pink
    "#fde68a", // amber
    "#c7d2fe", // indigo
    "#a7f3d0", // emerald
    "#fbb6ce"  // rose
  ];

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/getpages");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to load notes", err);
      }
    };
    fetchNotes();
  }, []);


const handleNext = () => {
  const textcolor = getTextColor(form.color); // Calculate text color
  const formWithTextColor = { ...form, textcolor }; // Add it to form data
  localStorage.setItem("formData", JSON.stringify(formWithTextColor));
  router.push("/home/page");
  setShowForm(false);
};


  const handleEdit = async (id, updatedNote) => {
    try {
      const res = await fetch(`http://localhost:5000/auth/updatepage/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
      });
      const data = await res.json();

      const newNotes = notes.map((note) => (note._id === id ? data : note));
      setNotes(newNotes);
    } catch (error) {
      alert("Fail to update");
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/auth/deletepage/${id}`, {
        method: "DELETE",
      });
      const updated = notes.filter((note) => note._id !== id);
      setNotes(updated);
    } catch (error) {
      alert("Fail to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl text-green-900 font-bold mb-6">📝 ASH's Notepad</h1>

      {/* Add Note */}
      <button
        onClick={() => setShowForm(true)}
        className="text-green-900 absolute top-4 right-4 px-4 py-2 transition"
      >
        ➕ Add Note
      </button>

      {/* Create Note Form */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl text-green-900 font-bold mb-4">Create New Note</h2>

            {/* Title Input */}
            <input
              type="text"
              placeholder="Note title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full text-gray-700 border px-3 py-2 rounded mb-4"
            />

            {/* Color Picker */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Choose Color:
              </label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setForm({ ...form, color })}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      form.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Background: ${color}, Text: ${getTextColor(color)}`}
                  >
                    {form.color === color && (
                      <div className="w-full h-full rounded-md flex items-center justify-center">
                        <span style={{ color: getTextColor(color) }}>✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Preview */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Preview:
              </label>
              <div
                className="w-full h-16 rounded-lg border flex items-center justify-center"
                style={{ 
                  backgroundColor: form.color,
                  textColor: getTextColor(form.color)
                }}
              >
                <span className="font-bold">
                  {form.title || "Your note title here"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Background: {form.color} | Text: {getTextColor(form.color)}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-3 py-1 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                disabled={!form.title.trim()}
                className="px-3 py-1 bg-green-900 text-white rounded-lg disabled:bg-gray-400"
              >
                Create Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {notes.map((note) => (
          <FlipCard
            key={note._id}
            note={note}
            id={note._id}
            onDelete={handleDelete}
            onEdit={handleEdit}
            setEditingNote={setEditingNote}
          />
        ))}
      </div>

      {/* Edit Note Modal */}
      {editingNote && (
        <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-300 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl text-green-900 font-bold mb-4">Edit Note</h2>

            <input
              type="text"
              value={editingNote.title}
              onChange={(e) =>
                setEditingNote({ ...editingNote, title: e.target.value })
              }
              className="w-full text-gray-500 border px-3 py-2 rounded mb-3"
            />

            <textarea
              value={editingNote.content || ""}
              onChange={(e) =>
                setEditingNote({ ...editingNote, content: e.target.value })
              }
              className="w-full h-60 text-gray-500 border px-3 py-2 rounded mb-3 resize-none"
              rows="4"
            />

            {/* Color Picker for Edit */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Change Color:
              </label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setEditingNote({ ...editingNote, color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      editingNote.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {editingNote.color === color && (
                      <div className="w-full h-full rounded-md flex items-center justify-center">
                        <span style={{ color: getTextColor(color) }}>✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Text color will be: {getTextColor(editingNote.color || '#fef3c7')}
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingNote(null)}
                className="px-3 py-1 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleEdit(editingNote._id, editingNote);
                  setEditingNote(null);
                }}
                className="px-3 py-1 bg-green-900 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------
   FlipCard
------------------------- */
function FlipCard({ note, id, onDelete, setEditingNote }) {
  const router = useRouter();
  const bg = note?.color || "#fef3c7";
  const textColor = getTextColor(bg);

  const handleOpen = () => {
    router.push(`/home/page/${id}`);
  };

  return (
    <div
      className="w-64 h-40 perspective cursor-pointer"
      
      
    >
      <div className="relative w-full h-full duration-700 transform-style-preserve-3d hover:rotate-y-180">
        {/* Front */}
        <div
          className="absolute w-full h-full flex items-center justify-center font-bold rounded-xl shadow-lg backface-hidden p-4"
          style={{ 
            backgroundColor: bg,
            color: textColor
          }}
        >
          <div className="text-center">{note.title}</div>
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full flex flex-col justify-between rounded-xl shadow-lg rotate-y-180 backface-hidden p-3"
          style={{ 
            backgroundColor: bg,
            color: textColor
          }}
        >
          <div className="flex justify-between items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete(id);
              }}
              className="font-bold text-xl px-2 py-1 rounded-lg bg-white text-red-600 shadow-sm"
              aria-label="Delete note"
            >
              ✕
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setEditingNote(note);
              }}
              className="font-bold text-sm px-2 py-1 rounded-lg bg-white text-blue-600 shadow-sm"
              aria-label="Edit note"
            >
              edit
            </button>
          </div>

          <p className="text-sm mt-2 break-words">
            {note.content?.length > 40
              ? note.content.slice(0, 40) + "..."
              : note.content}
          </p>
        </div>
      </div>
    </div>
  );
}
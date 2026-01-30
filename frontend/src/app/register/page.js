"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function Registerpage() {
const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [message, setMessage] = useState("");
   const [error , setError] = useState("");

  const handleSubmit =async (e)  => {
    e.preventDefault();
    
      // ✅ simple validation
    if (!email || !password || !cpassword) {
      setMessage("❌ Please fill all fields.");
      return;
    }

    if (password !== cpassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password,cpassword }),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registration successful! You can now log in.");
        alert("Registration successful!");
        router.push("/");
      } else {
        setMessage("❌ " + data.message);
         alert(data.message || "Registration failed.");
      }
    } catch (error) {
      setError(error);
      setMessage("❌ Something went wrong!");
    }
  };
   

   

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        
        <img src="/login.png"   alt="image" width={500} height={500}/>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-green-900 text-center mb-6">Registration</h1>

        {error && <p className="text-red-500">{error.message}</p>}


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 text-gray-400 border rounded-xl  shadow-sm focus:ring focus:ring-green-700 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 text-gray-400 border rounded-xl  shadow-sm focus:ring focus:ring-green-700 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              value={cpassword}
              onChange={(e) => setCpassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 text-gray-400 border rounded-xl  shadow-sm focus:ring focus:ring-green-700 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-900 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition"
          >
            Sign up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Have an account?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}

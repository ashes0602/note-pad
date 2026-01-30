"use client"; // only needed if you're using the Next.js App Router

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const[message,setMessage]=useState("");
  const route=useRouter();

  const handleSubmit =async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    // 🔹 Here you would call your backend API for login
    console.log("Login submitted:", { email, password });
  
    setError(""); // clear error
    
     try {
      const res=await fetch("http://localhost:5000/auth/login",{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({email,password})
      })
      const data = await res.json();
      if(res.ok){
        localStorage.setItem("token", data.token); // Save JWT
        setMessage("✅ Login successful!");
        alert("Login successful!");
        route.push("/home");
      } else {
        setMessage("❌ " + data.message);
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      alert("❌ Something went wrong!");
    }
  };

    

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <img src="/login.png"   alt="image" width={500} height={500}/>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-green-900 text-center mb-6">Login</h1>

        {error && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 text-gray-400 border  rounded-xl shadow-sm focus:ring focus:ring-green-700 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 text-gray-400 border rounded-xl shadow-sm focus:ring focus:ring-green-700 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          
          <button
            type="submit"
            className="w-full bg-green-900 text-white py-2 px-4 rounded-xl hover:bg-green-700 transition"
          >
            Login
          </button>
          
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

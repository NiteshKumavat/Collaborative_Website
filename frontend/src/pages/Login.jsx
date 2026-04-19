import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const { login, isLoggingIn, googleAuthentication } = useAuthStore();

    const handleSubmit = (e) => {
        e.preventDefault();
        login(formData);
    };


    return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0B0C15]">

        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />

        <div className="w-full max-w-md p-8 rounded-2xl glass-card relative z-10 mx-4 border border-white/10 bg-[#151725]/60 backdrop-blur-xl">
        
            <div className="text-center mb-8">
                <div className="inline-block p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
                    <img src="/logo-removebg-preview.png" alt="Logo" className="w-10 h-10 object-contain" />
                </div>
                <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                <p className="text-gray-400 text-sm mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Email Address</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                        <Mail size={18} />
                    </div>
                    <input
                        type="email"
                        className="input-field pl-10 bg-[#0B0C15]/50 border-white/10 focus:border-indigo-500"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
                    {/* FORGOT PASSWORD LINK */}
                    <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300">
                        Forgot Password?
                    </Link>
                </div>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
                        <Lock size={18} />
                    </div>
                    <input
                        type="password"
                        className="input-field pl-10 bg-[#0B0C15]/50 border-white/10 focus:border-indigo-500"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
            </div>

                <button type="submit" className="w-full btn-primary-glow py-3 flex items-center justify-center gap-2 group" disabled={isLoggingIn}>
                    {isLoggingIn ? <Loader2 className="animate-spin" /> : "Sign In"}
                </button>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-[#191b2b] text-gray-500">Or continue with</span>
                    </div>
                </div>
                <div className="mt-6">
                    <GoogleLogin 
                        onSuccess={googleAuthentication}
                        onError={() =>{
                            console.log("Google Login Failed")
                        }}
                    />
                </div>
            </div>

            <div className="mt-8 text-center pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                    Create a new account{" "}
                    <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
                    Sign Up
                    </Link>
                </p>
            </div>
        </div>
    </div>
  );
}
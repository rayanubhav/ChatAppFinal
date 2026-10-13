import React, { useState } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../apiClient.js";
import { useAuth } from "../Context/AuthProvider.jsx";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { BsChatSquareTextFill } from "react-icons/bs";

function Login() {
  const [, setAuthUser] = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const userInfo = {
      email: data.email.trim().toLowerCase(),
      password: data.password,
    };

    try {
      const response = await apiClient.post("/user/login", userInfo);
      if (response.data) {
        toast.success("Welcome back!");
        localStorage.setItem("messenger", JSON.stringify(response.data));
        setAuthUser(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#090d16] overflow-hidden px-4 py-8">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-float-slow" style={{ animationDelay: "-4s" }}></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/30 mb-3">
            <BsChatSquareTextFill className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Talk<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">ie</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to connect and chat with friends</p>
        </div>

        {/* Glass card container */}
        <div className="glass-card rounded-2xl p-8 border border-white/10 bg-[#161b22]/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiMail className="text-lg" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#0d1117] border ${
                    errors.email ? "border-red-500/70 focus:border-red-500" : "border-slate-700/80 focus:border-indigo-500"
                  } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20`}
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="text-lg" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-2.5 bg-[#0d1117] border ${
                    errors.password ? "border-red-500/70 focus:border-red-500" : "border-slate-700/80 focus:border-indigo-500"
                  } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20`}
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer switch */}
          <div className="mt-6 pt-5 border-t border-slate-700/50 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors ml-1"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../apiClient.js";
import { useAuth } from "../Context/AuthProvider.jsx";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import { BsChatSquareTextFill } from "react-icons/bs";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function Signup() {
  const [, setAuthUser] = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  // Calculate password strength
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return { score: 0, text: "", color: "bg-slate-700" };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass)) score += 1;
    if (/[@$!%*?&]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, text: "Weak", color: "bg-red-500" };
    if (score === 2) return { score: 50, text: "Fair", color: "bg-amber-500" };
    if (score === 3) return { score: 75, text: "Good", color: "bg-blue-500" };
    return { score: 100, text: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  const onSubmit = async (data) => {
    setLoading(true);
    const userInfo = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      confirmpassword: data.confirmPassword,
    };

    try {
      const response = await apiClient.post("/user/signup", userInfo);
      toast.success("Account created successfully!");
      localStorage.setItem("messenger", JSON.stringify(response.data));
      setAuthUser(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#090d16] overflow-hidden px-4 py-8">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/6 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-float-slow"></div>
      <div
        className="absolute bottom-1/6 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-float-slow"
        style={{ animationDelay: "-3s" }}
      ></div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/30 mb-3">
            <BsChatSquareTextFill className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Create an <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Account</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Join Talkie to connect with everyone</p>
        </div>

        {/* Glass card container */}
        <div className="glass-card rounded-2xl p-8 border border-white/10 bg-[#161b22]/80 backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiUser className="text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-2 bg-[#0d1117] border ${
                    errors.name ? "border-red-500/70 focus:border-red-500" : "border-slate-700/80 focus:border-indigo-500"
                  } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20`}
                  {...register("name", {
                    required: "Full name is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                  })}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiMail className="text-lg" />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2 bg-[#0d1117] border ${
                    errors.email ? "border-red-500/70 focus:border-red-500" : "border-slate-700/80 focus:border-indigo-500"
                  } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20`}
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="text-lg" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-11 py-2 bg-[#0d1117] border ${
                    errors.password ? "border-red-500/70 focus:border-red-500" : "border-slate-700/80 focus:border-indigo-500"
                  } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20`}
                  {...register("password", {
                    required: "Password is required",
                    pattern: {
                      value: PASSWORD_REGEX,
                      message: "Must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special symbol",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
                </button>
              </div>

              {/* Password strength progress bar */}
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                    <span>Security strength</span>
                    <span className="font-semibold">{strength.text}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FiLock className="text-lg" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2 bg-[#0d1117] border ${
                    errors.confirmPassword ? "border-red-500/70 focus:border-red-500" : "border-slate-700/80 focus:border-indigo-500"
                  } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20`}
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                    validate: (val) => val === password || "Passwords do not match",
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-400 font-medium">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer switch */}
          <div className="mt-5 pt-4 border-t border-slate-700/50 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors ml-1"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
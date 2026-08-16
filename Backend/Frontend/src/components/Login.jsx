import React, { useState } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../apiClient.js";
import { useAuth } from "../Context/AuthProvider.jsx";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {
  const [, setAuthUser] = useAuth();
  const [loading, setLoading] = useState(false);

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
        toast.success("Logged in successfully");
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
    <div className="flex h-screen items-center justify-center">
      <form
        className="border border-white px-6 py-3 rounded-md space-y-3 w-96"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-2xl text-blue-600 font-bold">💬Talkie</h1>
        <h2 className="text-2xl">
          Login with your <span className="text-blue-600 font-semibold">Account</span>
        </h2>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="email"
            className="grow"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
        </label>
        {errors.email && (
          <span className="text-red-600 text-sm font-semibold">
            {errors.email.message}
          </span>
        )}

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="password"
            className="grow"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
        </label>
        {errors.password && (
          <span className="text-red-600 text-sm font-semibold">
            {errors.password.message}
          </span>
        )}

        <div className="flex justify-center">
          <input
            type="submit"
            value={loading ? "Logging in..." : "Login"}
            className="text-white bg-blue-600 w-full rounded-lg py-2 hover:bg-blue-700 transition-all cursor-pointer disabled:bg-slate-500 disabled:cursor-not-allowed"
            disabled={loading}
          />
        </div>

        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 underline cursor-pointer ml-1">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../apiClient.js";
import { useAuth } from "../Context/AuthProvider.jsx";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function Signup() {
  const [, setAuthUser] = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    setLoading(true);
    const userInfo = {
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      confirmpassword: data.confirmPassword,
    };

    try {
      const response = await apiClient.post("/user/signup", userInfo);
      toast.success("Signup successful!");
      localStorage.setItem("messenger", JSON.stringify(response.data));
      setAuthUser(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-white px-6 py-3 rounded-md space-y-3 w-96"
      >
        <h1 className="text-2xl text-blue-600 font-bold">💬Talkie</h1>
        <h2 className="text-2xl">
          Create a new <span className="text-blue-600 font-semibold">Account</span>
        </h2>

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Username"
            {...register("name", { required: "Username is required", minLength: { value: 3, message: "Min 3 characters" } })}
          />
        </label>
        {errors.name && <span className="text-red-600 text-sm font-semibold">{errors.name.message}</span>}

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="email"
            className="grow"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
        </label>
        {errors.email && <span className="text-red-600 text-sm font-semibold">{errors.email.message}</span>}

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="password"
            className="grow"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: PASSWORD_REGEX,
                message: "Must have 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 symbol",
              },
            })}
          />
        </label>
        {errors.password && <span className="text-red-600 text-sm font-semibold">{errors.password.message}</span>}

        <label className="input input-bordered flex items-center gap-2">
          <input
            type="password"
            className="grow"
            placeholder="Confirm password"
            {...register("confirmPassword", {
              required: "Please confirm password",
              validate: (val) => val === password || "Passwords do not match",
            })}
          />
        </label>
        {errors.confirmPassword && <span className="text-red-600 text-sm font-semibold">{errors.confirmPassword.message}</span>}

        <div className="flex justify-center">
          <input
            type="submit"
            value={loading ? "Signing up..." : "Signup"}
            className="text-white bg-blue-600 w-full rounded-lg py-2 hover:bg-blue-700 transition-all cursor-pointer disabled:bg-slate-500"
            disabled={loading}
          />
        </div>

        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline ml-1">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
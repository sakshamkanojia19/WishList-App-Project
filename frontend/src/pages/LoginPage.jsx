import React from "react";
import { useForm } from "react-hook-form";
import api from "../api/api";

export default function LoginPage({ setUser }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 border rounded shadow-sm">
      <h2 className="text-2xl mb-6 font-semibold text-indigo-700">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            {...register("email", { required: true })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-indigo-500"
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">Email is required</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            placeholder="Your password"
            {...register("password", { required: true })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-indigo-500"
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">Password is required</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
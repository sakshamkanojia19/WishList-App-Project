import React from "react";
import { useForm } from "react-hook-form";
import api from "../api/api";

export default function SignupPage({ setUser }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/signup", data);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } catch (err) {
      alert(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 border rounded shadow-sm">
      <h2 className="text-2xl mb-6 font-semibold text-indigo-700">Signup</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            placeholder="Your name"
            {...register("name")}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-indigo-500"
          />
        </div>
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            {...register("email", { required: true })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-indigo-500"
            autoCorrect="off"
            autoCapitalize="none"
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
            {...register("password", { required: true, minLength: 6 })}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-indigo-500"
            autoComplete="new-password"
          />
          {errors.password && errors.password.type === "required" && (
            <p className="text-red-600 text-sm mt-1">Password is required</p>
          )}
          {errors.password && errors.password.type === "minLength" && (
            <p className="text-red-600 text-sm mt-1">
              Password must be at least 6 characters
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          {isSubmitting ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
}
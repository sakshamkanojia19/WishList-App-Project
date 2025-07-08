import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="max-w-3xl mx-auto text-center mt-12">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-6">
        Welcome to WishlistApp
      </h1>
      <p className="text-lg mb-8 leading-relaxed text-gray-700">
        Create personal wishlists, add your favorite products with prices and links. 
        See global wishlists from users around the world!
        Collaborate by inviting others to contribute to your wishlists.
        Comment on public wishlists and discover new ideas.
      </p>
      <div className="space-x-4">
        <Link
          to="/signup"
          className="inline-block px-8 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="inline-block px-8 py-3 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
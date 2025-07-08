import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function MyWishlists() {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newData, setNewData] = useState({ title: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "" });

  async function fetchUserWishlists() {
    try {
      setLoading(true);
      const res = await api.get("/wishlists/user");
      setWishlists(res.data);
    } catch {
      alert("Error loading your wishlists");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserWishlists();
  }, []);

  async function createWishlist() {
    try {
      if (!newData.title.trim()) {
        alert("Title is required");
        return;
      }
      await api.post("/wishlists", newData);
      setNewData({ title: "", description: "" });
      fetchUserWishlists();
    } catch {
      alert("Failed to create wishlist");
    }
  }

  async function deleteWishlist(id) {
    if (!window.confirm("Are you sure you want to delete this wishlist?")) return;

    try {
      await api.delete(`/wishlists/${id}`);
      fetchUserWishlists();
    } catch {
      alert("Failed to delete wishlist");
    }
  }

  async function saveEdit(id) {
    if (!editData.title.trim()) {
      alert("Title is required");
      return;
    }
    try {
      await api.put(`/wishlists/${id}`, editData);
      setEditingId(null);
      fetchUserWishlists();
    } catch {
      alert("Failed to update wishlist");
    }
  }

  // Product add, edit, delete handled inside WishlistDetails page for better UX.
  // We'll link each wishlist title to detailed management.

  if (loading)
    return <div className="text-center mt-8">Loading your wishlists...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">My Wishlists</h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-2xl mb-2 font-semibold">Create New Wishlist</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full border border-gray-300 px-3 py-2 rounded"
          value={newData.title}
          onChange={(e) => setNewData({ ...newData, title: e.target.value })}
        />
        <textarea
          placeholder="Description (optional)"
          className="w-full border border-gray-300 px-3 py-2 rounded mt-2"
          value={newData.description}
          onChange={(e) => setNewData({ ...newData, description: e.target.value })}
          rows={3}
        />
        <button
          onClick={createWishlist}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create Wishlist
        </button>
      </div>

      <div className="space-y-4">
        {wishlists.length === 0 && (
          <p className="italic">You have no wishlists yet.</p>
        )}

        {wishlists.map((w) =>
          editingId === w._id ? (
            <div
              key={w._id}
              className="bg-white border rounded p-4 shadow flex flex-col space-y-3"
            >
              <input
                type="text"
                className="border border-gray-300 rounded px-3 py-2"
                value={editData.title}
                onChange={(e) =>
                  setEditData((d) => ({ ...d, title: e.target.value }))
                }
              />
              <textarea
                rows={3}
                className="border border-gray-300 rounded px-3 py-2"
                value={editData.description}
                onChange={(e) =>
                  setEditData((d) => ({ ...d, description: e.target.value }))
                }
              ></textarea>
              <div className="flex space-x-2">
                <button
                  onClick={() => saveEdit(w._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              key={w._id}
              className="bg-white border rounded p-4 shadow flex justify-between items-center"
            >
              <Link
                to={`/wishlist/${w._id}`}
                className="text-indigo-700 font-semibold hover:underline max-w-xl truncate inline-block"
                title={w.title}
              >
                {w.title}
              </Link>

              <div className="space-x-2">
                <button
                  onClick={() => {
                    setEditingId(w._id);
                    setEditData({ title: w.title, description: w.description || "" });
                  }}
                  className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteWishlist(w._id)}
                  className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
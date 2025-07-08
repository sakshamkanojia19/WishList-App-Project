import React, { useEffect, useState } from "react";
import api from "../api/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"; // ✅ import plugin

dayjs.extend(relativeTime); // ✅ enable plugin

export default function GlobalFeed() {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});

  async function fetchFeed() {
    try {
      setLoading(true);
      const res = await api.get("/wishlists/feed");
      setWishlists(res.data);
    } catch (error) {
      alert("Failed to load global feed", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFeed();
  }, []);

  async function submitComment(wishlistId) {
    if (!commentInput[wishlistId] || commentInput[wishlistId].trim() === "")
      return;

    try {
      setSubmittingComment((s) => ({ ...s, [wishlistId]: true }));
      const res = await api.post(`/wishlists/${wishlistId}/comments`, {
        comment: commentInput[wishlistId],
      });

      setWishlists((prev) =>
        prev.map((w) => (w._id === wishlistId ? res.data : w))
      );
      setCommentInput((s) => ({ ...s, [wishlistId]: "" }));
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to post comment");
    } finally {
      setSubmittingComment((s) => ({ ...s, [wishlistId]: false }));
    }
  }

  if (loading)
    return (
      <div className="text-center mt-16">Loading global wishlist feed...</div>
    );

  if (wishlists.length === 0)
    return (
      <div className="text-center mt-16">
        No wishlists found. Create one to get started!
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">Global Feed</h1>
      {wishlists.map((w) => (
        <div key={w._id} className="p-6 border rounded-md shadow-sm bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-semibold">{w.title}</h2>
            <div className="text-sm text-gray-500 italic">
              {dayjs(w.createdAt).fromNow()} by {w.owner.email}
            </div>
          </div>
          <p className="mb-6 text-gray-700">{w.description || "No description"}</p>

          <div>
            <h3 className="font-semibold mb-2 text-indigo-600">Products</h3>
            {w.products.length === 0 && (
              <p className="italic text-gray-400">No products added yet</p>
            )}
            <ul className="space-y-2">
              {w.products.map((p) => (
                <li
                  key={p._id}
                  className="bg-indigo-50 p-3 rounded border border-indigo-100 flex justify-between items-center"
                >
                  <div>
                    <a
                      href={p.link || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-indigo-700 hover:underline"
                    >
                      {p.name}
                    </a>
                    <span className="ml-3 text-gray-600">
                      {p.price !== undefined ? `$${p.price}` : ""}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Comments</h3>
            <ul className="mb-4 max-h-40 overflow-y-auto text-gray-800 space-y-2">
              {w.comments.length === 0 && (
                <li className="italic text-gray-400">No comments yet</li>
              )}

              {w.comments.map((c) => (
                <li key={c._id} className="border-b border-gray-200 pb-1">
                  <strong>{c.commenter.email}</strong>: {c.comment}{" "}
                  <span className="text-xs text-gray-500 ml-2">
                    {dayjs(c.createdAt).fromNow()}
                  </span>
                </li>
              ))}
            </ul>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitComment(w._id);
              }}
              className="flex space-x-2"
            >
              <input
                type="text"
                placeholder="Add a comment"
                className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-indigo-500"
                value={commentInput[w._id] || ""}
                onChange={(e) =>
                  setCommentInput((s) => ({ ...s, [w._id]: e.target.value }))
                }
              />
              <button
                type="submit"
                disabled={submittingComment[w._id]}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold px-4 rounded"
              >
                {submittingComment[w._id] ? "..." : "Post"}
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}

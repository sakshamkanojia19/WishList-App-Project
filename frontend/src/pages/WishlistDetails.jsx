import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

export default function WishlistDetails({ user }) {
  const { id } = useParams();
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState({
    name: "",
    link: "",
    price: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [editProductForm, setEditProductForm] = useState({
    name: "",
    link: "",
    price: "",
  });

  async function fetchWishlist() {
    try {
      setLoading(true);
      const res = await api.get(`/wishlists/${id}`);
      setWishlist(res.data);
    } catch {
      alert("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWishlist();
  }, [id]);

  // Check if current user can edit: either owner or invited
  const canEdit =
    wishlist &&
    (wishlist.owner._id === user.id ||
      wishlist.invitedUsers?.some((uid) => uid === user.id));

  async function addProduct() {
    if (!productForm.name.trim()) {
      alert("Product name is required");
      return;
    }
    try {
      const res = await api.post(`/wishlists/${id}/products`, {
        name: productForm.name,
        link: productForm.link,
        price: productForm.price ? parseFloat(productForm.price) : undefined,
      });
      setWishlist(res.data);
      setProductForm({ name: "", link: "", price: "" });
    } catch {
      alert("Failed to add product");
    }
  }

  async function startEditProduct(prod) {
    setEditingProductId(prod._id);
    setEditProductForm({
      name: prod.name,
      link: prod.link || "",
      price: prod.price !== undefined ? prod.price : "",
    });
  }

  async function saveEditProduct() {
    if (!editProductForm.name.trim()) {
      alert("Product name is required");
      return;
    }
    try {
      const res = await api.put(
        `/wishlists/${id}/products/${editingProductId}`,
        {
          name: editProductForm.name,
          link: editProductForm.link,
          price: editProductForm.price ? parseFloat(editProductForm.price) : undefined,
        }
      );
      setWishlist(res.data);
      setEditingProductId(null);
    } catch {
      alert("Failed to update product");
    }
  }

  async function deleteProduct(productId) {
    if (!window.confirm("Delete this product?")) return;
    try {
      const res = await api.delete(`/wishlists/${id}/products/${productId}`);
      setWishlist(res.data);
    } catch {
      alert("Failed to delete product");
    }
  }

  if (loading)
    return <div className="text-center mt-8">Loading wishlist details...</div>;

  if (!wishlist)
    return (
      <div className="text-center mt-8 text-red-600">
        Wishlist not found or access denied.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6 bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold text-indigo-700">{wishlist.title}</h1>
      <p className="italic text-gray-700">{wishlist.description || "No description"}</p>
      <p className="text-sm text-gray-500 italic">
        Owned by: {wishlist.owner.email}
      </p>

      <div>
        <h2 className="text-xl font-semibold text-indigo-600 mb-3">Products</h2>
        {wishlist.products.length === 0 && (
          <p className="italic text-gray-400 mb-3">No products added yet.</p>
        )}

        {/* Products List */}
        <ul className="space-y-3">
          {wishlist.products.map((p) =>
            editingProductId === p._id ? (
              <li
                key={p._id}
                className="bg-indigo-50 border border-indigo-100 rounded p-3 flex flex-col space-y-2"
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={editProductForm.name}
                  onChange={(e) =>
                    setEditProductForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="border border-gray-300 rounded px-3 py-1"
                />
                <input
                  type="url"
                  placeholder="Link"
                  value={editProductForm.link}
                  onChange={(e) =>
                    setEditProductForm((f) => ({ ...f, link: e.target.value }))
                  }
                  className="border border-gray-300 rounded px-3 py-1"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={editProductForm.price}
                  onChange={(e) =>
                    setEditProductForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className="border border-gray-300 rounded px-3 py-1"
                  min="0"
                  step="0.01"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={saveEditProduct}
                    className="bg-green-600 px-3 py-1 rounded text-white hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingProductId(null)}
                    className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </li>
            ) : (
              <li
                key={p._id}
                className="border border-indigo-100 rounded p-3 flex justify-between items-center"
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
                {canEdit && (
                  <div className="space-x-2 flex-shrink-0">
                    <button
                      onClick={() => startEditProduct(p)}
                      className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p._id)}
                      className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            )
          )}
        </ul>
      </div>

      {canEdit && (
        <div className="mt-6 p-4 border border-indigo-200 rounded bg-indigo-50">
          <h3 className="font-semibold mb-3 text-indigo-700">Add New Product</h3>
          <div className="space-y-2 max-w-md">
            <input
              type="text"
              placeholder="Product name"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={productForm.name}
              onChange={(e) =>
                setProductForm((d) => ({ ...d, name: e.target.value }))
              }
            />
            <input
              type="url"
              placeholder="Product link (optional)"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={productForm.link}
              onChange={(e) =>
                setProductForm((d) => ({ ...d, link: e.target.value }))
              }
            />
            <input
              type="number"
              placeholder="Price (optional)"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={productForm.price}
              onChange={(e) =>
                setProductForm((d) => ({ ...d, price: e.target.value }))
              }
              min="0"
              step="0.01"
            />
            <button
              onClick={addProduct}
              className="bg-indigo-600 text-white rounded px-4 py-2 hover:bg-indigo-700"
            >
              Add Product
            </button>
          </div>
        </div>
      )}

      <Link
        to="/my-wishlists"
        className="inline-block mt-6 text-indigo-600 hover:underline"
      >
        &larr; Back to My Wishlists
      </Link>
    </div>
  );
}
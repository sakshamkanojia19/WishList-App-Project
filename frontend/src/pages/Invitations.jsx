import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Invitations() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendForm, setSendForm] = useState({ wishlistId: "", receiverEmail: "" });
  const [myWishlists, setMyWishlists] = useState([]);

  async function fetchInvitations() {
    try {
      setLoading(true);
      const res = await api.get("/invitations/received");
      setInvitations(res.data);
    } catch {
      alert("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  }

  async function fetchMyWishlists() {
    try {
      const res = await api.get("/wishlists/user");
      setMyWishlists(res.data);
    } catch {
      alert("Failed to load your wishlists");
    }
  }

  useEffect(() => {
    fetchInvitations();
    fetchMyWishlists();
  }, []);

  async function respond(invitationId, action) {
    try {
      await api.post(`/invitations/${invitationId}/respond`, { action });
      fetchInvitations();
    } catch {
      alert("Failed to respond to invitation");
    }
  }

  async function sendInvite() {
    if (!sendForm.wishlistId || !sendForm.receiverEmail.trim()) {
      alert("Select a wishlist and enter receiver's email");
      return;
    }
    try {
      await api.post("/invitations/send", sendForm);
      alert("Invitation sent!");
      setSendForm({ wishlistId: "", receiverEmail: "" });
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to send invitation");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6">Invitations</h1>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4 font-semibold">Received Invitations</h2>
        {loading ? (
          <p>Loading invitations...</p>
        ) : invitations.length === 0 ? (
          <p className="italic text-gray-500">No invitations received</p>
        ) : (
          <ul className="space-y-3">
            {invitations.map((inv) => (
              <li
                key={inv._id}
                className="p-4 border border-indigo-200 rounded flex justify-between items-center"
              >
                <div>
                  <p>
                    <span className="font-semibold">{inv.sender.email}</span> has
                    invited you to collaborate on wishlist{" "}
                    <span className="font-semibold">{inv.wishlist}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Sent: {new Date(inv.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => respond(inv._id, "accept")}
                    className="bg-green-600 px-3 py-1 rounded text-white hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respond(inv._id, "reject")}
                    className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4 font-semibold">Send Invitation</h2>
        <div className="space-y-3 max-w-md">
          <select
            value={sendForm.wishlistId}
            onChange={(e) =>
              setSendForm((d) => ({ ...d, wishlistId: e.target.value }))
            }
            className="w-full border border-gray-300 px-3 py-2 rounded"
          >
            <option value="">Select a wishlist</option>
            {myWishlists.map((w) => (
              <option key={w._id} value={w._id}>
                {w.title}
              </option>
            ))}
          </select>

          <input
            type="email"
            placeholder="Receiver email"
            className="w-full border border-gray-300 px-3 py-2 rounded"
            value={sendForm.receiverEmail}
            onChange={(e) =>
              setSendForm((d) => ({ ...d, receiverEmail: e.target.value }))
            }
          />

          <button
            onClick={sendInvite}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}
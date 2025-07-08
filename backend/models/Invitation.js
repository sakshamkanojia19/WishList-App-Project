const mongoose = require("mongoose");

const InvitationSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverEmail: { type: String, required: true },
  wishlist: { type: mongoose.Schema.Types.ObjectId, ref: "Wishlist", required: true },
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invitation", InvitationSchema);
const Invitation = require("../models/Invitation");
const User = require("../models/User");
const Wishlist = require("../models/Wishlist");

exports.sendInvitation = async (req, res) => {
  try {
    const { wishlistId, receiverEmail } = req.body;
    if (!wishlistId || !receiverEmail) {
      return res.status(400).json({ msg: "Wishlist ID and receiver email required" });
    }

    const wishlist = await Wishlist.findById(wishlistId);
    if (!wishlist) return res.status(404).json({ msg: "Wishlist not found" });

    if (!wishlist.owner.equals(req.user._id)) {
      return res.status(403).json({ msg: "Only owner can send invitations" });
    }

    // Check receiver user exists
    const receiverUser = await User.findOne({ email: receiverEmail.toLowerCase() });
    if (!receiverUser) return res.status(404).json({ msg: "Receiver user not found" });

    // Prevent sending invitation to self
    if (receiverUser._id.equals(req.user._id)) {
      return res.status(400).json({ msg: "Cannot invite yourself" });
    }

    // Check if invitation exists
    let invitation = await Invitation.findOne({
      sender: req.user._id,
      receiverEmail: receiverEmail.toLowerCase(),
      wishlist: wishlistId,
      status: "pending",
    });
    if (invitation) {
      return res.status(400).json({ msg: "Invitation already sent" });
    }

    invitation = new Invitation({
      sender: req.user._id,
      receiverEmail: receiverEmail.toLowerCase(),
      wishlist: wishlistId,
    });
    await invitation.save();

    res.json({ msg: "Invitation sent" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getReceivedInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      receiverEmail: req.user.email.toLowerCase(),
      status: "pending",
    }).populate("sender", "email");

    res.json(invitations);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.respondInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { action } = req.body; // "accept" or "reject"

    if (!["accept", "reject"].includes(action)) {
      return res.status(400).json({ msg: "Invalid action" });
    }

    const invitation = await Invitation.findById(invitationId);
    if (!invitation) return res.status(404).json({ msg: "Invitation not found" });

    if (invitation.receiverEmail.toLowerCase() !== req.user.email.toLowerCase())
      return res.status(403).json({ msg: "Unauthorized" });

    if (invitation.status !== "pending")
      return res.status(400).json({ msg: "Invitation already responded" });

    if (action === "accept") {
      invitation.status = "accepted";

      // Add user to wishlist invitedUsers if not already
      const wishlist = await Wishlist.findById(invitation.wishlist);
      if (!wishlist) return res.status(404).json({ msg: "Wishlist not found" });

      if (!wishlist.invitedUsers.some((u) => u.equals(req.user._id))) {
        wishlist.invitedUsers.push(req.user._id);
        await wishlist.save();
      }
    }
    else {
      invitation.status = "rejected";
    }

    await invitation.save();

    res.json({ msg: `Invitation ${action}ed` });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
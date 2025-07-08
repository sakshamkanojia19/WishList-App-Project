const Wishlist = require("../models/Wishlist");
const User = require("../models/User");
const Invitation = require("../models/Invitation");

exports.createWishlist = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title)
      return res.status(400).json({ msg: "Title is required" });

    const newWishlist = new Wishlist({
      owner: req.user._id,
      title,
      description,
      products: [],
    });

    await newWishlist.save();

    res.json(newWishlist);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getWishlistsByUser = async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ owner: req.user._id });
    res.json(wishlists);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Global Feed: All wishlists with owner email + time
exports.getGlobalFeed = async (req, res) => {
  try {
    const wishlists = await Wishlist.find({})
      .populate("owner", "email")
      .sort({ createdAt: -1 });
    res.json(wishlists);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getWishlistById = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id)
      .populate("owner", "email")
      .populate("comments.commenter", "email");
    if (!wishlist)
      return res.status(404).json({ msg: "Wishlist not found" });

    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateWishlist = async (req, res) => {
  try {
    const { title, description } = req.body;
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist)
      return res.status(404).json({ msg: "Wishlist not found" });

    // Only owner or invited users can update wishlist
    const isOwner = wishlist.owner.equals(req.user._id);
    const isInvited = wishlist.invitedUsers.some((u) => u.equals(req.user._id));

    if (!isOwner && !isInvited)
      return res.status(403).json({ msg: "Not authorized to update" });

    if (title) wishlist.title = title;
    if (description) wishlist.description = description;

    await wishlist.save();

    // For updated global feed consistency, populate owner email
    const populatedWishlist = await wishlist.populate("owner", "email");

    res.json(populatedWishlist);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist)
      return res.status(404).json({ msg: "Wishlist not found" });

    if (!wishlist.owner.equals(req.user._id))
      return res.status(403).json({ msg: "Only owner can delete" });

    await wishlist.deleteOne();

    res.json({ msg: "Wishlist deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// CRUD Products on wishlist
exports.addProduct = async (req, res) => {
  try {
    const { name, link, price } = req.body;
    if (!name)
      return res.status(400).json({ msg: "Product name required" });

    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist)
      return res.status(404).json({ msg: "Wishlist not found" });

    // Owner or invited users can add products
    const isOwner = wishlist.owner.equals(req.user._id);
    const isInvited = wishlist.invitedUsers.some((u) => u.equals(req.user._id));
    if (!isOwner && !isInvited)
      return res.status(403).json({ msg: "Not authorized to modify" });

    wishlist.products.push({ name, link, price });
    await wishlist.save();

    const populatedWishlist = await wishlist.populate("owner", "email");

    res.json(populatedWishlist);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, link, price } = req.body;

    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist)
      return res.status(404).json({ msg: "Wishlist not found" });

    const isOwner = wishlist.owner.equals(req.user._id);
    const isInvited = wishlist.invitedUsers.some((u) => u.equals(req.user._id));
    if (!isOwner && !isInvited)
      return res.status(403).json({ msg: "Not authorized to modify" });

    const product = wishlist.products.id(productId);
    if (!product)
      return res.status(404).json({ msg: "Product not found" });

    if (name) product.name = name;
    if (link !== undefined) product.link = link;
    if (price !== undefined) product.price = price;

    await wishlist.save();

    const populatedWishlist = await wishlist.populate("owner", "email");
    res.json(populatedWishlist);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist)
      return res.status(404).json({ msg: "Wishlist not found" });

    const isOwner = wishlist.owner.equals(req.user._id);
    const isInvited = wishlist.invitedUsers.some((u) => u.equals(req.user._id));
    if (!isOwner && !isInvited)
      return res.status(403).json({ msg: "Not authorized to modify" });

    const product = wishlist.products.id(productId);
    if (!product)
      return res.status(404).json({ msg: "Product not found" });

    product.remove();
    await wishlist.save();

    const populatedWishlist = await wishlist.populate("owner", "email");
    res.json(populatedWishlist);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Comments - add a comment (only logged in users can comment)
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment)
      return res.status(400).json({ msg: "Comment content required" });

    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist)
      return res.status(404).json({ msg: "Wishlist not found" });

    wishlist.comments.push({
      commenter: req.user._id,
      comment,
    });

    await wishlist.save();

    const populatedWishlist = await wishlist.populate([
      { path: "owner", select: "email" },
      { path: "comments.commenter", select: "email" },
    ]);

    res.json(populatedWishlist);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
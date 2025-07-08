const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const wishlistController = require("../contollers/wishlistController");

// Wishlist CRUD
router.post("/", authMiddleware, wishlistController.createWishlist);
router.get("/user", authMiddleware, wishlistController.getWishlistsByUser);
router.get("/feed", authMiddleware, wishlistController.getGlobalFeed);
router.get("/:id", authMiddleware, wishlistController.getWishlistById);
router.put("/:id", authMiddleware, wishlistController.updateWishlist);
router.delete("/:id", authMiddleware, wishlistController.deleteWishlist);

// Products CRUD inside wishlist
router.post("/:id/products", authMiddleware, wishlistController.addProduct);
router.put("/:id/products/:productId", authMiddleware, wishlistController.updateProduct);
router.delete("/:id/products/:productId", authMiddleware, wishlistController.deleteProduct);

// Comments
router.post("/:id/comments", authMiddleware, wishlistController.addComment);

module.exports = router;
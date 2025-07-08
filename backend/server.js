const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { PORT, MONGO_URI, CLIENT_URL } = require("./config");
const authRoutes = require("./routes/authRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const invitationRoutes = require("./routes/invitationRoutes");

const app = express();

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/invitations", invitationRoutes);

app.get("/", (req, res) => {
  res.send("Wishlist API Running");
});

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
  
  // Start the server only after successful DB connection
  startServer();
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Function to start the server
function startServer() {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
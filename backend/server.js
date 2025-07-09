const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { PORT, MONGO_URI, CLIENT_URL } = require("./config");
const authRoutes = require("./routes/authRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const invitationRoutes = require("./routes/invitationRoutes");

const app = express();


const allowedOrigins = [
  "https://wish-list-app-project.vercel.app",
  "http://localhost:3000"
];


app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"]
}));


app.options("*", cors());


app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});


app.use("/api/auth", authRoutes);
app.use("/api/wishlists", wishlistRoutes);
app.use("/api/invitations", invitationRoutes);


app.get("/", (req, res) => {
  res.send("Wishlist API Running");
});


app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
});


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
  startServer();
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});


function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

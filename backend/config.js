// require("dotenv").config();

// module.exports = {
//   PORT: process.env.PORT || 5000,
//   MONGO_URI: process.env.MONGO_URI,
//   JWT_SECRET: process.env.JWT_SECRET,
//   CLIENT_URL: process.env.CLIENT_URL,
// };


module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_URL: "https://wish-list-app-project.vercel.app", // <- must match frontend exactly
};

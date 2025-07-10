# 🎁 WishlistApp

Welcome to **WishlistApp** — your personal space to **save**, **share**, and **explore** wishlists from users around the world!

---

## ✨ Features

- 📝 **Create your own wishlist**
  - Add products with title, price, description, and external links.
  
- 🌐 **Explore global wishlists**
  - Discover public wishlists shared by users globally for ideas and inspiration.

- 💬 **Comment on public wishlists**
  - Engage with the community by commenting and sharing thoughts.

- 🔐 **Authentication & Authorization**
  - Secure login/signup to manage your personal wishlists.

---

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind
- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Deployment**: Vercel (API hosted at [https://wish-list-app-project.vercel.app/]
- **Auth**: JWT + Bcrypt
- **Other**: dotenv, cors, serverless-http

---

## 🔧 API Endpoints


### Auth Routes

| Method | Endpoint             | Description            |
|--------|----------------------|------------------------|
| POST   | `/api/auth/signup`   | Register a new user    |
| POST   | `/api/auth/login`    | Log in with credentials|
| GET    | `/api/auth/test`     | Test the auth API      |

### Wishlist Routes *(examples)*

| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| GET    | `/api/wishlist`           | Get all public wishlists     |
| POST   | `/api/wishlist`           | Create a new wishlist        |
| PUT    | `/api/wishlist/:id`       | Update a wishlist            |
| DELETE | `/api/wishlist/:id`       | Delete a wishlist            |

---

## 📦 Installation (For Local Development)

```bash
git clone https://github.com/your-username/wishlist-new-backend.git
cd wishlist-new-backend
npm install
Create a .env file
env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Run the server
bash
Copy
Edit
npm start
📄 License
This project is open-source and available under the MIT License.

👨‍💻 Author
Made with ❤️ by Saksham Kanojia

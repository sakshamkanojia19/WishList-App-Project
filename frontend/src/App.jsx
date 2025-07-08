import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import GlobalFeed from "./pages/GlobalFeed";
import MyWishlists from "./pages/MyWishlists";
import WishlistDetails from "./pages/WishlistDetails";
import Invitations from "./pages/Invitations";
import api from "./api/api";

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Check user info on mount
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoadingUser(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      }
      setLoadingUser(false);
    }
    loadUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loadingUser) return <div className="flex items-center justify-center h-screen"><p>Loading...</p></div>;

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-indigo-600 p-4 text-white flex justify-between items-center shadow-md">
          <Link to="/" className="font-bold text-xl">WishlistApp</Link>

          <div className="space-x-4">
            {user ? (
              <>
                <Link to="/feed" className="hover:underline">
                  Global Feed
                </Link>
                <Link to="/my-wishlists" className="hover:underline">
                  My Wishlists
                </Link>
                <Link to="/invitations" className="hover:underline">
                  Invitations
                </Link>
                <Link to="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <button onClick={logout} className="ml-4 bg-red-600 px-3 py-1 rounded hover:bg-red-700">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
                <Link to="/signup" className="hover:underline">
                  Signup
                </Link>
              </>
            )}
          </div>
        </nav>

        <main className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/login"
              element={!user ? <LoginPage setUser={setUser} /> : <Navigate to="/feed" />}
            />
            <Route
              path="/signup"
              element={!user ? <SignupPage setUser={setUser} /> : <Navigate to="/feed" />}
            />

            <Route path="/feed" element={user ? <GlobalFeed /> : <Navigate to="/login" />} />
            <Route path="/my-wishlists" element={user ? <MyWishlists /> : <Navigate to="/login" />} />

            <Route path="/wishlist/:id" element={user ? <WishlistDetails user={user} /> : <Navigate to="/login" />} />

            <Route path="/invitations" element={user ? <Invitations setUser={setUser} /> : <Navigate to="/login" />} />

            <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />

            <Route path="*" element={<p>404 Not Found</p>} />
          </Routes>
        </main>

        <footer className="bg-indigo-600 text-white text-center p-3">
        All rights reserved  &copy; 2025 WishlistApp
        </footer>
      </div>
    </Router>
  );
}

export default App;
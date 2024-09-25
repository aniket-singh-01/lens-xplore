import React from "react";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import HomePage from "./pages/HomePage";
import XplorePage from "./pages/XplorePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";

import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="container mx-auto">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/log-in"
              element={<LoginPage />}
            />
            <Route
              path="/sign-up"
              element={<SignupPage />}
            />
            <Route
              path="/demo-page"
              element={<XplorePage />}
            />
            <Route
              path="/profile"
              element={<ProfilePage />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

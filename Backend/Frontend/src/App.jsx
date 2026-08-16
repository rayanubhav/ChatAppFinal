import React from "react";
import Left from "./home/left/Left.jsx";
import Right from "./home/right/Right.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";
import { useAuth } from "./Context/AuthProvider.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

function App() {
  const [authUser] = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            authUser ? (
              <div className="drawer lg:drawer-open">
                <input
                  id="my-drawer-2"
                  type="checkbox"
                  className="drawer-toggle"
                />

                <div className="drawer-content flex flex-col">
                  <Right />
                </div>

                <div className="drawer-side">
                  <label
                    htmlFor="my-drawer-2"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                  ></label>
                  <div className="flex h-full w-80 bg-slate-950">
                    <Left />
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" replace /> : <Signup />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
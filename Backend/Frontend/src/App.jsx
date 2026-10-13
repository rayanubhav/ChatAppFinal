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
              <div className="drawer lg:drawer-open h-screen w-screen overflow-hidden bg-[#090d16]">
                <input
                  id="my-drawer-2"
                  type="checkbox"
                  className="drawer-toggle"
                />

                <div className="drawer-content flex flex-col h-screen overflow-hidden">
                  <Right />
                </div>

                <div className="drawer-side h-screen z-20">
                  <label
                    htmlFor="my-drawer-2"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                  ></label>
                  <div className="h-full w-80 max-w-[85vw] bg-[#0d1117]">
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
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161b22",
            color: "#e6edf3",
            border: "1px solid #30363d",
            fontSize: "13px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
          },
        }}
      />
    </>
  );
}

export default App;
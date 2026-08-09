import { FaRobot } from "react-icons/fa6";
import { IoSparkles } from "react-icons/io5";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import axios from 'axios'
import { auth, provider } from "../utils/firebase";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useState } from "react";

const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:8000";
  }

  const configuredUrl = import.meta.env.VITE_SERVER_URL?.replace(/\/$/, "");

  if (configuredUrl) return configuredUrl;

  return "https://interview-iq-88ed.vercel.app";
};

const API_BASE_URL = getApiBaseUrl();

export default function Auth({isModel = false}) {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const name = user.displayName || user.email?.split("@")[0] || "User";
      const email = user.email;

      if (!email) {
        throw new Error("Google account did not return an email.");
      }

      const result = await axios.post(
        `${API_BASE_URL}/api/auth/google`,
        { name, email },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
    } catch (error) {
      console.error("Google auth error:", error);
      dispatch(setUserData(null));

      const message = error?.response?.data?.message || error?.message || "Google sign-in failed. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={isModel ? "" : "w-full min-h-screen bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4"}>
      
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.05 }}
        className={isModel ? "w-full" : "w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 p-8"}
      >
        
        {/* Top Row */}
        {!isModel && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white text-lg shadow-md">
              <FaRobot />
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Interview<span className="text-black">IQ</span>
            </h2>
          </div>
        )}

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Continue with
        </h1>

        {/* Sub Heading */}
        <div className="flex w-60 mx-auto items-center justify-center gap-2 text-xl px-4 py-2 bg-green-200 rounded-full font-medium text-green-600 mb-6">
          <IoSparkles className="text-green-500 text-xl" />
          AI Smart Interview
        </div>

        {/* Paragraph */}
        <p className="text-center text-gray-600 text-sm leading-relaxed mb-6 px-2">
          Sign in to start your AI-powered mock interviews, track your progress,
          and unlock detailed performance insights.
        </p>

        {/* Button */}
        <motion.button
          onClick={handleGoogleAuth}
          disabled={loading}
          whileHover={!loading ? { scale: 1.03 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
          className="w-full cursor-pointer flex items-center justify-center gap-3 bg-black text-white py-3 rounded-full font-medium shadow-sm hover:shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <FcGoogle className="text-xl" />
          {loading ? "Signing in..." : "Continue with Google"}
        </motion.button>

      </motion.div>
    </div>
  );
}
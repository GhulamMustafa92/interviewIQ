import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import Navbar from './components/Navbar.jsx'
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice.js";
import Interview from "./Pages/InterviewPage.jsx";
import Profile from "./Pages/Profile.jsx";
import InterviewHistory from "./Pages/InterviewHistory.jsx";

export const ServerUrl = (() => {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://localhost:8000";
  }

  const configuredUrl = import.meta.env.VITE_SERVER_URL?.replace(/\/$/, "");

  if (configuredUrl) return configuredUrl;

  return "https://interview-iq-88ed.vercel.app";
})();

function App() {
 
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(ServerUrl + "/api/user/current-user", {
          withCredentials: true
        });
        dispatch(setUserData(response.data))
      } catch (error) {
       dispatch(setUserData(null))
      }
    };
    getUser();
  },[dispatch])
  return (
    <>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/auth" element={<Auth/>}/>
        <Route path="/interview" element={<Interview/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/dashboard" element={<InterviewHistory/>}/>
      </Routes>
      
    </>
  );
}

export default App;

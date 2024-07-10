import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = queryString.parse(window.location.search);
    const token = urlParams.token;
    console.log("Token from URL:", token); // Debugging log

    if (token) {
      localStorage.setItem("token", token);
      console.log("Token stored in localStorage"); // Debugging log
      window.location.href = "/dashboard"; // Directly change the window location
    } else {
      console.log("No token found, redirecting to login"); // Debugging log
      window.location.href = "/login"; // Directly change the window location
    }
  }, []);

  return <div>Loading...</div>;
};

export default Callback;

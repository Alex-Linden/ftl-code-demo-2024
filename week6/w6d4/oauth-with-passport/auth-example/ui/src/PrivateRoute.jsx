import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  console.log("Token in PrivateRoute is: ", token); // Debugging log
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

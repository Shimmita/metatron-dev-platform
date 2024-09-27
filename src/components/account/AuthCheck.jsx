import React from "react";
import LoginAuth from "../auth/LoginAuth";

const AuthCheck = ({ children }) => {
  const isLogin = true;
  // check logi status before proceeding
  return isLogin ? children : <LoginAuth />;
};

export default AuthCheck;

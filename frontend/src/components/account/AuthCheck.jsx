import React from "react";
import LoginAuth from "../auth/LoginAuth";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const AuthCheck = ({ children }) => {
  // access current user online status from redux which is populated
  // from the server
  const { isOnline } = useSelector((state) => state.currentUser);
  const isLogin = isOnline;

  // use effect hook to update user online status on change
  useEffect(() => {
    
  }, [isOnline]);

  // check logi status before proceeding
  return isLogin ? children : <LoginAuth />;
};

export default AuthCheck;

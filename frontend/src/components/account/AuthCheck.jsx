import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "../../redux/AppStore";
import { resetClearCurrentUserRedux } from "../../redux/CurrentUser";
import LoginAuth from "../auth/LoginAuth";

const AuthCheck = ({ children }) => {
  // access current user online status from redux which is populated
  // from the server
  const { isOnline } = useSelector((state) => state.currentUser);
  const [isAuthorised, setIsAuthorised] = useState(isOnline);

  const dispatch = useDispatch();
  // axios to confirm with the server validity of the online status of frontend
  axios.defaults.withCredentials = true;

  axios
    .post(`http://localhost:5000/metatron/api/v1/valid`)
    .then((res) => {
      setIsAuthorised(res.data.authorised);
    })
    .catch(async (err) => {
      console.log(err);
      setIsAuthorised(false);
      // logout if any firebase user
      // clear any firebase authentication details
      const auth = getAuth();
      const firebaseUser = auth?.currentUser;
      if (firebaseUser) {
        await signOut(auth);
      }

      // Clear persisted storage and redux
      await persistor.purge();
      // reset user information
      dispatch(resetClearCurrentUserRedux());
    });

  // check login status before proceeding
  return isOnline && isAuthorised ? children : <LoginAuth />;
};

export default AuthCheck;

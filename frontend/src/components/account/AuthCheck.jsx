import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { persistor } from "../../redux/AppStore";
import { updateCurrentAuthMessage } from "../../redux/CurrentAuthMessages";
import LoginAuth from "../auth/LoginAuth";

const AuthCheck = ({ children }) => {
  // access current user online status from redux which is populated
  // from the server
  const { isOnline } = useSelector((state) => state.currentUser);
  const [isAuthorised, setIsAuthorised] = useState(isOnline);
  
  const dispatch = useDispatch();

  // for secured API calls to and fro the backend
  axios.defaults.withCredentials = true;

  axios
    .post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/valid`)
    .then((res) => {
      setIsAuthorised(res.data.authorised);
    })
    .catch(async (err) => {

      // update user authorised to false
      setIsAuthorised(false);

        // update authMessage error in redux for display on auth pages
        dispatch(updateCurrentAuthMessage(err?.response?.data));

      //final clearance of any persisted storage
      await persistor.purge();
      
    });

  // check login status before proceeding
  return isOnline && isAuthorised ? children : <LoginAuth />;
};

export default AuthCheck;

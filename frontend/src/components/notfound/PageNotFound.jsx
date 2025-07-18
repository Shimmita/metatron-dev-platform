import { useEffect, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  handleSidebarRightbar,
  resetDefaultBottomNav,
} from "../../redux/AppUI";
import { useNavigate } from "react-router-dom";

const PageNotFound = ({ mesage = "" }) => {
  // redux to stop showing of the speed dial
  const dispatch = useDispatch();
  const navigate=useNavigate()

  // redux states access
  const { isSidebarRighbar } = useSelector((state) => state.appUI);
  const { user } = useSelector((state) => state.currentUser);

  // check the state of the  sidebar and rightbar false it if true
  // be no showing due to limited space and UI spreading fitness

  useLayoutEffect(() => {
    if (user && !isSidebarRighbar) {
      dispatch(handleSidebarRightbar());
      dispatch(resetDefaultBottomNav(true));
    }

    // navigate back to home
    navigate("/")
    
  },[]);
 
  
};

export default PageNotFound;

import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetDefaultBottomNav } from "../../redux/AppUI";
import { resetAllSigningStateDetails } from "../../redux/CompleteSigning";
import { resetClearCurrentAuthMessage, updateCurrentAuthMessage } from "../../redux/CurrentAuthMessages";
import { resetClearChatBot } from "../../redux/CurrentChatBot";
import { resetClearCurrentConnectTop } from "../../redux/CurrentConnect";
import { resetClearCurrentConnectNotif } from "../../redux/CurrentConnectNotif";
import { resetClearConversations } from "../../redux/CurrentConversations";
import { resetClearCurrentCourses } from "../../redux/CurrentCourses";
import { resetClearCurrentEventsTop } from "../../redux/CurrentEventsTop";
import { resetClearCurrentGlobalSearch } from "../../redux/CurrentGlobalSearch";
import { resetClearCurrentGroupCommunities } from "../../redux/CurrentGroups";
import { resetClearCurrentJobFeedBack } from "../../redux/CurrentJobFeedBack";
import { resetJobSearch } from "../../redux/CurrentJobSearch";
import { resetClearCurrentJobsTop } from "../../redux/CurrentJobsTop";
import { resetClearPeopleData } from "../../redux/CurrentModal";
import { resetClearCurrentNetwork } from "../../redux/CurrentNetwork";
import { resetClearCurrentPostReactions } from "../../redux/CurrentPostReactions";
import { resetClearCurrentReport } from "../../redux/CurrentPostReported";
import { resetClearCurrentPosts } from "../../redux/CurrentPosts";
import { resetClearCurrentPostsTop } from "../../redux/CurrentPostsTop";
import { resetClearCurrentProfileView } from "../../redux/CurrentProfileView";
import { resetClearCurrentSnack } from "../../redux/CurrentSnackBar";
import { resetClearCurrentSuccessRedux } from "../../redux/CurrentSuccess";
import { resetClearCurrentUserRedux, resetClearTempUserIDRedux } from "../../redux/CurrentUser";
import LoginAuth from "../auth/LoginAuth";

const AuthCheck = ({ children }) => {
  // access current user online status from redux which is populated
  // from the server
  const { isOnline } = useSelector((state) => state.currentUser);
  const [isAuthorised, setIsAuthorised] = useState(isOnline);
  
  const dispatch = useDispatch();

  // for secured API calls to and fro the backend
  axios.defaults.withCredentials = true;

  const handleClearReduxData=()=>{
     // last auth message
          dispatch(resetClearCurrentAuthMessage());
    
          // clear any persisted user data
          dispatch(resetClearCurrentUserRedux())
    
          // temp user Id 
          dispatch(resetClearTempUserIDRedux())
    
          // reset all pending signin details
          dispatch(resetAllSigningStateDetails())
    
          // clear bottom nav details
          dispatch(resetDefaultBottomNav())
    
          // reset chat bot
          dispatch(resetClearChatBot())
    
          //reset connect requests
          dispatch(resetClearCurrentConnectTop()) 
    
          // clear connect Notifications
          dispatch(resetClearCurrentConnectNotif())
    
          // reset clear conversations
          dispatch(resetClearConversations())
    
          // reset courses
          dispatch(resetClearCurrentCourses())
    
          // reset clear events any
          dispatch(resetClearCurrentEventsTop())
    
          // reset clear top events
          dispatch(resetClearCurrentEventsTop())
    
          // reset clear global search
          dispatch(resetClearCurrentGlobalSearch())
    
          // reset clear communities
          dispatch(resetClearCurrentGroupCommunities())
    
          // reset clear
          dispatch(resetClearCurrentJobFeedBack())
    
          // reset clear jobs
          dispatch(resetClearCurrentJobsTop())
    
          // reset clear job search
          dispatch(resetJobSearch())
    
          // clear jobs top
          dispatch(resetClearCurrentJobsTop())
    
          // clear modal people details
          dispatch(resetClearPeopleData())
    
          // clear network of people
          dispatch(resetClearCurrentNetwork())
    
          // clear post reaction
          dispatch(resetClearCurrentPostReactions())
    
          // clear post reports
          dispatch(resetClearCurrentReport())
    
          // clear posts
          dispatch(resetClearCurrentPosts())
    
          // clear posts top insights
          dispatch(resetClearCurrentPostsTop())
    
          // clear profile view
          dispatch(resetClearCurrentProfileView())
    
          // clear snack bars
          dispatch(resetClearCurrentSnack())
          
          // clear success msg any
          dispatch(resetClearCurrentSuccessRedux())
  }

  axios
    .post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/valid`)
    .then((res) => {
      setIsAuthorised(res.data.authorised);
    })
    .catch(async (err) => {
      // update user authorised to false
      setIsAuthorised(false);

      // clear all redux data
      handleClearReduxData()

        // update authMessage error in redux for display on auth pages
        dispatch(updateCurrentAuthMessage(err?.response?.data));
    });

  // check login status before proceeding
  return isOnline && isAuthorised ? children : <LoginAuth />;
};

export default AuthCheck;

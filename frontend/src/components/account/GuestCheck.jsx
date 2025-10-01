import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetDefaultBottomNav } from "../../redux/AppUI";
import { resetAllSigningStateDetails } from "../../redux/CompleteSigning";
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

const GuestCheck = ({ children }) => {
  // access current user online status from redux which is populated
  // from the server
  const { isGuest } = useSelector((state) => state.currentUser);
  const dispatch = useDispatch();

  const handleClearReduxData=useCallback(()=>{
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
  },[dispatch])

  // clear the redux data if user is guest,
  // avoids stale data 
  useEffect(()=>{
    if (isGuest) {
      handleClearReduxData()
    }
  },[isGuest,handleClearReduxData])


  // check login status before proceeding
  return children
};

export default GuestCheck;

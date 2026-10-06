import { ArrowForwardRounded, PersonRemoveOutlined } from "@mui/icons-material";
import { AvatarGroup, Box, IconButton, Tooltip, Typography, CircularProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showUserProfileDrawer } from "../../redux/AppUI";
import { updateTempUserIDRedux, updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import { updateCurrentNetworkID } from "../../redux/CurrentNetwork";
import CustomCountryName from "../utilities/CustomCountryName";
import { getImageMatch } from "../utilities/getImageMatch";

export default function UserNetworkLayout({ network, canRemove = true }) {
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.currentUser);
  const { isOpenDrawerProfile } = useSelector((state) => state.appUI);
  const currentUserId = user?._id;
  const firstName = network?.name?.trim()?.split(/\s+/)?.[0] || "Member";

  const handleViewProfile = () => {
    if (network?._id) {
      dispatch(updateTempUserIDRedux(network._id));
      if (!isOpenDrawerProfile) {
        dispatch(showUserProfileDrawer());
      }
    }
  };

  const handleUnfriendFriend = () => {
    setIsFetching(true);

    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_BASE_ROUTE}/connections/connection/unfriend/${currentUserId}/${network?._id}`
      )
      .then((res) => {
        if (res?.data) {
          dispatch(updateUserCurrentUserRedux(res.data.senderUser));
          dispatch(updateCurrentNetworkID(network?._id));
          // Note: You can trigger your MetatronSnackbar here if you pass a setNotify prop down
        }
      })
      .catch((err) => {
        console.error("Unfriend error:", err?.response?.data || err.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return (
    <List
      sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: "100%",
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(10px)",
        borderRadius: "8px",
        p: 1.15,
        mb: 1,
        border: "1px solid",
        borderColor: "rgba(255, 255, 255, 0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "primary.main",
          background: "rgba(214,178,94, 0.05)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
        }
      }}
    >
      <ListItem disableGutters sx={{ alignItems: 'flex-start', minWidth: 0 }}>
        <ListItemAvatar onClick={handleViewProfile} sx={{ cursor: "pointer" }}>
          <Tooltip title="View Profile" arrow>
            <Avatar
              src={network?.avatar}
              variant="rounded"
              sx={{
                background: "linear-gradient(135deg, #8B6F2A, #D6B25E)",
                border: "1px solid rgba(255,255,255,0.2)",
                width: 48,
                height: 48,
                fontWeight: 'bold',
                borderRadius: "8px",
              }}
              alt={network?.name}
            />
          </Tooltip>
        </ListItemAvatar>
        
        <ListItemText
          sx={{ ml: 1, minWidth: 0 }}
          primary={
            <Typography
              onClick={handleViewProfile}
              sx={{ color: "rgba(255,253,247,0.94)", letterSpacing: 0, cursor: "pointer" }}
              fontWeight={900}
              variant="subtitle2"
              noWrap
            >
              {firstName}
            </Typography>
          }
          secondary={
            <Box mt={0.5}>
              <Typography variant="caption" sx={{ color: "primary.main", display: 'block', mb: 0.5 }}>
                {network?.specialisationTitle || "Developer"}
              </Typography>
              
              <Typography variant="caption" sx={{ color: "rgba(255,253,247,0.68)", opacity: 0.8 }} noWrap>
                {CustomCountryName(network?.country)} • {network?.county}
              </Typography>

              {/* Skills Section */}
              <Box display="flex" mt={1.5}>
                <AvatarGroup 
                  max={5} 
                  sx={{
                    '& .MuiAvatar-root': { 
                      width: 22, 
                      height: 22, 
                      fontSize: 10,
                      borderColor: "background.default" 
                    }
                  }}
                >
                  {network?.selectedSkills?.map((skill) => (
                    <Tooltip title={skill} arrow key={skill}>
                      <Avatar
                        alt={skill}
                        src={getImageMatch(skill)}
                      />
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </Box>
            </Box>
          }
        />
      </ListItem>

      <Box ml={1} display="flex" alignItems="center">
        {!canRemove ? (
          <Tooltip title="View Profile" arrow>
            <IconButton
              onClick={handleViewProfile}
              sx={{
                border: '1px solid rgba(214,178,94,0.22)',
                borderRadius: '8px',
                color: 'primary.main',
                backgroundColor: 'rgba(214,178,94,0.06)',
                '&:hover': {
                  backgroundColor: 'rgba(214,178,94,0.12)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <ArrowForwardRounded sx={{ width: 18, height: 18 }} />
            </IconButton>
          </Tooltip>
        ) : (
        <Tooltip title="Remove Connection" arrow>
          <IconButton
            disabled={isFetching}
            onClick={handleUnfriendFriend}
            sx={{ 
              border: '1px solid',
              borderColor: 'rgba(214,178,94,0.22)',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,253,247,0.68)',
              '&:hover': {
                backgroundColor: 'rgba(214,178,94,0.10)',
                borderColor: 'primary.main',
                color: 'primary.main',
              }
            }}
          >
            {isFetching ? (
              <CircularProgress size={20} color="primary" />
            ) : (
              <PersonRemoveOutlined sx={{ width: 20, height: 20, color: 'inherit' }} />
            )}
          </IconButton>  
        </Tooltip>
        )}
      </Box>
    </List>
  );
}

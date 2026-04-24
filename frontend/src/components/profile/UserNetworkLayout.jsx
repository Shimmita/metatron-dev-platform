import { PersonRemoveOutlined } from "@mui/icons-material";
import { AvatarGroup, Box, IconButton, Tooltip, Typography, CircularProgress } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserCurrentUserRedux } from "../../redux/CurrentUser";
import { updateCurrentNetworkID } from "../../redux/CurrentNetwork";
import CustomCountryName from "../utilities/CustomCountryName";
import { getImageMatch } from "../utilities/getImageMatch";

export default function UserNetworkLayout({ network }) {
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.currentUser);
  const currentUserId = user?._id;

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
        // Apply Metatron Glassmorphism
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(10px)",
        borderRadius: "14px",
        p: 1.5,
        mb: 2,
        border: "1px solid",
        borderColor: "rgba(255, 255, 255, 0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "primary.main",
          background: "rgba(20, 210, 190, 0.05)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
        }
      }}
    >
      <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
        <ListItemAvatar>
          <Tooltip title="View Profile" arrow>
            <Avatar
              src={network?.avatar}
              variant="rounded"
              sx={{
                background: "linear-gradient(135deg, #0FA88F, #14D2BE)",
                border: "1px solid rgba(255,255,255,0.2)",
                width: 48,
                height: 48,
                fontWeight: 'bold'
              }}
              alt={network?.name}
            />
          </Tooltip>
        </ListItemAvatar>
        
        <ListItemText
          sx={{ ml: 1 }}
          primary={
            <Typography
              sx={{ color: "text.primary", letterSpacing: "0.02em" }}
              fontWeight={600}
              variant="subtitle2"
            >
              {network?.name}
            </Typography>
          }
          secondary={
            <Box mt={0.5}>
              <Typography variant="caption" sx={{ color: "primary.main", display: 'block', mb: 0.5 }}>
                {network?.specialisationTitle || "Developer"}
              </Typography>
              
              <Typography variant="caption" sx={{ color: "text.secondary", opacity: 0.8 }}>
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

      <Box ml={2}>
        <Tooltip title="Remove Connection" arrow>
          <IconButton
            disabled={isFetching}
            onClick={handleUnfriendFriend}
            sx={{ 
              border: '1px solid',
              borderColor: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                borderColor: 'error.main'
              }
            }}
          >
            {isFetching ? (
              <CircularProgress size={20} color="error" />
            ) : (
              <PersonRemoveOutlined sx={{ width: 20, height: 20, color: 'error.main' }} />
            )}
          </IconButton>  
        </Tooltip>
      </Box>
    </List>
  );
}
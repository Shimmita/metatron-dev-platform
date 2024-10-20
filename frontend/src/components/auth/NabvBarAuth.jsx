import React from "react";
import {
  AppBar,
  Box,
  Button,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const NabvBarAuth = ({ isLogin }) => {
  const navigate = useNavigate();
  const AuthToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
  });

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <AuthToolbar>
          <Box display={"flex"} alignItems={"center"}>
            <Typography className="fw-bold" variant="body1">
              GENZEE
            </Typography>
          </Box>
          {/* if isLoginMeans go registration */}
          {isLogin ? (
            <Button
              color="inherit"
              onClick={(e) => navigate("/genzee/auth/register")}
            >
              <Typography variant="caption">Register</Typography>
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={(e) => navigate("/genzee/auth/login")}
            >
              <Typography variant="caption">Login</Typography>
            </Button>
          )}
        </AuthToolbar>
      </AppBar>
    </>
  );
};

export default NabvBarAuth;

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import React from "react";
function DeleteAccount() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [checkBoxYes, setCheckBoxYes] = React.useState(false);
  const email = "shimitadouglas@gmail.com";

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleCheckbox = () => setCheckBoxYes(!checkBoxYes);

  return (
    <Box m={2}>
      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box className="w-75">
          <Box mb={2}>
            <Typography variant="body2" gutterBottom>
              This account will be deleted from the database and the process is
              irreversible. A grace period of 15 days will be provided such that
              within the grace period you can recover your account back, after
              the elapse of grace period there will be no more extension and you will
              be notified of permanent account deletion.
            </Typography>
          </Box>

          <Box mb={2}>
            <FormGroup onChange={handleCheckbox}>
              <FormControlLabel
                control={<Checkbox color="error" />}
                label={
                  <Typography variant="body2">
                    Yes delete my account *
                  </Typography>
                }
              />
            </FormGroup>
          </Box>

          <Box mb={2}>
            <TextField
              className="w-100"
              id="outlined-basic"
              label="Email"
              value={email}
              disabled
              variant="outlined"
            />
          </Box>

          <Box mb={2}>
            <FormControl className="w-100" variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </Box>

          <Box mb={2}>
            <FormControl className="w-100" variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
            </FormControl>
          </Box>

          {/* disable delete button if user not checked */}
          <Box>
            {checkBoxYes ? (
              <Button
                variant="contained"
                size="small"
                className="w-100"
                color="error"
              >
                Delete Account
              </Button>
            ) : (
              <Button
                disabled
                variant="contained"
                size="small"
                className="w-100"
                color="error"
              >
                Delete Account
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DeleteAccount;

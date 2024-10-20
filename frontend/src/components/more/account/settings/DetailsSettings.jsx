import { Photo } from "@mui/icons-material";
import { Avatar, Box, Button, IconButton } from "@mui/material";
import devImage from "../../../../images/dev.jpeg";

function GeneralSettings() {
  return (
    <Box>
      <Box className="p-2">
        <Box display={"flex"} justifyContent={'center'} alignItems={"center"}>
          <Box display={'flex'} gap={2}>
            <Avatar alt="icon" src={devImage} sx={{ width: 50, height: 50 }} />
            <Box display={"flex"} justifyContent={"center"}>
              <IconButton>
                <Photo color="primary"/>
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Box className="w-75">
            <Box m={2}>
              <input
                type="text"
                placeholder="Neiman Strotthon"
                disabled
                className="form-control"
              />
            </Box>

            <Box m={2}>
              <input
                type="text"
                placeholder="@Young ML"
                className="form-control"
              />
            </Box>

            <Box m={2}>
              <input
                type="email"
                placeholder="shimitadouglas@gmail.com"
                className="form-control"
              />
            </Box>
            <Box m={2}>
              <input
                type="tel"
                placeholder="+2540123456789"
                className="form-control"
              />
            </Box>

            <Box m={2}>
              <input
                type="text"
                placeholder="Nairobi"
                className="form-control"
              />
            </Box>

            <Box m={2}>
              <input
                type="password"
                placeholder="current password"
                className="form-control"
              />
            </Box>

            <Box m={2}>
              <input
                type="password"
                placeholder="change password"
                className="form-control"
              />
            </Box>

            <Box m={2}>
              <Button
                className="w-100"
                size="small"
                variant="contained"
                type="submit"
              >
                update changes
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default GeneralSettings;

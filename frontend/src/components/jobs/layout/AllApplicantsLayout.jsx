import { CloudDownloadRounded, MenuBookRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useSelector } from "react-redux";
import aws from "../../././../images/aws.jpeg";
import CustomDeviceIsSmall from "../../utilities/CustomDeviceIsSmall";

export default function AllApplicantsLayout({ index }) {
  // redux states
  const { isDarkMode } = useSelector((state) => state.appUI);
  // checkbox feedback value
  const [value, setValue] = React.useState("wait");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      bgcolor={"background.paper"}
    >
      <Box
        m={2}
        className={
          CustomDeviceIsSmall() ? "rounded p-1" : "shadow rounded px-4"
        }
        width={"100%"}
      >
        <List>
          <Box
            display={"flex"}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            <ListItem>
              <ListItemAvatar>
                <Avatar alt="" src={aws} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <>
                    {CustomDeviceIsSmall() ? (
                      <Typography variant="body2">
                        Ramadhan Yusuf Abdi
                      </Typography>
                    ) : (
                      <Typography
                        width={"100%"}
                        textAlign={"center"}
                        variant="body2"
                      >
                        Ramadhan Yusuf Abdi
                      </Typography>
                    )}
                  </>
                }
                secondary={
                  <>
                    {CustomDeviceIsSmall() ? (
                      <Typography variant="body2">
                        Machine Learning Engineer
                      </Typography>
                    ) : (
                      <Typography
                        width={"100%"}
                        textAlign={"center"}
                        variant="body2"
                      >
                        Machine Learning Engineer
                      </Typography>
                    )}
                  </>
                }
              />
            </ListItem>

            {/* date */}
            <Typography variant="caption" color={"text.secondary"}>
              10/11/2024
            </Typography>
          </Box>

          {/* text reminder recruter mark as proceed or reject */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Ramadhan Yusuf Abdi will get notified if he's proceeding or not on
              the platform. Its advisable that you should send a confirmation
              email to the applicant suppose they proceed or not.
            </Typography>
          </Box>
          <Box mt={1}>
            <Typography variant="body2" color="text.secondary">
              You can view the applicant's document while on the platform or
              download them for offline access by clicking the appropriate
              button.
            </Typography>
          </Box>

          <Box
            display={"flex"}
            justifyContent={"center"}
            flexDirection={"column"}
            gap={2}
            m={3}
          >
            {/* btn view applicants CVs and Cover letters */}
            <Button
              size="small"
              disableElevation
              variant={isDarkMode ? "text" : "outlined"}
              startIcon={<MenuBookRounded />}
              sx={{ borderRadius: "5px" }}
            >
              View Documents
            </Button>

            {/* btn download docs */}
            <Button
              size="small"
              disableElevation
              startIcon={<CloudDownloadRounded />}
              variant={isDarkMode ? "text" : "outlined"}
              sx={{ borderRadius: "5px" }}
            >
              Download Docs
            </Button>
          </Box>
          {/* check box waiting, proceed or reject */}
          <Box>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                <Typography variant="body2">
                  Applicant's feedback from the recruiting team on the platform
                </Typography>
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel
                  value={"wait"}
                  control={<Radio />}
                  label={
                    <>
                      <Typography variant="body2" color={"text.secondary"}>
                        Wait
                      </Typography>
                    </>
                  }
                />

                <FormControlLabel
                  value={"reject"}
                  control={<Radio color="warning" />}
                  label={
                    <>
                      <Typography variant="body2" color={"text.secondary"}>
                        Reject
                      </Typography>
                    </>
                  }
                />
                <FormControlLabel
                  value={"proceed"}
                  control={<Radio color="success" />}
                  label={
                    <>
                      <Typography variant="body2" color={"text.secondary"}>
                        Proceed
                      </Typography>
                    </>
                  }
                />
              </RadioGroup>
            </FormControl>
          
          </Box>
          {/* numbering */}
          <Box mt={1} display={"flex"} justifyContent={"flex-end"}>
            <Typography variant="body2" color={"text.secondary"}>
              Index: {index}
            </Typography>
          </Box>
          {CustomDeviceIsSmall() && (
            <Divider component={"li"} className="mt-3" />
          )}
          {!CustomDeviceIsSmall() && isDarkMode && (
            <Divider component={"li"} className="mt-3" />
          )}
        </List>
      </Box>
    </Box>
  );
}

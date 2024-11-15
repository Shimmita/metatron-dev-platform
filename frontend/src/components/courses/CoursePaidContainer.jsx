import { ArrowDropDown, TuneRounded } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { lazy, useState } from "react";
import { useSelector } from "react-redux";
import AllCourses from "../data/AllCourses";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
import CourseIcon from "./CourseIcon";
import SnackBarInfo from "./layout/SnackBarInfo";
const CoursePaid = lazy(() => import("./layout/CoursePaid"));

const CoursePaidContainer = () => {
  // array for live events simulation
  const items = Array.from({ length: 10 }, (_, i) => i);

  // dark mode
  const { isDarkMode } = useSelector((state) => state.appUI);

  // all menu controls
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedOption, setSelectedOption] = useState(
    "click play to preview a course"
  );

  const [openSnack, setOpenSnack] = React.useState(true);

  // handle web option
  const handleWeb = () => {
    // show sanckbar
    setOpenSnack(true);
    // info snack
    setSelectedOption("Web App Dev Courses");
  };

  // handle machine option
  const handleMachine = () => {
    // show sanckbar
    setOpenSnack(true);
    // info snack
    setSelectedOption("Machine Learning Courses");
  };

  // handle android option
  const handleAndroid = () => {
    // show sanckbar
    setOpenSnack(true);
    // info snack
    setSelectedOption("Android App Dev Courses");
  };

  // handle ios option
  const handleios = () => {
    // show sanckbar
    setOpenSnack(true);
    // info snack
    setSelectedOption("iOS App Dev Courses");
  };

  return (
    <Box>
      {/* courses bar */}
      <AppBar position="sticky" elevation={0} className="rounded-top">
        <Toolbar
          variant="dense"
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Button
              disableElevation
              endIcon={<ArrowDropDown />}
              size="small"
              sx={{ color: "white", fontWeight: "bold" }}
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              All
            </Button>

            <Button
              size="small"
              sx={{ color: "white", fontWeight: "bold" }}
              onClick={handleWeb}
            >
              Web
            </Button>

            <Button
              size="small"
              sx={{ color: "white", fontWeight: "bold" }}
              onClick={handleMachine}
            >
              ML/AI
            </Button>

            {/* dont on smallest devices like i6 */}
            {!CustomDeviceSmallest() && (
              <Button
                size="small"
                sx={{ color: "white", fontWeight: "bold" }}
                onClick={handleAndroid}
              >
                Android
              </Button>
            )}

            {/* show this on tablet++ */}
            {!CustomDeviceIsSmall() && (
              <>
                <Button
                  size="small"
                  sx={{ color: "white", fontWeight: "bold" }}
                  onClick={handleios}
                >
                  IOS
                </Button>
              </>
            )}

            {/* filter context: paid and free and search */}
            <IconButton size="small" className="ms-2">
              <TuneRounded sx={{ color: "white", width: 22, height: 22 }} />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* content */}
      <Box mt={1}>
        {items.length > 0 &&
          items.map((items, index) => (
            <>
              <CoursePaid key={index} />

              {/* divider */}
              {isDarkMode && !CustomDeviceIsSmall() && (
                <Box display={"flex"} justifyContent={"center"} mb={5} mt={2}>
                  <Divider component={"div"} className={"w-100"} />
                </Box>
              )}
              {CustomDeviceIsSmall() && (
                <Box display={"flex"} justifyContent={"center"} mb={3} mt={1}>
                  <Divider component={"div"} className={"w-100"} />
                </Box>
              )}
            </>
          ))}
      </Box>

      {/* menu all */}
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: 500,
              width: "41ch",
              overflow: "auto",
              // Hide scrollbar for Chrome, Safari and Opera
              "&::-webkit-scrollbar": {
                display: "none",
              },
              // Hide scrollbar for IE, Edge and Firefox
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            },
          },
        }}
      >
        {AllCourses.length > 0 &&
          AllCourses.map((option) => (
            <>
              <MenuItem
                key={option}
                onClick={() => {
                  setSelectedOption(option);
                  setSelectedOption(option);
                  setOpenSnack(true);
                  handleClose();
                }}
              >
                <Box display={"flex"} gap={2} alignItems={"center"}>
                  {/* icon */}
                  <CourseIcon option={option} />

                  {/* option text */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={"bold"}
                  >
                    {option}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider component={"div"} />
            </>
          ))}
      </Menu>

      {/* show snackbar */}
      <SnackBarInfo
        setOpenSnack={setOpenSnack}
        openSnack={openSnack}
        snackInfo={selectedOption}
      />
    </Box>
  );
};

export default CoursePaidContainer;

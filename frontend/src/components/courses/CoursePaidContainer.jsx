import {
  AccountBalanceWalletRounded,
  AccountBoxRounded,
  AppsRounded,
  ArrowDropDown,
  Close,
  CloudCircleRounded,
  DoneRounded,
  FavoriteRounded,
  HelpRounded,
  SchoolRounded,
  TuneRounded,
} from "@mui/icons-material";
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
  Tooltip,
  Typography,
} from "@mui/material";
import React, { lazy, useState } from "react";
import { useSelector } from "react-redux";
import AllCourses from "../data/AllCourses";
import CourseIcon from "../utilities/CourseIcon";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceSmallest from "../utilities/CustomDeviceSmallest";
const WalletLayout = lazy(() => import("../custom/WalletLayout"));
const SnackBarInfo = lazy(() => import("../snackbar/SnackBarInfo"));
const AlertCourseSearch = lazy(() => import("../alerts/AlertCourseSearch"));
const CourseLayout = lazy(() => import("./layout/CourseLayout"));
// array for live events simulation
const items = Array.from({ length: 10 }, (_, i) => i);

const CoursePaidContainer = () => {
  const [openCourseAlert, setOpenCourseAlert] = useState(false);
  const [counter, setCounter] = useState(0);
  const [showManagement, setShowManagement] = useState(false);
  const [isManagementSnack, setIsManagementSnack] = useState(false);
  const [managementMSG, setManagementMSG] = useState("");
  // redux states
  const { isDarkMode, isSimilarCoursesModal } = useSelector(
    (state) => state.appUI
  );

  // all menu controls
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClickMain = (event) => {
    setAnchorEl(event.currentTarget);

    setCounter(0);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedOption, setSelectedOption] = useState(
    "click play to preview a course"
  );

  const [openSnack, setOpenSnack] = React.useState(true);

  // handle free courses
  const handleFree = () => {
    setCounter(1);
  };

  // handle machine option
  const handleMachine = () => {
    // show snackbar
    setOpenSnack(true);
    // info snack
    setSelectedOption("Machine Learning/Robotics/AI");
    setCounter(2);
  };

  // handle ios option
  const handleios = () => {
    // show snackbar
    setOpenSnack(true);
    // info snack
    setSelectedOption("iOS App Development");
    setCounter(3);
  };

  // handle android option
  const handleAndroid = () => {
    // show snackbar
    setOpenSnack(true);
    // info snack
    setSelectedOption("Android App Development");
    setCounter(4);
  };

  // handle searching or filtering of courses
  const handleCoursesFiltering = () => {
    setOpenCourseAlert(true);
    setCounter(5);
  };

  // handle codurse management
  const handleCourseManager = () => {
    setCounter(6);
    setCounter(7);
    // show course management menu
    setShowManagement(true);
  };

  // handle closing course manager
  const handleCloseCourseManager = () => {
    setShowManagement(false);
    setCounter(0);
  };

  // handle enrolled courses
  const handleEnrolledCourses = () => {
    setCounter(7);
    setIsManagementSnack(true);
    setManagementMSG("enrolled courses");
  };

  // handle favourite courses
  const handleFavouriteCourses = () => {
    setCounter(8);
    setIsManagementSnack(true);
    setManagementMSG("favourite courses");
  };

  // handle account wallet
  const handleAccountWallet = () => {
    setCounter(9);
    setIsManagementSnack(true);
    setManagementMSG("account wallet ");
  };

  // handle uploaded courses
  const handleUploadedCourses = () => {
    setCounter(10);
    setIsManagementSnack(true);
    setManagementMSG("uploaded courses");
  };

  // handle help
  const handleHelpCenter = () => {
    setCounter(11);
    setIsManagementSnack(true);
    setManagementMSG("technical support");
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
            width={"100%"}
            direction={"row"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <React.Fragment>
              {showManagement ? (
                <Box
                  width={"100%"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Box
                    width={"100%"}
                    display={"flex"}
                    alignItems={"center"}
                    gap={CustomDeviceIsSmall() ? 1 : 2}
                    justifyContent={"start"}
                  >
                    {/* enrolled */}
                    <IconButton onClick={handleEnrolledCourses}>
                      <Tooltip arrow title={"enrolled courses"}>
                        <SchoolRounded
                          className={counter === 7 && "border-bottom pb-1"}
                          sx={{ color: "white", width: 30, height: 30 }}
                        />
                      </Tooltip>
                    </IconButton>

                    {/* favourite */}
                    <IconButton onClick={handleFavouriteCourses}>
                      <Tooltip arrow title={"favorite courses"}>
                        <FavoriteRounded
                          sx={{ color: "white", width: 28, height: 28 }}
                          className={counter === 8 && "border-bottom pb-1"}
                        />
                      </Tooltip>
                    </IconButton>

                    {/* uploaded courses */}
                    <IconButton onClick={handleUploadedCourses}>
                      <Tooltip arrow title={"uploaded courses"}>
                        <CloudCircleRounded
                          sx={{ color: "white", width: 28, height: 28 }}
                          className={counter === 10 && "border-bottom pb-1"}
                        />
                      </Tooltip>
                    </IconButton>

                    {/* wallet */}
                    <IconButton onClick={handleAccountWallet}>
                      <Tooltip arrow title={"account wallet"}>
                        <AccountBalanceWalletRounded
                          sx={{ color: "white", width: 28, height: 28 }}
                          className={counter === 9 && "border-bottom pb-1"}
                        />
                      </Tooltip>
                    </IconButton>

                    {/* technical support */}
                    <IconButton onClick={handleHelpCenter}>
                      <Tooltip arrow title={"technical support"}>
                        <HelpRounded
                          sx={{ color: "white", width: 28, height: 28 }}
                          className={counter === 11 && "border-bottom pb-1"}
                        />
                      </Tooltip>
                    </IconButton>
                  </Box>

                  <Box
                    width={"100%"}
                    display={"flex"}
                    justifyContent={"flex-end"}
                  >
                    {/* close icon */}
                    <IconButton onClick={handleCloseCourseManager}>
                      <Tooltip arrow title={"close tab"}>
                        <Close sx={{ width: 20, height: 20, color: "white" }} />
                      </Tooltip>
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <React.Fragment>
                  <Button
                    disableElevation
                    startIcon={
                      <ArrowDropDown
                        sx={{
                          rotate: open ? undefined : "-90deg",
                          width: 22,
                          height: 22,
                        }}
                      />
                    }
                    endIcon={
                      selectedOption.includes("click") ? (
                        <AppsRounded sx={{ width: 20, height: 20 }} />
                      ) : (
                        <CourseIcon option={selectedOption} />
                      )
                    }
                    size="small"
                    sx={{ color: "white", fontWeight: "bold" }}
                    aria-label="more"
                    id="long-button"
                    className={counter === 0 && "border"}
                    aria-controls={open ? "long-menu" : undefined}
                    aria-expanded={open ? "true" : undefined}
                    aria-haspopup="true"
                    onClick={handleClickMain}
                  />

                  <Button
                    disableElevation
                    className={counter === 1 ? "border ms-2" : "ms-2"}
                    size="small"
                    sx={{ color: "white", fontWeight: "bold" }}
                    onClick={handleFree}
                  >
                    Free
                  </Button>

                  {/* don't on smallest screens like iphone 6 */}
                  {!CustomDeviceSmallest() && (
                      <Button
                        disableElevation
                        className={counter === 2 && "border"}
                        size="small"
                        sx={{ color: "white", fontWeight: "bold" }}
                        onClick={handleMachine}
                      >
                        ML/AI
                      </Button>
                  )}

                  {/* show this on tablet++ */}
                  {!CustomDeviceIsSmall() && (
                      <Button
                        disableElevation
                        className={counter === 3 && "border"}
                        size="small"
                        sx={{ color: "white", fontWeight: "bold" }}
                        onClick={handleios}
                      >
                        IOS
                      </Button>
                  )}

                  {/* show this on tablet++ */}
                  {!CustomDeviceIsSmall() && (
                      <Button
                        disableElevation
                        className={counter === 4 && "border"}
                        size="small"
                        sx={{ color: "white", fontWeight: "bold" }}
                        onClick={handleAndroid}
                      >
                        Android
                      </Button>
                  )}

                  {/* filter context: paid and free and search */}
                  <IconButton
                    className={counter === 5 ? "border ms-3" : "ms-3"}
                    size="small"
                    onClick={handleCoursesFiltering}
                  >
                    <TuneRounded
                      sx={{ color: "white", width: 22, height: 22 }}
                    />
                  </IconButton>

                  {/* settings or manage icon */}
                  <IconButton
                    onClick={handleCourseManager}
                    className={counter === 6 ? "border ms-3" : "ms-3"}
                  >
                    <AccountBoxRounded
                      sx={{ color: "white", width: 22, height: 22 }}
                    />
                  </IconButton>
                </React.Fragment>
              )}
            </React.Fragment>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* divider */}
      {isDarkMode && <Divider className="pb-2 p-1" component={"div"} />}

      {/* content */}
      <Box mt={1} p={1}>
        {/* courses */}
        {counter === 0 && (
          <React.Fragment>
            {items.length > 0 &&
              items.map((items, index) => (
                <Box mb={2} key={items}>
                  <CourseLayout />

                  {/* divider */}
                  {isDarkMode && !CustomDeviceIsSmall() && (
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      mb={5}
                      mt={2}
                    >
                      <Divider component={"div"} className={"w-100"} />
                    </Box>
                  )}
                  {CustomDeviceIsSmall() && (
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      mb={2}
                      mt={1}
                    >
                      <Divider component={"div"} className={"w-100"} />
                    </Box>
                  )}
                </Box>
              ))}
          </React.Fragment>
        )}

        {/* account wallet */}
        {counter === 9 && (
          <Box height={"82vh"}>
            <WalletLayout />
          </Box>
        )}

        {/* uploaded courses */}
        {counter === 10 && (
          <Box height={"82vh"}>
            <React.Fragment>
              {items.length > 0 &&
                items.map((items, index) => (
                  <Box mb={2} key={items}>
                    <CourseLayout key={index} isUploadedRequest={true} />

                    {/* divider */}
                    {isDarkMode && !CustomDeviceIsSmall() && (
                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        mb={5}
                        mt={2}
                      >
                        <Divider component={"div"} className={"w-100"} />
                      </Box>
                    )}
                    {CustomDeviceIsSmall() && (
                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        mb={2}
                        mt={1}
                      >
                        <Divider component={"div"} className={"w-100"} />
                      </Box>
                    )}
                  </Box>
                ))}
            </React.Fragment>
          </Box>
        )}

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

                  {/* done icon if the option is the currently selected */}
                  {option
                    .toLowerCase()
                    .includes(selectedOption.toLowerCase()) && (
                    <DoneRounded color="success" />
                  )}
                </Box>
              </MenuItem>
              <Divider component={"div"} />
            </>
          ))}
      </Menu>

      {/* show alert search courses */}
      <AlertCourseSearch
        openSearchCourse={openCourseAlert}
        setOpenSearchCourse={setOpenCourseAlert}
      />
    
      {/* show snackbar */}
      <SnackBarInfo
        setOpenSnack={setOpenSnack}
        openSnack={openSnack}
        snackInfo={selectedOption}
        managementMSG={managementMSG}
        isManagementSnack={isManagementSnack}
        setIsManagementSnack={setIsManagementSnack}
      />
    </Box>
  );
};

export default CoursePaidContainer;

import {
  PeopleRounded,
  Smartphone
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Divider,
  FormHelperText,
  Skeleton,
  styled,
  Tooltip,
  Typography
} from "@mui/material";


import axios from "axios";
import { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import AlertGeneral from "../alerts/AlertGeneral";
import CustomCountryName from "../utilities/CustomCountryName";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import { getImageMatch } from "../utilities/getImageMatch";
import StepperStats from "./StepperStats";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.5s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.5)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

  // screen width
  const screenWidth = window.screen.availWidth;

  const BoxAvatarContent = styled(Box)({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
  });


  const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.secondary,
  '& > :not(style) ~ :not(style)': {
    marginTop: theme.spacing(2),
  },
}));



const Sidebar = () => {
  const [openMobileApp, setOpenMobileApp] = useState(false);
  const [dataInsights,setDataInsights]=useState([])
  const [dataTools,setDataTools]=useState([])
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  

  // redux sates
  const {
    currentMode,
    isSidebarRighbar,
    isTabSideBar,
    isLoadingPostLaunch: isLoadingRequest,
  } = useSelector((state) => state.appUI);

   const isDarkMode=currentMode==='dark'
  const { user } = useSelector((state) => state.currentUser);


   //fetch all insights from the backend
    useLayoutEffect(() => {
      if (dataInsights.length>0) {
        return
      }
      // set is fetching to true
      setIsFetching(true);
  
      // performing get request
      axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/insights/all`, {
          withCredentials: true,
        })
        .then((res) => {
          // update the redux of current post
          if (res?.data) {
            setDataInsights(res.data.insights)
            setDataTools(res.data.tools)
          }
        })
        .catch((err) => {
          if (err?.code === "ERR_NETWORK") {
            setErrorMessage(
              "Server is unreachable "
            );
            return;
          }
          setErrorMessage(err?.response.data);
  
        })
        .finally(() => {
          // set is fetching to false
          setIsFetching(false);
        });
    }, [dataInsights.length]);

   
    // return the screen width in parentage for wider screens
  // to handle correct positioning issues with middle content feed
  
  const correctWidthInPercentage = () => {
    if (screenWidth > 1200 && screenWidth <= 1400) {
      return "25%";
    }
  };

  // fun to make the sidebar equidistant from the feed in relation to the rightbar
  // for larger screens like laptops above 1400
  const equidistantSidebar = (screen) => {
    if (screenWidth > 1400) {
      return "8%";
    }
  };
  
  return (
    <Box
      height={"90vh"}
      flex={CustomDeviceTablet() ? 1 : 2}
      p={CustomDeviceTablet() ? 1 : 2}
      marginLeft={equidistantSidebar()}
      sx={{
        display: {
          xs: "none",
          sm: CustomDeviceTablet()
            ? isSidebarRighbar && isTabSideBar
              ? "block"
              : "none"
            : "none",
          md: isSidebarRighbar ? "block" : "none",
          marginRight: CustomDeviceTablet() ? "6rem" : undefined,
        },
      }}
    >
      <Box
        position={"fixed"}
        width={correctWidthInPercentage()}
        maxHeight={"80vh"}
        sx={{
        
          overflow: "auto",
          // Hide scrollbar for Chrome, Safari and Opera
          "&::-webkit-scrollbar": {
            display: "none",
          },
          // Hide scrollbar for IE, Edge and Firefox
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
      {/* section profile and insights */}
        <Box
        bgcolor={"background.default"} 
        className=" rounded-2"
        sx={{ 
          border:isDarkMode && "1px solid",
          borderColor:"divider",
         }}
         width={CustomLandscapeWidest() ? 300 : undefined}>
          <Box >
            {isLoadingRequest ? (
              <Box width={"100%"}>
                <Box mb={1} display={"flex"} justifyContent={"center"}>
                  <Skeleton variant="circular" width={80} height={80} />
                </Box>
                <Skeleton variant="rectangular" height={"20vh"} />
              </Box>
            ) : (
              <BoxAvatarContent >
                <Box width={"100%"}>
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      flexDirection={'column'}
                      alignItems={"center"}
                      mt={1.2}
                    >
                    <Box 
                    display={'flex'}
                    alignItems={'center'}
                    mb={1}
                    gap={2}
                    >
                    {/* avatar container */}
                      <StyledBadge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        variant="dot"
                      >
                        <Avatar
                          alt={''}
                          src={user?.avatar}
                          sx={{
                            width: 70,
                            height: 70,
                            color: "white",
                            backgroundColor: isDarkMode ? "#42A5F5":"#1976D2",
                            }}
                        />
                      </StyledBadge>
                      {/* naming container */}
                      <Box >
                        {/* name */}
                          <Typography
                            variant="body2"
                            fontWeight={"bold"}
                            textTransform={"uppercase"}
                            color={isDarkMode ? "whitesmoke" : "inherit"}
                          >
                              {user?.name}
                          </Typography>

                          {/* specialization */}
                          <Typography
                           variant="caption"
                          textTransform={"capitalize"}
                          >
                          {user?.specialisationTitle}
                          </Typography>

                          {/* country */}
                          <Box>
                          <FormHelperText
                          variant="caption" 
                          sx={{ display:'flex',alignItems:'center', gap:1 }}
                          >
                           {user?.county} 
                           {/* divider */}
                           <Divider 
                           component={'div'} 
                           className="py-1"
                           orientation="vertical"/>

                            {CustomCountryName(user?.country)}
                          </FormHelperText>
                          </Box>

                          {/* skills */}
                           <Box 
                           mt={0.5}
                           display={"flex"} 
                           alignItems={'center'}
                           gap={1}
                           justifyContent={"flex-start"}>
                           {/* skills */}
                          <AvatarGroup max={user?.selectedSkills?.length}>
                            {/* loop through the skills and their images matched using custom fn */}
                            {user?.selectedSkills?.map((skill, index) => (
                              <Tooltip title={skill} arrow  key={index}>
                                <Avatar
                                  alt={skill}
                                  className="border"
                                  sx={{ width: 21, height: 21 }}
                                  src={getImageMatch(skill)}
                                />
                              </Tooltip>
                            ))}
                          </AvatarGroup>
                           {/* divider */}
                           <Divider 
                           component={'div'} 
                           className="py-1"
                           orientation="vertical"/>

                           <Box
                           justifyContent={'center'}
                           alignItems={'center'}
                           gap={0.8}
                           color={'text.secondary'}
                           display={'flex'}>
                           {/* connections count */}
                           <Typography 
                           pt={0.5}
                           variant="caption"
                           >
                           {user?.network_count}
                           </Typography>
                          
                           {/* people icon */}
                           <PeopleRounded
                            sx={{ width:20,height:20}}/>
                           </Box>
                        </Box>
                      </Box>
                      </Box>

                     {/* divider */}
                      <Root className="my-2 px-3">
                      <Divider variant="middle" className="px-3">
                      <Box 
                      display={'flex'} 
                      justifyContent={'center'}>
                      <Typography 
                      fontWeight={'bold'}
                      color={'primary'}
                      variant="caption"
                       >
                       Top Insights
                       </Typography>
                      </Box>
                      </Divider>
                      </Root>
                    <Box 
                    mb={1}
                    display={"flex"} 
                    justifyContent={"center"} >
                      {!isFetching && 
                      <StepperStats 
                      isDarkMode={isDarkMode}
                      errorMessage={errorMessage}
                      isFetching={isFetching}
                      dataInsights={dataInsights}/>}
                    </Box>

                  {/* section more insights */}
                  <Box
                  mt={0.5}
                  p={0.1}
                  >
                  <Root className="mt-1">
                    <Divider>
                    <Box display={'flex'} justifyContent={'center'}>
                    <Typography 
                    fontWeight={'bold'}
                    color={'primary'}
                    variant="caption"
                    >
                    Top Tools
                    </Typography>
                    </Box>
                    </Divider>
                  </Root>
                  
                  {/* Tools */}
                  <Box
                  alignItems={'center'}
                  gap={2}
                  mt={0.5}
                  justifyContent={'center'}
                  display={'flex'}>
                {dataTools.map(tool=>(
                  <Box 
                  key={tool.title}
                  justifyContent={'center'}
                  flexDirection={'column'}
                  display={'flex'}>
                  {/* avatar */}
                  <Avatar 
                  sx={{ width:28,height:28}}
                  src={getImageMatch(tool.title)}
                  />

                  {/* title */}
                  <Box 
                  pb={0.2}
                   display={'flex'}
                   justifyContent={'center'}>
                    <FormHelperText 
                    className={isDarkMode && 'text-info'}
                    sx={{ fontSize:'x-small' }}>{tool.title?.substring(0,10)}</FormHelperText>
                    </Box>
                  </Box>
                ))}
                  </Box>
                  </Box>

                </Box>
              </Box>
        </BoxAvatarContent>
            )}
          </Box>
        </Box>

      </Box>

      {/* alert General for mobile app under development */}
      <AlertGeneral
        title={"Mobile App"}
        message={"Mobile application is still under development once completed by our esteemed software engineers, it will be rolled out."}
        openAlertGeneral={openMobileApp}
        setOpenAlertGenral={setOpenMobileApp}
        defaultIcon={<Smartphone/>}
      />
    </Box>
  );
};

export default Sidebar;

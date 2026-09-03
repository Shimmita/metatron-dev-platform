import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  FormHelperText,
  IconButton,
  styled,
  Tooltip,
  Typography
} from "@mui/material";
import {
  ArticleRounded,
  CalendarMonthRounded,
  CloseRounded,
  DashboardRounded,
  SchoolRounded,
  WorkRounded,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentBottomNav } from "../../redux/CurrentBottomNav";
import { appColors, appGradients } from "../../utils/colors";
import StepperStats from "../sidebar/StepperStats";
import CustomCountryName from "../utilities/CustomCountryName";
import { getImageMatch } from "../utilities/getImageMatch";
import { useNavigate } from "react-router-dom";


const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.main,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

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
}))


const DrawerSmartphone = ({
  openDrawer,
  setOpenDrawer,
}) => {

  // redux states
  const { currentMode } = useSelector((state) => state.appUI);
  const theme = useTheme();
  const isDarkMode=currentMode==='dark'

  const { user,isGuest,usersCount } = useSelector((state) => state.currentUser);
  const dispatch=useDispatch()
  const navigate = useNavigate()
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataInsights,setDataInsights]=useState([])
  const [dataTools,setDataTools]=useState([])
  
  const mobileNavItems = [
    { label: "Dashboard", route: "/explore", nav: 0, icon: <DashboardRounded fontSize="small" /> },
    { label: "Tech Gigs", route: "/jobs", nav: 1, icon: <WorkRounded fontSize="small" /> },
    { label: "Events", route: "/events", nav: 2, icon: <CalendarMonthRounded fontSize="small" /> },
    { label: "Courses", route: "/courses/available", nav: 3, icon: <SchoolRounded fontSize="small" /> },
    { label: "Content", route: "/explore", nav: 0, icon: <ArticleRounded fontSize="small" /> },
  ];

  const handleNavigate = (item) => {
    navigate(item.route);
    dispatch(updateCurrentBottomNav(item.nav));
    setOpenDrawer(false);
  };

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
            setErrorMessage(err?.response?.data || "Unable to load insights.");
    
          })
          .finally(() => {
            // set is fetching to false
            setIsFetching(false);
          });
      }, [dataInsights.length]);


  return (
    <Drawer
      open={openDrawer}
      onClose={(e) => setOpenDrawer(false)}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 420 },
          maxWidth: "100vw",
          borderRight: "1px solid",
          borderColor: isDarkMode ? appColors.border : "rgba(15,23,42,0.12)",
          background: isDarkMode
            ? "linear-gradient(180deg, rgba(5,8,18,0.98), rgba(11,18,32,0.98))"
            : appGradients.soft,
          overflow: "hidden",
        },
      }}
    >
      <Box 
      px={{ xs: 1.25, sm: 1.75 }}
      width="100%"
      height={"100%"} 
      sx={{
        backgroundImage: isDarkMode
          ? "linear-gradient(180deg, rgba(32,214,199,0.08), rgba(8,17,31,0.96))"
          : "linear-gradient(180deg, #F8FAFC, #EEF7FF)",
      }}
      >
      <Box 
      mt={0.5}
      p={1}
      className='rounded-2'>

        {/* theme changer */}
        <Box
        mt={0.5}
        display={'flex'}
        alignItems={'center'}
        textAlign={'center'}
        justifyContent={'space-between'}
        >
        
          {/* title be shown in smallest devices */}
          <Box>
            <Typography fontWeight={900} variant="body2">
              Metatron Dev
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Career intelligence hub
            </Typography>
          </Box>
          <IconButton
            onClick={() => setOpenDrawer(false)}
            sx={{
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CloseRounded sx={{ width: 17, height: 17 }} />
          </IconButton>

           {/* icon button */}
            {/* <IconButton onClick={handleShowDarkMode}>
            <Tooltip arrow title={isDarkMode ?  "Light": "Dark" }>
            <DarkModeRounded/>
          </Tooltip>
          </IconButton> */}
        </Box>


          {/* avatar and its subsequent content */}
                <BoxAvatarContent>
                    <Box 
                    display={'flex'}
                    alignItems={'center'}
                    mb={1}
                    p={2}
                    borderRadius={"8px"}
                    gap={2}
                    width={'100%'}
                  sx={{
                    background: isDarkMode ? "rgba(255,255,255,0.045)" : appGradients.soft,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
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
                              width: 80,
                              height: 80,
                              color: theme.palette.common.white,
                              backgroundColor: theme.palette.primary.main,
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
                                {user?.name ||"Guest Mode"}
                            </Typography>

                            {/* specialization */}
                            <Typography
                            variant="caption"
                            textTransform={"capitalize"}
                            >
                            {user?.specialisationTitle||"Login or Register"} <br/>
                          {isGuest && usersCount + "+ developers"}
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

                            {/* friends */}
                            <Box display={isGuest ?'none':'block'}>
                            <FormHelperText
                            variant="caption" 
                            sx={{ display:'flex',alignItems:'center', gap:1 }}
                            >
                            Followers
                              {/* divider */}
                            <Divider 
                            component={'div'} 
                            className="py-1"
                            orientation="vertical"/>
                            {user?.network_count}
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
                          </Box>
                        </Box>
                        </Box>

                      <Box
                        mt={1}
                        width="100%"
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                          gap: 1,
                        }}
                      >
                        {mobileNavItems.map((item) => (
                          <Button
                            key={item.label}
                            onClick={() => handleNavigate(item)}
                            startIcon={item.icon}
                            variant="outlined"
                            size="small"
                            sx={{
                              justifyContent: "flex-start",
                              borderRadius: "8px",
                              borderColor: "divider",
                              minHeight: 42,
                              fontSize: 11,
                            }}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </Box>

                      <Box
                      mt={3}
                    display={"flex"} 
                    justifyContent={"center"} >
                      {!isFetching && 
                      <StepperStats 
                      isDarkMode={isDarkMode}
                      errorMessage={errorMessage}
                      isFetching={isFetching}
                      dataInsights={dataInsights}/>}
                    </Box>
              </BoxAvatarContent>

               {/* section more insights */}
                      <Box
                      mt={3}
                      py={0.1}
                      bgcolor={"background.default"}
                      sx={{ 
                        border: "1px solid",
                        borderColor:"divider",
                        borderRadius: "8px",
                    
                       }}
                      >
                       <Root className="px-3 mt-1">
                        <Divider>
                        <Box display={'flex'} justifyContent={'center'}>
                        <Typography 
                        color={'text.primary'}
                        variant="caption"
                        >Top Tools</Typography>
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
                      <Box display={'flex'} justifyContent={'center'}>
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
    </Drawer>
  );
};

export default DrawerSmartphone;

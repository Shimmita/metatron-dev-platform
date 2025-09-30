import { DarkModeRounded } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Divider,
  Drawer,
  FormHelperText,
  IconButton,
  styled,
  Tooltip,
  Typography
} from "@mui/material";
import axios from "axios";
import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetDarkMode } from "../../redux/AppUI";
import StepperStats from "../sidebar/StepperStats";
import CustomCountryName from "../utilities/CustomCountryName";
import { getImageMatch } from "../utilities/getImageMatch";


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
   const isDarkMode=currentMode==='dark'

  const { user,isGuest } = useSelector((state) => state.currentUser);
  const dispatch=useDispatch()
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataInsights,setDataInsights]=useState([])
  const [dataTools,setDataTools]=useState([])
  
  

  // UI theme dark light tweaking effect
    const handleShowDarkMode = () => {
    // update the redux theme boolean state
    dispatch(resetDarkMode());
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
            setErrorMessage(err?.response.data);
    
          })
          .finally(() => {
            // set is fetching to false
            setIsFetching(false);
          });
      }, [dataInsights.length]);


  return (
    <Drawer open={openDrawer} onClose={(e) => setOpenDrawer(false)}>
      <Box 
      px={0.5}
      maxWidth={320} 
      height={"100%"} 
      bgcolor={'background.default'} 
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
          <Typography
          fontWeight={'bold'}
           textAlign={'center'} variant="body2"
           textTransform={'uppercase'}>Metatron</Typography>

           {/* icon button */}
          <IconButton onClick={handleShowDarkMode}> 
            <Tooltip arrow title={isDarkMode ?  "Light": "Dark" }>
            <DarkModeRounded/>
          </Tooltip> 
          </IconButton>
        </Box>


          {/* avatar and its subsequent content */}
                <BoxAvatarContent>
                      <Box 
                      display={'flex'}
                      alignItems={'center'}
                      mb={1}
                      p={2}
                      borderRadius={2}
                      gap={2}
                      width={'100%'}
                    sx={{
                      background: !isDarkMode && 
                    "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
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
                                {user?.name ||"Guest Mode"}
                            </Typography>

                            {/* specialization */}
                            <Typography
                            variant="caption"
                            textTransform={"capitalize"}
                            >
                            {user?.specialisationTitle||"Login or Register"}
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
                      className=" rounded-4"
                      sx={{ 
                        border:isDarkMode && "1px solid",
                        borderColor:"divider",
                    
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

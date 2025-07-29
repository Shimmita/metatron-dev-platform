import { SortRounded } from "@mui/icons-material";
import { Box, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPosts } from "../../redux/CurrentPosts";
import CourseIcon from "../utilities/CourseIcon";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertFilterFeed({
  openAlert,
  setOpenAlert,
  title = "Feed Content Customization",
  feedData=[],
  selectedOptions=[],
  setSelectedOptions,
  
}) {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const dispatch=useDispatch()
  const { isTabSideBar } = useSelector((state) => state.appUI);
  
  const handleClose = () => {
    // clear message
    setErrorMessage("")
    // close alert
    setOpenAlert(false);
  };

  // handle change when checkbox is checked
  const handleChange = (event) => {
    const targetChecked = event.target.checked;
    const value = event.target.value;
  
    if (targetChecked) {
      // add the value if it doesn't already exist
      if (!selectedOptions.includes(value)) {
        setSelectedOptions(prev => [...prev, value]);
      }
    } else {
      // remove the value if it was unchecked
      setSelectedOptions(prev => prev.filter(item => item !== value));
    }
  };
  

  //   handle when user dismissed the dialog
  const handleDismiss = () => {
    // clear the selections
    selectedOptions.length=0
    
    // call close function
    handleClose();
  };

  // handle enter
  const handleEnter=()=>{
    // set is fetching to true
        setIsFetching(true);
    
        // performing get request
        axios.post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all`, selectedOptions,{
            withCredentials: true,
          })
          .then((res) => {
            // update the redux of current post
            if (res?.data) {
              // update the redux posts content
              dispatch(updateCurrentPosts(res.data));

              // close the dialog automatically
              handleClose()
            }
          })
          .catch((err) => {
            if (err?.code === "ERR_NETWORK") {
              setErrorMessage(
                "server is unreachable "
              );
              return;
            }
            setErrorMessage(err?.response.data);
          })
          .finally(() => {
            // set is fetching to false
            setIsFetching(false);
        });

  }

     // handle width of the filter search
     const handleFilterWidth=()=>{
      if (CustomDeviceTablet() && isTabSideBar) {
        return "36%"
      } else if(CustomLandScape()){
        return "-8%"
      } else if(CustomLandscapeWidest()){
        return "-5%"
      }
    }

  return (
      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        sx={{
          backdropFilter:'blur(3px)',
          marginLeft:handleFilterWidth()
        }}
      >
       <DialogTitle
        display={"flex"}
        alignItems={"center"}
        variant="body1"
        fontWeight={"bold"}
        gap={2}
        >
          <SortRounded/>
          {title}
        </DialogTitle>       
         <DialogContent 
         dividers 
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
          {isFetching ? (
            <Box width={'100%'} height={'15vh'} display={'flex'} justifyContent={'center'}>
              <Stack justifyContent={'center'} gap={2} width={'100%'}>
                {/* loader */}
                <Box display={'flex'} justifyContent={'center'}>
              <CircularProgress size={30}/>
                </Box>
              {/* text */}
              <Typography textAlign={'center'} variant="body2">
               Loading Content...
              </Typography>
              </Stack>
            </Box>
          ):(
          <FormControl component="fieldset" variant="standard">
            {/* message helper text info, error */}
            {errorMessage && 
            <Box display={'flex'} justifyContent={'center'}>
          <FormHelperText className={"mb-1 text-warning fw-bold"}>
            {errorMessage}
            </FormHelperText>
            </Box>
            }

            {/* form data checkboxes */}
          <FormGroup>
          {feedData?.map(data=>(
            <Box key={data}>
            <Box 
            display={'flex'}
            alignItems={'center'}
            gap={2}
            >
              {/* icon */}
              <CourseIcon option={data} />
              
            {/* radio button */}
            <FormControlLabel 
            value={data} 
            control={<Checkbox 
              onChange={handleChange}
               name={data} 
               checked={selectedOptions.includes(data)}
               />} 
            label={
              <Typography 
              color={selectedOptions.includes(data) && 'primary'}
              variant="body2"
              >
                {data}
              </Typography>
            } />
            </Box>
            <Divider 
            component={'div'}/>
          </Box>
          ))
          }
          </FormGroup>
        
          </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
           onClick={handleDismiss}
           disabled={isFetching}
           >
            Close
          </Button>
          <Button
          onClick={handleEnter}
          disabled={selectedOptions?.length<1 || isFetching}
          >
            Sort
          </Button>
        </DialogActions>
      </Dialog>
  );
}

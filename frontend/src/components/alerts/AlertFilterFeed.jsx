import { SortRounded } from "@mui/icons-material";
import { Box, Checkbox, CircularProgress, Divider, FormControl, FormControlLabel, FormGroup, FormHelperText, Typography, useMediaQuery, useTheme } from "@mui/material";
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
  const theme=useTheme()

  const isMobile=useMediaQuery(theme.breakpoints.down('sm'))
  
  const dispatch=useDispatch()
  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode=currentMode==='dark'
  
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


  return (
      <Dialog
        open={openAlert}
        fullWidth={isMobile}
        TransitionComponent={Transition}
        aria-describedby="alert-dialog-filter"
        sx={{
          backdropFilter:'blur(5px)',
        }}
      >
      <DialogTitle
        display={"flex"}
        alignItems={"center"}
        variant="body1"
        fontWeight={"bold"}
        gap={2}
        sx={{
          background: !isDarkMode && 
            "linear-gradient(180deg, #42a5f5, #64b5f6, transparent)",
        }}
        >
          <SortRounded/>
          {title}
        </DialogTitle>       
          <DialogContent 
          dividers 
          sx={{ 
          width:!isMobile && 400,
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
              variant={'body2'}
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
        </DialogContent>
        <DialogActions>
          <Button 
           onClick={handleDismiss}
           disabled={isFetching}
           >
            Close
          </Button>

          <Button
          startIcon={isFetching ? <CircularProgress size={15}/> :undefined}
          onClick={handleEnter}
          disabled={selectedOptions?.length<1 || isFetching}
          >
            Sort
          </Button>
        </DialogActions>
      </Dialog>
  );
}

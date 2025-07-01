import { SortRounded } from "@mui/icons-material";
import { Box, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SubsectionTech from "../data/SubsectionTech";
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
  setCustomArea,
  body = "customize your feed content by selecting an option",
  title = "Feed Content Customization",
  feedData=[]
}) {
  const [customTitle, setCustomTitle] = useState("");
    const { isTabSideBar } = useSelector((state) => state.appUI);
  

  const handleClose = () => {
    // close alert
    setOpenAlert(false);
  };

  // handle info entered by the user before closing the modal
  const handleEnterInfo = () => {
    // update the array then set the value of the user before close
    if (SubsectionTech?.MachineLearning?.includes(customTitle)) {
      return;
    } else {
      SubsectionTech.MachineLearning.push(customTitle);
      setCustomArea(customTitle);
      handleClose();
    }
  };

  //   handle when user dismissed the dialog
  const handleDismiss = () => {
    handleClose();
  };

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
     
          {/* radio button selection */}
          <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            {body}:
          </FormLabel>
          <Divider className="pt-2" component={'div'}/>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={feedData[0]}
            name="radio-buttons-group"
          >
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
              key={data}
              value={data} 
              control={<Radio />} 
              label={data} />
              </Box>
              <Divider 
              component={'div'}/>
            </Box>
            ))
            }

          </RadioGroup>
          </FormControl>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleDismiss}>Back</Button>
          <Button
            disabled={customTitle.trim() === ""}
            onClick={handleEnterInfo}
          >
            Enter
          </Button>
        </DialogActions>
      </Dialog>
  );
}

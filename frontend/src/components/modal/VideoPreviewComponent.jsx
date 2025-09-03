import { Close, Done, InfoOutlined } from "@mui/icons-material";
import { Box, Button, IconButton, styled, Tooltip, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import AlertGeneral from "../alerts/AlertGeneral";



// styled input
const StyledInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const FILE_MAX=50000000
const MB_CONVERSION=1024*1024

const VideoPreviewComponent = React.memo(({ video, index, handleVideoReplace }) => {
    
    const [showTips,setShowTips]=useState(false)

    const videoSrc = useMemo(() => URL.createObjectURL(video), [video]);
    const isOversized = video?.size > FILE_MAX;
    const videoName = video?.name?.split(".")[0].substring(0, CustomDeviceIsSmall() ? 23 : 35);

    // handle showing of lecture tips
    const handleShowModalLectureTips=()=>{
      setShowTips(true)
    }
  
    return (
      <Box key={video?.name + index}>
        {/* video box */}
        <Box display={"flex"} justifyContent={"center"} width={"100%"}>
          <video
            className={isOversized ? 'border border-danger rounded' : 'border border-success rounded'}
            controls
            muted
            autoFocus
            src={videoSrc}
            style={{ width: "100%" }}
            poster={''}
          >
            <Typography textAlign={"center"} variant="body2" color={"error"}>
              video not supported
            </Typography>
          </video>
        </Box>
  
        <Box 
        display={"flex"} 
        justifyContent={"center"}>
          <Typography
            className={isOversized ? " text text-danger" : " text text-success"}
            variant="caption"
            display={'flex'}
            alignItems={'center'}
            fontWeight={'bold'}
            gap={1}
          >
            {isOversized ? (
              <>
                <Close color="error" sx={{ width: 14, height: 14 }} />
                {Math.ceil(video.size / MB_CONVERSION)}MB
              </>
            ) : (
              <>
                <Done color="success" sx={{ width: 14, height: 14 }} />
                {Math.ceil(video.size / MB_CONVERSION)}MB
              </>
            )}
            &nbsp;&nbsp;
            {index+1}.
            {videoName}
            &nbsp;
            {isOversized && (
              <Button
                component="label"
                role={undefined}
                disableElevation
                color="warning"
                tabIndex={-1}
                size="x-small"
                sx={{
                  textTransform: "lowercase",
                  borderRadius: "20px",
                }}
              >
                change
                <StyledInput
                  type="file"
                  accept="video/*"
                  onChange={(event) => handleVideoReplace(event.target.files[0], video, index)}
                />
              </Button>
            )}
          </Typography>
        </Box>
        {/* displayed when video size greater than 50MB */}
          { isOversized && (
            <Box 
            display={'flex'} 
            justifyContent={'center'}
            alignItems={'center'}
             my={0.2}>
             {/* text */}
              <Typography variant="caption">- lecture exceeds 50MB in size -</Typography>
            </Box>
          )}

         {/* displayed when video does not have lecture labelled */}
          {!videoName?.toLowerCase()?.includes('lecture') && (
            <Box 
            display={'flex'} 
            justifyContent={'center'}
            alignItems={'center'}>
             {/* text */}
              <Typography variant="caption">- lecture not labelled accordingly for sorting -</Typography>
              {/* info btn */}
              <Tooltip arrow title='info'>
              <IconButton onClick={handleShowModalLectureTips}>
                <InfoOutlined sx={{width:18,height:18}}/>
              </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* show alert general with video name for ordering */}
          {showTips && (
            <AlertGeneral
              openAlertGeneral={showTips}
              setOpenAlertGeneral={setShowTips}
              defaultIcon={<InfoOutlined/>}
              title={'Lecture Labelling'}
              message={`Please label this lecture in the format " lecture_${index+1}_${videoName.toLowerCase()} " for accessibility and making it easier for sorting. This will ensure it conforms to the pattern of " lecture_part_name "`}
            />
          )}
      </Box>
    );
  });
  
  export default VideoPreviewComponent
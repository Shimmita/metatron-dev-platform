import { Close, Done } from "@mui/icons-material";
import { Box, Button, styled, Typography } from "@mui/material";
import React, { useMemo } from "react";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";



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
    
    const videoSrc = useMemo(() => URL.createObjectURL(video), [video]);
  
  
    const isOversized = video?.size > FILE_MAX;

    const videoName = video?.name?.split(".")[0].substring(0, CustomDeviceIsSmall() ? 23 : 35);
  
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
  
        {/* video name */}
        <Box display={"flex"} justifyContent={"center"}>
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
      </Box>
    );
  });
  
  export default VideoPreviewComponent
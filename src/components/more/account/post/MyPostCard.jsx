import { BarChart, Close, Delete, Edit } from "@mui/icons-material";
import { Box, Divider, IconButton } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import devImage from "../../../../images/dev.jpeg";

export default function MyPostCard() {
  const [showDefaultPost, setShowDefaultPost] = useState(true);
  const hanldeShowStats = () => {
    setShowDefaultPost(false);
  };

  const handleShowDefault = () => {
    setShowDefaultPost(true);
  };

  return (
    <Card sx={{ maxWidth: 250, margin: "2px" }}>
      {showDefaultPost ? (
        <>
          <CardMedia
            component="img"
            alt="green iguana"
            className="rounded"
            height={window.screen.availWidth > 1000 ? "250" : "200"}
            image={devImage}
          />
          <CardContent>
            <Typography
              className="text-center"
              gutterBottom
              variant="body2"
              component="div"
            >
              Lizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lizards are a widespread group...
            </Typography>
          </CardContent>
          <Divider component={"div"} />
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            className="px-2"
          >
            <IconButton>
              <Edit color="primary" sx={{ width: 20, height: 20 }} />
            </IconButton>
            <IconButton onClick={hanldeShowStats}>
              <BarChart color="inherit" sx={{ width: 20, height: 20 }} />
            </IconButton>
            <IconButton color="warning">
              <Delete sx={{ width: 20, height: 20 }} />
            </IconButton>
          </Box>
        </>
      ) : (
        <Box p={2}>
          <Box display={"flex"} justifyContent={"end"}>
            <IconButton onClick={handleShowDefault}>
              <Close sx={{ width: 18, height: 18 }} />
            </IconButton>
          </Box>
          <Box display={"flex"} justifyContent={"center"}>
            <BarChart color="inherit" sx={{ width: 16, height: 16 }} />
          </Box>
          <Typography textAlign={"center"} gutterBottom>
            statistics
          </Typography>
          <Divider component={"div"} />
          <Box color={"text.secondary"} p={1} mt={2}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography>Liked</Typography>
              <Typography>800</Typography>
            </Box>
            <Divider className="m-2" component={"div"} />

            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography>Favourite</Typography>
              <Typography>200</Typography>
            </Box>
            <Divider className="m-2" component={"div"} />

            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography>Comments</Typography>
              <Typography>50</Typography>
            </Box>
            <Divider className="m-2" component={"div"} />

            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography>Reported</Typography>
              <Typography>2</Typography>
            </Box>
            <Divider className="m-2" component={"div"} />

            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography>Viral</Typography>
              <Typography>true</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Card>
  );
}

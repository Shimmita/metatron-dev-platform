import { FavoriteRounded, GitHub } from "@mui/icons-material";
import { Box, CardActionArea, Divider } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate } from "react-router-dom";
import Ml_AI from "../../images/aws.jpeg";

export default function UserPostCard() {
  const navigate = useNavigate();

  // navigate to the post details page
  const handlePostDetails = () => {
    navigate("posts/details");
  };

  return (
    <Card elevation={0} className="mt-1">
      <CardActionArea onClick={handlePostDetails}>
        <CardMedia
          component="img"
          className="rounded"
          image={Ml_AI}
          alt="image"
        />
        <CardContent>
          <Typography
            variant="body2"
            fontWeight={"bold"}
            component="div"
            color={"text.secondary"}
            textAlign={"center"}
          >
            Fullstack
          </Typography>

          <Box
            mt={1}
            display={"flex"}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <FavoriteRounded sx={{ width: 17, height: 17 }} />{" "}
              <Typography
                fontWeight={"bold"}
                color={"text.secondary"}
                variant="body2"
              >
                300
              </Typography>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={1}
            >
              <GitHub sx={{ width: 17, height: 17 }} />{" "}
              <Typography
                fontWeight={"bold"}
                color={"text.secondary"}
                variant="body2"
              >
                70
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
      <Divider  component={'div'}/>
    </Card>
  );
}

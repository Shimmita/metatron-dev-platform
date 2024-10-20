import { FavoriteRounded, GitHub } from "@mui/icons-material";
import { Box, CardActionArea, Divider, Menu } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import React from "react";
import image from "../../../../images/azure.jpeg";
import OptionsMore from "./OptionsMore";
 

export default function MyPostCard() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMoreVertPost = Boolean(anchorEl);
  const handleClickMoreVertPost = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      elevation={0}
      className="mt-1"
      sx={{ opacity: openMoreVertPost && ".3" }}
    >
      <CardActionArea
        onClick={handleClickMoreVertPost}
        disabled={openMoreVertPost}
      >
        <CardMedia
          component="img"
          image={image}
          className="rounded"
          alt="image"
          aria-label="more"
          id="more-button"
          aria-controls={openMoreVertPost ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMoreVertPost ? "true" : undefined}
          sx={{ filter: openMoreVertPost && "grayscale(100%)" }}
        />

        {/* menu more*/}
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMoreVertPost}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "more-button",
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <OptionsMore />
        </Menu>

        <CardContent>
          <Typography
            variant="body2"
            fontWeight={"bold"}
            color={"text.secondary"}
            textAlign={"center"}
          >
            Fullstack
          </Typography>

          <Box
            mt={1}
            display={"flex"}
            justifyContent={"space-around"}
            gap={1}
            alignItems={"center"}
          >
            {/* like stats */}
            <Box display={"flex"} alignItems={"center"} gap={1}>
              <FavoriteRounded sx={{ width: 17, height: 17 }} />{" "}
              <Typography color={"text.secondary"} variant="body2">
                300
              </Typography>
            </Box>

            {/* GitHub stats */}
            <Box
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={1}
            >
              <GitHub sx={{ width: 17, height: 17 }} />{" "}
              <Typography color={"text.secondary"} variant="body2">
                700
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
      <Divider component={"div"} />
    </Card>
  );
}

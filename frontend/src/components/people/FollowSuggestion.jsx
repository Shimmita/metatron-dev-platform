import { Avatar, Box, Button, Divider } from "@mui/material";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import React from "react";
import { Image } from "react-bootstrap";
import devImage from "../../images/dev.jpeg";

export default function FollowSuggetion() {
  return (
    <Box
      bgcolor={"background.default"}
      color={"text.primary"}
      className="rounded"
    >
      <Card elevation={0} sx={{ width: 130, height: 125 }}>
        <Box className="pt-2">
          <Box display={"flex"} justifyContent={"center"}>
            <Avatar>
              <Image width={36} src={devImage} />
            </Avatar>
          </Box>
          <Typography className="text-center" variant="body2" component="div">
            <small>Albert Einstein</small>
          </Typography>
          <Typography
            className="text-center "
            variant="body2"
            color="text.secondary"
          >
            <small>@AlbertStar</small>
          </Typography>
        </Box>

        <Divider component={"div"} className="p-1" />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button size="small">follow</Button>
        </Box>
      </Card>
    </Box>
  );
}

import {
  Block,
  DownloadOutlined,
  FlagOutlined,
  Link,
  MoreVert,
  PersonAddOutlined,
  PersonRounded,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Typography,
  Checkbox,
  Tooltip,
  Menu,
  MenuItem,
  ListItemButton,
  ListItemText,
  CardContent,
} from "@mui/material";
import React from "react";

import { Image } from "react-bootstrap";
const CardPreview = ({ description, imagePath }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMoreVertPost = Boolean(anchorEl);

  const handleClickMoreVertPost = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box bgcolor={"background.default"} color={"text.primary"}>
      <Card elevation={0} className="w-100 mb-3 p-1 border rounded">
        <CardHeader
          avatar={
            <Tooltip title="profile" arrow>
              <IconButton>
                <Avatar
                  sx={{
                    bgcolor: "steelblue",
                  }}
                  aria-label="avatar"
                >
                  S
                </Avatar>
              </IconButton>
            </Tooltip>
          }
          action={
            <Box className="d-flex flex-row ">
              <IconButton disableRipple>
                <Typography variant="body2">
                  {" "}
                  <small>1 minute ago</small>
                </Typography>
              </IconButton>

              <Tooltip title="follow" arrow>
                <Checkbox
                  icon={
                    <PersonAddOutlined
                      sx={{ color: "steelblue", width: 20, height: 20 }}
                    />
                  }
                  checkedIcon={
                    <PersonRounded
                      style={{ color: "steelblue", width: 20, height: 20 }}
                    />
                  }
                />
              </Tooltip>

              <Tooltip title="more" arrow>
                <IconButton
                  aria-label="more"
                  id="more-button"
                  aria-controls={openMoreVertPost ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openMoreVertPost ? "true" : undefined}
                  onClick={handleClickMoreVertPost}
                >
                  <MoreVert />
                </IconButton>
              </Tooltip>

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
                <MenuItem>
                  <ListItemButton LinkComponent={"a"} href="#home">
                    <ListItemText>
                      <FlagOutlined className="mx-2" />
                    </ListItemText>
                    <ListItemText primary={<small>report this post</small>} />
                  </ListItemButton>
                </MenuItem>

                <MenuItem>
                  <ListItemButton LinkComponent={"a"} href="#home">
                    <ListItemText>
                      <Link className="mx-2" />
                    </ListItemText>
                    <ListItemText primary={<small>copy this link</small>} />
                  </ListItemButton>
                </MenuItem>

                <MenuItem>
                  <ListItemButton LinkComponent={"a"} href="#home">
                    <ListItemText>
                      <DownloadOutlined className="mx-2" />
                    </ListItemText>
                    <ListItemText primary={<small>save this post</small>} />
                  </ListItemButton>
                </MenuItem>

                <MenuItem>
                  <ListItemButton LinkComponent={"a"} href="#home">
                    <ListItemText>
                      <PersonAddOutlined className="mx-2" />
                    </ListItemText>
                    <ListItemText primary={<small>follow devshim</small>} />
                  </ListItemButton>
                </MenuItem>

                <MenuItem>
                  <ListItemButton LinkComponent={"a"} href="#home">
                    <ListItemText>
                      <Block className="mx-2" />
                    </ListItemText>
                    <ListItemText primary={<small>block devshim</small>} />
                  </ListItemButton>
                </MenuItem>
              </Menu>
            </Box>
          }
          title="Shimmitah"
          subheader="@devshim"
        />

        <Box className="d-flex justify-content-center align-items-center">
          <Image
            className="rounded mb-1 w-100 shadow-sm"
            src={imagePath && imagePath}
            style={{
              maxHeight:
                window.screen.availWidth > 700 &&
                window.screen.availWidth < 1000
                  ? 550
                  : window.screen.availWidth > 1000
                  ? 460
                  : 350,
              minHeight:
                window.screen.availWidth > 700 &&
                window.screen.availWidth < 1000
                  ? 550
                  : window.screen.availWidth > 1000
                  ? 460
                  : 350,
            }}
          />
        </Box>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CardPreview;

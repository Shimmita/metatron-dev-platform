import { RefreshRounded } from "@mui/icons-material";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import AppLogo from "../../images/logo_sm.png";
import CardFeed from "../custom/CardFeed";
import TopDailyPosts from "../rightbar/TopDailyPost";
import CustomDeviceIsSmall from "../utilities/CustomDeviceIsSmall";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";

const FeedCardContainer = () => {
  // for follow/connect people people
  const items = Array.from({ length: 5 }, (_, i) => i);

  return (
    <>
      {items &&
        items.map((item, index) => {
          return (
            <Box key={index}>
              {/* show trending Events on smartphones and tablets at Portrait */}
              {index === 0 &&
                (CustomDeviceIsSmall() || CustomDeviceTablet()) && (
                  <Box
                    className="shadow mb-4 p-2 rounded "
                    bgcolor={"background.default"}
                  >
                    <Box display={"flex"} alignItems={"center"}>
                      <Avatar
                        src={AppLogo}
                        sx={{ width: 40, height: 40 }}
                        alt="logo"
                        className="ms-1"
                      />

                      <Typography
                        variant="body2"
                        fontWeight={"bold"}
                        color={"primary"}
                        marginRight={5}
                        textAlign={"center"}
                        width={"100%"}
                      >
                        TRENDING
                      </Typography>
                    </Box>
                    {/* show divider in dark mode */}
                    <Divider component={"div"} className="p-1" />

                    <TopDailyPosts />
                  </Box>
                )}

              {/* feed card containing posts */}
              <CardFeed />

              {/* show refresh button when the item is last */}
              {index === items.length - 1 && (
                <Box display={"flex"} justifyContent={"center"} m={2}>
                  <Button
                    className="rounded-5"
                    size="small"
                    variant="contained"
                    startIcon={<RefreshRounded />}
                  >
                    More
                  </Button>
                </Box>
              )}
            </Box>
          );
        })}
    </>
  );
};

export default FeedCardContainer;

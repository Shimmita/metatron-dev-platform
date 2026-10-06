import {
  AddRounded,
  GroupsRounded,
  LockRounded,
  PageviewRounded,
  PostAddRounded,
  RemoveCircleOutlineRounded,
  Settings,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CardFeed from "../custom/CardFeed";
import PostTechModal from "../modal/PostTechModal";
import PostDetailsContainer from "../post/PostDetailsContiner";
import { getImageMatch } from "../utilities/getImageMatch";

const panelSx = {
  border: "1px solid rgba(214,178,94,0.16)",
  borderRadius: "8px",
  background: "rgba(255,255,255,0.035)",
  minWidth: 0,
};

const scrollSx = {
  overflowY: "auto",
  overflowX: "hidden",
  overscrollBehavior: "contain",
  "&::-webkit-scrollbar": { display: "none" },
  msOverflowStyle: "none",
  scrollbarWidth: "none",
};

const getGroupImage = (name = "") =>
  name.includes("System Design and Principles")
    ? null
    : getImageMatch(name.split(","), false, true);

export default function GroupCommunityDetails({
  focusedGroup,
  userId,
  handleJoinCommunity,
  handleLeaveCommunity,
}) {
  const [openPostTech, setOpenPostTech] = useState(false);
  const [postDetailedData, setPostDetailedData] = useState(null);

  const group = focusedGroup?.group || {};
  const groupPosts = focusedGroup?.posts || [];
  const isGuest = !userId;
  const groupName = group.name || "Community";

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1, lg: 1.25 },
      }}
    >
      <Box
        sx={{
          ...panelSx,
          p: { xs: 1, sm: 1.5 },
          flex: "0 0 auto",
          background:
            "linear-gradient(135deg, rgba(214,178,94,0.16), rgba(255,255,255,0.045))",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          gap={{ xs: 1, sm: 1.25 }}
        >
          <Stack direction="row" spacing={{ xs: 1, sm: 1.25 }} alignItems="center" minWidth={0}>
            <Avatar
              src={getGroupImage(groupName)}
              sx={{
                width: { xs: 42, sm: 58 },
                height: { xs: 42, sm: 58 },
                bgcolor: "rgba(214,178,94,0.16)",
                flex: "0 0 auto",
              }}
            >
              {groupName.includes("System Design and Principles") ? <Settings /> : <GroupsRounded />}
            </Avatar>

            <Box minWidth={0}>
              <Typography fontWeight={950} lineHeight={1.12} noWrap>
                {groupName}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                lineHeight={1.45}
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                Follow posts, members, and proof-of-work from this technical circle.
              </Typography>
              <Stack direction="row" spacing={0.5} mt={{ xs: 0.6, sm: 1 }} flexWrap="wrap" useFlexGap>
                <Chip size="small" label={`${group.total || 0} members`} />
                <Chip size="small" label={`${group.post_count || groupPosts.length || 0} posts`} />
                {group.isMember && <Chip size="small" color="success" label="Joined" />}
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={0.75} sx={{ flex: "0 0 auto" }}>
            {group.isMember ? (
              <Button
                size="small"
                variant="outlined"
                startIcon={<RemoveCircleOutlineRounded />}
                onClick={() => handleLeaveCommunity?.(group)}
                sx={{
                  borderRadius: "8px",
                  fontWeight: 900,
                  minWidth: { xs: 76, sm: 92 },
                  px: { xs: 1, sm: 1.5 },
                }}
              >
                Leave
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                disableElevation
                startIcon={isGuest ? <LockRounded /> : <AddRounded />}
                onClick={() => handleJoinCommunity?.(group)}
                sx={{
                  borderRadius: "8px",
                  color: "#080808",
                  fontWeight: 900,
                  minWidth: { xs: 76, sm: 92 },
                  px: { xs: 1, sm: 1.5 },
                  background: "linear-gradient(135deg,#8B6F2A,#D6B25E)",
                }}
              >
                {isGuest ? "Sign In" : "Join"}
              </Button>
            )}

            <Tooltip title="Post content">
              <IconButton
                size="small"
                onClick={() => setOpenPostTech(true)}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  width: { xs: 34, sm: 36 },
                  height: { xs: 34, sm: 36 },
                  flex: { xs: "0 0 34px", sm: "0 0 36px" },
                }}
              >
                <PostAddRounded sx={{ width: 18, height: 18 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          ...panelSx,
          minHeight: 0,
          flex: "1 1 0",
          display: "flex",
          flexDirection: "column",
          p: { xs: 1, sm: 1.25 },
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1} flex="0 0 auto">
          <Box minWidth={0}>
            <Typography variant="caption" color="text.secondary" fontWeight={900}>
              Community Posts
            </Typography>
            {!postDetailedData && (
              <Typography variant="body2" color="text.secondary" noWrap>
                Latest visible posts from this group.
              </Typography>
            )}
          </Box>
          {postDetailedData && (
            <Button
              size="small"
              variant="outlined"
              onClick={() => setPostDetailedData(null)}
              sx={{ borderRadius: "8px", fontWeight: 800 }}
            >
              Back
            </Button>
          )}
        </Stack>

        <Box
          data-metatron-rail="true"
          sx={{
            ...scrollSx,
            minHeight: 0,
            flex: "1 1 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            pr: { lg: 0.25 },
          }}
        >
          {!groupPosts.length ? (
            <Stack alignItems="center" spacing={1.25} py={6} px={2} textAlign="center">
              <PageviewRounded sx={{ width: 42, height: 42, color: "text.secondary" }} />
              <Typography fontWeight={900}>No posts yet</Typography>
              <Typography variant="body2" color="text.secondary" maxWidth={360}>
                Start the signal for this group with a project update, note, demo, or hard-won lesson.
              </Typography>
              <Button
                onClick={() => setOpenPostTech(true)}
                size="small"
                startIcon={<PostAddRounded />}
                variant="outlined"
                sx={{ borderRadius: "8px", fontWeight: 900 }}
              >
                Post Content
              </Button>
            </Stack>
          ) : postDetailedData ? (
            <PostDetailsContainer
              postDetailedData={postDetailedData}
              setPostDetailedData={setPostDetailedData}
            />
          ) : (
            groupPosts.map((post) => (
              <CardFeed
                post={post}
                posts={groupPosts}
                key={post._id}
                setPostDetailedData={setPostDetailedData}
              />
            ))
          )}
        </Box>
      </Box>

      {openPostTech && (
        <PostTechModal
          openModalTech={openPostTech}
          setOpenModalTech={setOpenPostTech}
        />
      )}
    </Box>
  );
}

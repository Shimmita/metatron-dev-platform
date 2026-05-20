import {
  FlagOutlined,
  InsightsOutlined,
  PersonAddOutlined,
  PersonOutline,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Box, Stack, Badge } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary, {
  accordionSummaryClasses,
} from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import FriendRequest from "../../rightbar/layouts/FriendRequest";
import JobFeedBack from "./JobFeedBack";
import PostReaction from "./PostReaction";
import PostReported from "./PostReported";
import ProfileViewReaction from "./ProfileViewReaction";

// ─── STYLED METATRON ACCORDION ───
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  background: "transparent",
  border: "1px solid transparent",
  "&:not(:last-child)": {
    marginBottom: theme.spacing(1.5),
  },
  "&::before": {
    display: "none",
  },
  overflow: "hidden",
  borderRadius: "12px !important", // Force rounded corners for every panel
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.75rem", opacity: 0.5 }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
  minHeight: 52,
  transition: 'all 0.2s ease',
  borderRadius: "12px",
  border: `1px solid ${theme.palette.divider}`,
  flexDirection: "row-reverse",
  "&.Mui-expanded": {
    minHeight: 52,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: theme.palette.mode === 'dark' ? "rgba(20, 210, 190, 0.08)" : "rgba(20, 210, 190, 0.05)",
  },
  [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
    transform: "rotate(90deg)",
  },
  [`& .${accordionSummaryClasses.content}`]: {
    marginLeft: theme.spacing(1.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1),
  background: theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.01)" : "rgba(0, 0, 0, 0.01)",
  border: `1px solid ${theme.palette.divider}`,
  borderTop: "none",
  borderBottomLeftRadius: "12px",
  borderBottomRightRadius: "12px",
}));

export default function NotifAccordionLayout({
  reportedPost,
  connectNotifications,
  post_reactions,
  profile_views,
  jobFeedBacks,
}) {
  const [expanded, setExpanded] = useState('profile');

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderHeader = (Icon, label, count) => (
    <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" pr={1}>
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Icon sx={{ fontSize: 20, color: 'primary.main' }} />
        <Typography variant="caption" fontWeight={900} letterSpacing="0.05rem" color="text.primary">
          {label}
        </Typography>
      </Stack>
      <Box sx={{ 
        bgcolor: 'primary.main', 
        px: 1, 
        py: 0.1, 
        borderRadius: 1, 
        boxShadow: '0 0 10px rgba(20, 210, 190, 0.3)' 
      }}>
        <Typography variant="caption" fontWeight={900} color="white" sx={{ fontSize: '0.65rem' }}>
          {count}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Stack sx={{ p: 1 }}>
      {/* Profile Views */}
      {profile_views?.length > 0 && (
        <Accordion expanded={expanded === 'profile'} onChange={handleChange('profile')}>
          <AccordionSummary>
            {renderHeader(PersonOutline, "PROFILE ENGAGEMENT", profile_views.length)}
          </AccordionSummary>
          <AccordionDetails>
            <Box maxHeight="60vh" sx={{ overflowY: "auto", scrollbarWidth: "none" }}>
              {profile_views.map((viewer) => (
                <ProfileViewReaction key={viewer?._id} profile_view={viewer} />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Connect Requests */}
      {connectNotifications?.length > 0 && (
        <Accordion expanded={expanded === 'connect'} onChange={handleChange('connect')}>
          <AccordionSummary>
            {renderHeader(PersonAddOutlined, "PEER REQUESTS", connectNotifications.length)}
          </AccordionSummary>
          <AccordionDetails>
            <Box maxHeight="60vh" sx={{ overflowY: "auto", scrollbarWidth: "none" }}>
              {connectNotifications.map((connect, index) => (
                <FriendRequest
                  key={connect?._id}
                  connect_request={connect}
                  isAcceptFriends={true}
                  isLastItem={connectNotifications.length - 1 === index}
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Job Feedback */}
      {jobFeedBacks?.length > 0 && (
        <Accordion expanded={expanded === 'job'} onChange={handleChange('job')}>
          <AccordionSummary>
            {renderHeader(WorkOutlineOutlined, "CAREER INTEL", jobFeedBacks.length)}
          </AccordionSummary>
          <AccordionDetails>
            <Box maxHeight="60vh" sx={{ overflowY: "auto", scrollbarWidth: "none" }}>
              {jobFeedBacks.map((job) => (
                <JobFeedBack key={job?._id} jobFeedBack={job} />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Post Reactions */}
      {post_reactions?.length > 0 && (
        <Accordion expanded={expanded === 'reactions'} onChange={handleChange('reactions')}>
          <AccordionSummary>
            {renderHeader(InsightsOutlined, "CONTENT ENGAGEMENT", post_reactions.length)}
          </AccordionSummary>
          <AccordionDetails>
            <Box maxHeight="60vh" sx={{ overflowY: "auto", scrollbarWidth: "none" }}>
              {post_reactions.map((reaction, index) => (
                <PostReaction key={index} reaction={reaction} isLastItem={post_reactions.length - 1 === index} />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Reported Content */}
      {reportedPost?.length > 0 && (
        <Accordion expanded={expanded === 'reported'} onChange={handleChange('reported')}>
          <AccordionSummary>
            {renderHeader(FlagOutlined, "SECURITY ALERTS", reportedPost.length)}
          </AccordionSummary>
          <AccordionDetails>
            <Box maxHeight="60vh" sx={{ overflowY: "auto", scrollbarWidth: "none" }}>
              {reportedPost.map((report, index) => (
                <PostReported key={index} report={report} isLastItem={reportedPost.length - 1 === index} />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Stack>
  );
}
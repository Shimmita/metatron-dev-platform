import {
  Close,
  PeopleRounded
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  IconButton,
  Modal,
  Tooltip,
  Typography,
  Fade,
  Backdrop,
} from "@mui/material";

import AppLogo from "../../images/logo_sm.png";
import DataAccounts from "../data/DataAccounts";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";

/* ─── Modal Container ─── */
const ModalAccountInfo = ({ openModalInfo, setOpenModalInfo }) => {
  /* ─── Responsive Width ─── */
  const handleModalWidth = () => {
    if (CustomLandscapeWidest() || CustomLandScape()) return "min(92vw, 860px)";
    if (CustomDeviceTablet()) return "calc(100vw - 32px)";
    return "calc(100vw - 16px)";
  };

  return (
    <Modal
      open={openModalInfo}
      onClose={() => setOpenModalInfo(false)}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 400,
          sx: {
            backdropFilter: "blur(8px)",
            background: "rgba(6,13,24,0.7)",
          },
        },
      }}
    >
      <Fade in={openModalInfo} timeout={400}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          px={1}
        >
          <Box
            width={handleModalWidth()}
            sx={{
              maxWidth: "860px",
              maxHeight: { xs: "calc(100dvh - 16px)", sm: "calc(100dvh - 32px)" },
              display: "flex",
              flexDirection: "column",
              borderRadius: "8px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(30px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            {/* ─── Header ─── */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={3}
              py={2}
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Left */}
              <Box display="flex" alignItems="center" gap={1.5}>
                <Avatar src={AppLogo} sx={{ width: 36, height: 36 }} />
                <Typography
                  fontWeight={600}
                  sx={{ color: "#FFFDF7", letterSpacing: "0.03em" }}
                >
                  Account Intelligence
                </Typography>
              </Box>

              {/* Close */}
              <Tooltip title="Close">
                <IconButton
                  onClick={() => setOpenModalInfo(false)}
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    "&:hover": { color: "#D6B25E" },
                  }}
                >
                  <Close />
                </IconButton>
              </Tooltip>
            </Box>

            {/* ─── Content ─── */}
            <Box
              maxHeight="calc(100dvh - 130px)"
              px={3}
              py={3}
              sx={{
                overflowY: "auto",
                "&::-webkit-scrollbar": { width: 6 },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgba(148,163,184,0.28)",
                  borderRadius: 999,
                },
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(148,163,184,0.28) transparent",
              }}
            >
              <Box display="flex" flexDirection="column" gap={3}>
                
                {/* Section */}
                <Box>
                  {/* Icon */}
                  <Box display="flex" justifyContent="center" mb={1}>
                    <PeopleRounded
                      sx={{
                        width: 40,
                        height: 40,
                        color: "#D6B25E",
                      }}
                    />
                  </Box>

                  {/* Title */}
                  <Typography
                    textAlign="center"
                    fontWeight={600}
                    fontSize={15}
                    color="#FFFDF7"
                    mb={2}
                  >
                    Registered Accounts
                  </Typography>

                  {/* List */}
                  <Box
                    component="ol"
                    sx={{
                      pl: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.2,
                    }}
                  >
                    {DataAccounts?.Personal.map((data, index) => (
                      <Typography
                        key={index}
                        component="li"
                        fontSize={13}
                        sx={{
                          color: "rgba(255,253,247,0.7)",
                          lineHeight: 1.6,
                        }}
                      >
                        {data}
                      </Typography>
                    ))}
                  </Box>
                </Box>

              </Box>
            </Box>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalAccountInfo;

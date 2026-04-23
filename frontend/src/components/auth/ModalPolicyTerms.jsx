import {
  Close,
  GavelRounded,
  SecurityRounded,
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

import React from "react";
import { useSelector } from "react-redux";
import AppLogo from "../../images/logo_sm.png";
import DataTermsPolicy from "../data/DataTermsPolicy";
import CustomDeviceTablet from "../utilities/CustomDeviceTablet";
import CustomLandScape from "../utilities/CustomLandscape";
import CustomLandscapeWidest from "../utilities/CustomLandscapeWidest";
import CustomModalHeight from "../utilities/CustomModalHeight";

const ModalPolicyTerms = ({
  openModalTerms,
  setOpenModalTerms,
  isShowPrivacy,
}) => {
  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode = currentMode === "dark";

  /* ─── Responsive Width ─── */
  const handleModalWidth = () => {
    if (CustomLandscapeWidest()) return "50%";
    if (CustomDeviceTablet() || CustomLandScape()) return "80%";
    return "95%";
  };

  return (
    <Modal
      open={openModalTerms}
      onClose={() => setOpenModalTerms(false)}
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
      <Fade in={openModalTerms} timeout={400}>
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
              borderRadius: "20px",
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
                  sx={{ color: "#F0F4FA", letterSpacing: "0.03em" }}
                >
                  {isShowPrivacy
                    ? "Privacy Intelligence"
                    : "Terms & Governance"}
                </Typography>
              </Box>

              {/* Close */}
              <Tooltip title="Close">
                <IconButton
                  onClick={() => setOpenModalTerms(false)}
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    "&:hover": { color: "#14D2BE" },
                  }}
                >
                  <Close />
                </IconButton>
              </Tooltip>
            </Box>

            {/* ─── Content ─── */}
            <Box
              maxHeight={CustomModalHeight()}
              px={3}
              py={3}
              sx={{
                overflowY: "auto",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              <Box display="flex" flexDirection="column" gap={3}>
                {/* Section */}
                <Box>
                  {/* Icon */}
                  <Box display="flex" justifyContent="center" mb={1}>
                    {isShowPrivacy ? (
                      <SecurityRounded
                        sx={{
                          width: 42,
                          height: 42,
                          color: "#14D2BE",
                        }}
                      />
                    ) : (
                      <GavelRounded
                        sx={{
                          width: 42,
                          height: 42,
                          color: "#C8A96E",
                        }}
                      />
                    )}
                  </Box>

                  {/* Title */}
                  <Typography
                    textAlign="center"
                    fontWeight={600}
                    fontSize={15}
                    color="#F0F4FA"
                    mb={2}
                  >
                    {isShowPrivacy
                      ? "Privacy & Data Protection"
                      : "Terms of Service"}
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
                    {(isShowPrivacy
                      ? DataTermsPolicy?.privacy
                      : DataTermsPolicy?.terms
                    )?.map((data, index) => (
                      <Typography
                        key={index}
                        component="li"
                        fontSize={13}
                        sx={{
                          color: "rgba(240,244,250,0.7)",
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

export default ModalPolicyTerms;
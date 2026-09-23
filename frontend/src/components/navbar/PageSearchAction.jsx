import { SearchRounded, TuneRounded } from "@mui/icons-material";
import { Box, ButtonBase, Tooltip, Typography } from "@mui/material";

export default function PageSearchAction({
  label,
  helper = "Skills, category, location",
  count,
  onClick,
  isDarkMode = true,
}) {
  const countLabel = typeof count === "number" ? count : null;

  return (
    <Tooltip title={`Search ${label}`} arrow>
      <ButtonBase
        onClick={onClick}
        sx={{
          height: 38,
          minWidth: { xs: 38, sm: 156, md: 220 },
          maxWidth: { xs: 38, sm: 190, md: 260 },
          px: { xs: 0, sm: 1 },
          borderRadius: "8px",
          border: "1px solid rgba(214,178,94,0.24)",
          color: "#FFFDF7",
          background: isDarkMode
            ? "rgba(255,255,255,0.055)"
            : "rgba(255,255,255,0.16)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: { xs: "center", sm: "flex-start" },
          gap: 0.8,
          overflow: "hidden",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "rgba(214,178,94,0.46)",
            background: "rgba(214,178,94,0.10)",
          },
        }}
      >
        <SearchRounded sx={{ color: "primary.main", fontSize: 20, flexShrink: 0 }} />
        <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0, textAlign: "left", flex: 1 }}>
          <Typography variant="caption" noWrap sx={{ display: "block", color: "#FFFDF7", fontWeight: 900, lineHeight: 1.1 }}>
            Search {label}
          </Typography>
          <Typography variant="caption" noWrap sx={{ display: "block", color: "rgba(255,253,247,0.58)", fontSize: 10, lineHeight: 1.1 }}>
            {helper}
          </Typography>
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "inline-flex" },
            alignItems: "center",
            gap: 0.35,
            px: 0.7,
            py: 0.25,
            borderRadius: "6px",
            color: "#080808",
            background: "linear-gradient(135deg,#8B6F2A,#D6B25E,#FFF2C2)",
            fontSize: 10,
            fontWeight: 950,
            flexShrink: 0,
          }}
        >
          <TuneRounded sx={{ fontSize: 12 }} />
          {countLabel === null ? "Advanced" : countLabel}
        </Box>
      </ButtonBase>
    </Tooltip>
  );
}

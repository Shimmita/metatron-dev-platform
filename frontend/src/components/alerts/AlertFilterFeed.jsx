import {
  CloseRounded,
  RestartAltRounded,
  SortRounded,
  TuneRounded
} from "@mui/icons-material";
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateCurrentPosts } from "../../redux/CurrentPosts";
import SpecialisationTech from "../data/SpecialisationTech";
import CourseIcon from "../utilities/CourseIcon";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const feedData = SpecialisationTech.filter((item) => item !== "None");

export default function AlertFilterFeed({
  openAlert,
  setOpenAlert,
  title = "Feed Content Customization",

}) {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([])


  const dispatch = useDispatch()

  const handleClose = () => {
    // clear message
    setErrorMessage("")
    // close alert
    setOpenAlert(false);
  };

  // handle change when checkbox is checked
  const handleChange = (event) => {
    const targetChecked = event.target.checked;
    const value = event.target.value;

    if (targetChecked) {
      // add the value if it doesn't already exist
      if (!selectedOptions.includes(value)) {
        setSelectedOptions(prev => [...prev, value]);
      }
    } else {
      // remove the value if it was unchecked
      setSelectedOptions(prev => prev.filter(item => item !== value));
    }
  };


  //   handle when user dismissed the dialog
  const handleDismiss = () => {
    // clear the selections
    setSelectedOptions([]);

    // call close function
    handleClose();
  };

  const handleClearSelection = () => {
    setSelectedOptions([]);
    setErrorMessage("");
  };

  // handle enter
  const handleEnter = () => {
    // set is fetching to true
    setIsFetching(true);

    // performing get request
    axios.post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/posts/all`, selectedOptions, {
      withCredentials: true,
    })
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          // update the redux posts content
          dispatch(updateCurrentPosts(res.data));

          // close the dialog automatically
          handleClose()
        }
      })
      .catch((err) => {
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "server is unreachable "
          );
          return;
        }
        setErrorMessage(err?.response?.data || "Unable to customize feed.");
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }


  return (
    <Dialog
      open={openAlert}
      onClose={isFetching ? undefined : handleClose}
      TransitionComponent={Transition}
      aria-describedby="alert-dialog-filter"
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "8px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap={1.5}
        px={2}
        py={1.5}
        borderBottom="1px solid rgba(255,255,255,0.08)"
      >
        <Box display="flex" alignItems="center" gap={1.25} minWidth={0}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(214,178,94,0.15)",
              color: "#D6B25E",
              flexShrink: 0,
            }}
          >
            <TuneRounded sx={{ width: 19, height: 19 }} />
          </Box>

          <Box minWidth={0}>
            <Typography fontWeight={800} fontSize={14} noWrap>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Choose the topics you want to see first.
            </Typography>
          </Box>
        </Box>

        <Tooltip title="Close" arrow>
          <span>
            <IconButton onClick={handleClose} disabled={isFetching} size="small">
              <CloseRounded sx={{ width: 18, height: 18 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <DialogContent
        dividers
        sx={{
          px: 2,
          py: 2,
          background: "rgba(255,255,255,0.03)",
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1} mb={1.5}>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>
            {selectedOptions.length} selected
          </Typography>
          <Button
            size="small"
            startIcon={<RestartAltRounded sx={{ width: 15, height: 15 }} />}
            onClick={handleClearSelection}
            disabled={isFetching || selectedOptions.length < 1}
            sx={{
              borderRadius: "8px",
              textTransform: "capitalize",
              fontWeight: 800,
            }}
          >
            Clear
          </Button>
        </Stack>

        <FormControl component="fieldset" variant="standard" fullWidth>
          {/* message helper text info, error */}
          {errorMessage &&
            <Box display={'flex'} justifyContent={'center'} mb={1.5}>
              <FormHelperText
                sx={{
                  color: "#FFB300",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                {errorMessage}
              </FormHelperText>
            </Box>
          }

          {/* form data checkboxes */}
          <FormGroup
            sx={{
              maxHeight: "min(54vh, 520px)",
              overflowY: "auto",
              pr: 0.5,
              gap: 0.75,
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(148,163,184,0.28)",
                borderRadius: 999,
              },
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(148,163,184,0.28) transparent",
            }}
          >
            {feedData?.map(data => (
              <Box key={data} sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1,
                py: 0.7,
                borderRadius: "8px",
                background: selectedOptions.includes(data)
                  ? "rgba(214,178,94,0.08)"
                  : "rgba(255,255,255,0.02)",
                border: selectedOptions.includes(data)
                  ? "1px solid rgba(214,178,94,0.4)"
                  : "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.2s ease",

                "&:hover": {
                  background: "rgba(214,178,94,0.06)",
                },
              }}>
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  gap={1}
                  width="100%"
                >
                  {/* icon */}
                  <CourseIcon option={data} />

                  {/* radio button */}
                  <FormControlLabel
                    value={data}
                    control={<Checkbox
                      onChange={handleChange}
                      checked={selectedOptions.includes(data)}
                      sx={{
                        color: "rgba(255,255,255,0.5)",
                        p: 0.75,

                        "&.Mui-checked": {
                          color: "#D6B25E",
                        },
                      }}
                    />}
                    label={
                      <Typography
                        variant={'body2'}
                        sx={{
                          color: selectedOptions.includes(data)
                            ? "#D6B25E"
                            : "rgba(255,253,247,0.7)",
                          fontSize: 13,
                          fontWeight: selectedOptions.includes(data) ? 800 : 500,
                        }}
                      >
                        {data}
                      </Typography>
                    } />
                </Box>

              </Box>
            ))
            }
          </FormGroup>

        </FormControl>
      </DialogContent>
      <DialogActions
        sx={{
          px: 2,
          py: 1.5,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Button
          onClick={handleDismiss}
          disabled={isFetching}
          sx={{
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",

            "&:hover": {
              background: "rgba(255,255,255,0.05)",
            },
          }}
        >
          Close
        </Button>

        <Button
          startIcon={isFetching ? <CircularProgress size={15} /> : <SortRounded sx={{ width: 16, height: 16 }} />}
          onClick={handleEnter}
          disabled={selectedOptions?.length < 1 || isFetching}
          variant="contained"
          sx={{
            borderRadius: "8px",
            background: "linear-gradient(135deg,#8B6F2A,#D6B25E)",
            color: "#fff",
            fontWeight: 900,

            "&:hover": {
              background: "linear-gradient(135deg,#8B6F2A,#FFF2C2)",
            },

            "&:disabled": {
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
            }
          }}
        >
          Apply filters
        </Button>
      </DialogActions>
    </Dialog>
  );
}

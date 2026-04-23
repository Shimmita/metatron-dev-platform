import { useTheme } from "@emotion/react";
import { SortRounded } from "@mui/icons-material";
import { Box, Checkbox, CircularProgress, FormControl, FormControlLabel, FormGroup, FormHelperText, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentPosts } from "../../redux/CurrentPosts";
import SpecialisationTech from "../data/SpecialisationTech";
import CourseIcon from "../utilities/CourseIcon";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const feedData = [...SpecialisationTech]

export default function AlertFilterFeed({
  openAlert,
  setOpenAlert,
  title = "Feed Content Customization",

}) {
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([])


  const dispatch = useDispatch()
  const { currentMode } = useSelector((state) => state.appUI);
  const isDarkMode = currentMode === 'dark'

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
    selectedOptions.length = 0

    // call close function
    handleClose();
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
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        // set is fetching to false
        setIsFetching(false);
      });
  }


  const theme = useTheme();


  return (
    <Dialog
      open={openAlert}
      TransitionComponent={Transition}
      aria-describedby="alert-dialog-filter"
      PaperProps={{
        sx: {
          borderRadius: "18px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(30px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.6)",
        },
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(20,210,190,0.15)",
            color: "#14D2BE",
          }}
        >
          <SortRounded />
        </Box>

        <Typography fontWeight={600} fontSize={14}>
          {title}
        </Typography>
      </Box>
      <DialogContent
        dividers
        sx={{
          maxWidth: 420,
          px: 2,
          py: 2,
          background: "rgba(255,255,255,0.03)",
        }}
      >

        <FormControl component="fieldset" variant="standard">
          {/* message helper text info, error */}
          {errorMessage &&
            <Box display={'flex'} justifyContent={'center'}>
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
          <FormGroup >
            {feedData?.map(data => (
              <Box key={data} sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.2,
                py: 1,
                borderRadius: "10px",
                background: selectedOptions.includes(data)
                  ? "rgba(20,210,190,0.08)"
                  : "rgba(255,255,255,0.02)",
                border: selectedOptions.includes(data)
                  ? "1px solid rgba(20,210,190,0.4)"
                  : "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.2s ease",

                "&:hover": {
                  background: "rgba(20,210,190,0.06)",
                },
              }}>
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  gap={2}
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

                        "&.Mui-checked": {
                          color: "#14D2BE",
                        },
                      }}
                    />}
                    label={
                      <Typography
                        variant={'body2'}
                        sx={{
                          color: selectedOptions.includes(data)
                            ? "#14D2BE"
                            : "rgba(240,244,250,0.7)",
                          fontSize: 13,
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
      <DialogActions>
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
          startIcon={isFetching ? <CircularProgress size={15} /> : undefined}
          onClick={handleEnter}
          disabled={selectedOptions?.length < 1 || isFetching}
          sx={{
            borderRadius: "10px",
            background: "linear-gradient(135deg,#0FA88F,#14D2BE)",
            color: "#fff",

            "&:hover": {
              background: "linear-gradient(135deg,#0BBFA5,#1EE8D2)",
            },

            "&:disabled": {
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
            }
          }}
        >
          Sort
        </Button>
      </DialogActions>
    </Dialog>
  );
}

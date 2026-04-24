import { Close } from '@mui/icons-material';
import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import React, { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AlertInputMessage from '../../alerts/AlertInputMessage';
import AlertMiniProfileView from '../../alerts/AlertMiniProfileView';
import CustomCountryName from '../../utilities/CustomCountryName';
import CustomDeviceIsSmall from '../../utilities/CustomDeviceIsSmall';
import { getImageMatch } from '../../utilities/getImageMatch';
import MetatronApplicantsTable from './ApplicantsTableBase';

const columnsHeader = [
  { id: 'profile', label: 'Profile', minWidth: 100 },

  { id: 'name', label: 'Name', minWidth: 200 },

  { id: 'gender', label: 'Gender', minWidth: 100 },


  {
    id: 'country',
    label: 'Country',
    minWidth: 170,
    align: 'right',
  },

  {
    id: 'status',
    label: 'Status',
    minWidth: 170,
    align: 'right',
  },


  {
    id: 'resume',
    label: 'Resume',
    minWidth: 170,
    align: 'right',
  },

  {
    id: 'message',
    label: 'Message',
    minWidth: 170,
    align: 'right',
  },
];


const applicantStatus = ["pending", "proceed", "rejected"]


export default function ApplicantsTable({ setIsApplicantsTable, focusedJob }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [jobApplicants, setJobApplicants] = useState([])
  // track axios progress
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messageResponse, setMessageResponse] = useState("")

  // display of message alert
  const [openAlertMessage, setOpenAlertMessage] = useState(false)

  // redux user HR manager
  const { user } = useSelector((state) => state.currentUser);

  // track the applicant status and Id on change; default pending
  const [currentJob, setCurrentJob] = useState({})
  const [applicantId, setApplicantId] = useState("")
  const [applicantName, setApplicantName] = useState('')


  // control showing of the miniprofile of the user
  const [openMiniProfile, setOpenMiniProfile] = useState(false)


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // close the applicants table
  const handleCloseApplicantsTable = () => {
    setIsApplicantsTable(false)
  }

  // Download CV, when success load the url from backend to a new window for download
  const handleDownload = async (cvName, jobID) => {

    // perform a post request sending emailId user, and JobId as req params, while cvName 
    // as body of the request

    setIsFetching(true)

    axios.post(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/download/cv/${user?.email}/${jobID}`, { cvName }, {
      withCredentials: true,
    })
      .then((res) => {
        // open new window to download the pdf separately
        window.open(res.data, "_blank_")
      })
      .catch(async (err) => {

        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "server unreachable"
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        setIsFetching(false);
      });

  };

  // use layout effect to fetch the data of job applicants
  // also when current job that has been update, refetch though expensive; 
  useLayoutEffect(() => {
    setIsFetching(true)
    axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/hiring/applicants/${user?.email}/${focusedJob?._id}`, {
      withCredentials: true,
    })
      .then((res) => {
        // update the redux of current post
        if (res?.data) {
          setJobApplicants(res.data)
        }
      })
      .catch(async (err) => {

        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "server unreachable"
          );
          return;
        }
        setErrorMessage(err?.response.data);
        console.log(errorMessage)
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [focusedJob, user, currentJob, errorMessage])


  // handle showing of mini profile of the job applicant
  const handleShowProfile = (applicant_id) => {
    // update the applicant Id
    setApplicantId(applicant_id)

    // set show profile to true
    setOpenMiniProfile(true)
  }

  // handle update of the application status of the particular job
  const handleUpdateStateApplicant = (statusText, jobApplication) => {

    const jobApplicationUpdateObject = {
      statusText,
      jobApplicationID: jobApplication?._id,
      applicantID: jobApplication?.applicant?.applicantID
    }

    // use axios to post to the backend of status update
    setIsFetching(true)

    axios.put(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/hiring/application/status/${user?.email}/${jobApplication.jobID}`, jobApplicationUpdateObject, {
      withCredentials: true,
    })
      .then((res) => {
        // update the success message from the backend
        if (res?.data) {
          setMessageResponse(res.data)
        }

        console.log(messageResponse)
      })
      .catch(async (err) => {

        //  user login session expired show logout alert
        if (err?.response?.data.login) {
          window.location.reload();
        }
        if (err?.code === "ERR_NETWORK") {
          setErrorMessage(
            "server unreachable"
          );
          return;
        }
        setErrorMessage(err?.response.data);
      })
      .finally(() => {
        setIsFetching(false);

        setCurrentJob(jobApplication)

      });

  }

  // handle opening of alert message to send message to the job applicant
  const handleOpenAlertMessage = (applicant) => {
    setApplicantName(applicant?.applicant?.name)
    setApplicantId(applicant?.applicant?.applicantID)

    // set open alert message 
    setOpenAlertMessage(true)
  }

  return (
    <Paper elevation={0}
      className={'rounded shadow'}
      sx={{
        maxWidth: window.screen.availWidth,
        maxHeight: !CustomDeviceIsSmall() ? '75vh' : undefined,
        border: '1px solid',
        color: 'divider',
        overflow: 'auto',
      }}>

      <Box
        width={'100%'}
        mt={1}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'} gap={2}>

        {/* job logo */}
        <Box p={1}>
          <Avatar
            alt=""
            className="border"
            sx={{ width: 30, height: 30, }}
            src={getImageMatch(focusedJob?.logo)}
          />
        </Box>


        {/* job applicants */}
        <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} >
          <Typography color={'primary'} fontWeight={'bold'} textAlign={'center'} variant='body2' mt={1}> {focusedJob?.title} Assessment</Typography>
          <Typography textAlign={'center'} variant='caption' mt={1} sx={{ color: 'text.secondary' }}> {focusedJob?.applicants?.total} {focusedJob?.applicants?.total === 1 ? "candidate" : "candidates"} applied</Typography>

        </Box>

        {/* close table  */}
        <Box display={'flex'} justifyContent={'flex-end'} p={1}>
          <Tooltip title={'close'} arrow>
            <IconButton className='border' onClick={handleCloseApplicantsTable}>
              <Close sx={{ width: 10, height: 10 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* table component */}
      <MetatronApplicantsTable
        CustomCountryName={CustomCountryName}
        handleDownload={handleDownload}
        handleOpenAlertMessage={handleOpenAlertMessage}
        handleShowProfile={handleShowProfile}
        handleUpdateStateApplicant={handleUpdateStateApplicant}
        applicantStatus={applicantStatus}
        jobApplicants={jobApplicants}
        page={page}
        rowsPerPage={rowsPerPage}
        columnsHeader={columnsHeader}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        isFetching={isFetching}

      />

      {/* open alert message box */}
      {openAlertMessage && (
        <AlertInputMessage
          openAlert={openAlertMessage}
          setOpenAlert={setOpenAlertMessage}
          targetId={applicantId}
          targetName={applicantName}
        />
      )}

      {/* alert mini profile */}
      {openMiniProfile && (
        <AlertMiniProfileView
          openAlert={openMiniProfile}
          setOpenAlert={setOpenMiniProfile}
          userId={applicantId} />
      )}
    </Paper>
  );
}

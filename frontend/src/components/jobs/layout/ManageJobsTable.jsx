import { Close, Delete, Info, InfoRounded, RemoveRedEye, UpdateRounded } from '@mui/icons-material';
import { Avatar, Badge, Box, IconButton, MenuItem, styled, TextField, Tooltip, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetClearCurrentJobsTop } from '../../../redux/CurrentJobsTop';
import AlertJobPreview from '../../alerts/AlertJobPreview';
import DeleteJobAlert from '../../alerts/DeleteJobAlert';
import JobPostUpdateModal from '../../modal/update/JobPostUpdateModal';
import CustomDeviceIsSmall from '../../utilities/CustomDeviceIsSmall';
import CustomDeviceTablet from '../../utilities/CustomDeviceTablet';
import { getImageMatch } from '../../utilities/getImageMatch';
import ApplyJobModal from '../../modal/ApplyJobModal';
import { updateCurrentSuccessRedux } from '../../../redux/CurrentSuccess';
import AlertGeneral from '../../alerts/AlertGeneral';

const columnsHeader = [
  { id: 'logo', label: 'Logo', minWidth: 170 },

  { id: 'name', label: 'Name', minWidth: 200 },

  { id: 'applicants', label: 'Applicants', minWidth: 100 },


  {
    id: 'status',
    label: 'Status',
    minWidth: 170,
    align: 'right',
  },

  {
    id: 'action',
    label: 'Action',
    minWidth: 170,
    align: 'right',
  },


];



const jobStatus=["active", "inactive"]

const StyledBadgeActive = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const StyledBadgeInactive = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#FFA726",
    color: "#FFA726",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      border: "1px solid currentColor",
      content: '""',
    },
  },
}));


export default function ManageJobsTable({setIsManageJobsTable,MyPostedJobs}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [myJobsPosted,setMyJobsPosted]=useState(MyPostedJobs)
  const [isAlertDelete,setIsAlertDelete]=useState(false)
  const [isUpdateJobModal,setIsUpdateJobModal]=useState(false)
  const [currentFocusedJob,setCurrentFocusedJob]=useState()
  const[openJobAlertPreview,setOpenJobAlertPreview]=useState(false)
  const [openModalJobReview,setOpenModalJobReview]=useState(false)

  // redux user HR manager
  const { user } = useSelector((state) => state.currentUser);
  const dispatch=useDispatch()

  // track axios progress
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleShowDeleteAlert=(job)=>{
    // update current job
    setCurrentFocusedJob(job)

    // show alert
    setIsAlertDelete(true)
  }

  // handle showing of job preview
  const handleShowJobPreview=(job)=>{
    // current job focused
    setCurrentFocusedJob(job)

    // update state show preview
    setOpenJobAlertPreview(true)
  }

  // update the job modal
  const handleShowUpdateJobModal=(job)=>{
    // update the job
    setCurrentFocusedJob(job)
    
    //show update job modal
    setIsUpdateJobModal(true)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // close the applicants table
  const handleCloseManageJobsTable=()=>{
    setIsManageJobsTable(false)
  }


  // handle update of the application status of the particular job
  const handleUpdateJobStatus=(statusText,job)=>{

    const jobStatusObject={
      statusText,
    }
    // use axios to post to the backend of status update
    setIsFetching(true)

     axios.put(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/jobs/all/hiring/job/status/${user?.email}/${job?._id}`,jobStatusObject,{
            withCredentials: true,
        })
        .then((res) => {
            // update the jobs from the backend
            if (res?.data) {
            setMyJobsPosted(res.data)

            // alert success 
            dispatch(updateCurrentSuccessRedux({title:'Job Update',message: statusText==="active" ? `Your job has been successfully update to ${statusText}, potential applicants are now able to continue making applications`:
              `Your job has now been updated to ${statusText}, potential applicants won't be able to make any applications.` }))
            
            // clear current jobs for fresh
              dispatch(resetClearCurrentJobsTop())
            } 
        })
        .catch((err) => {

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
            // false fetching
            setIsFetching(false);        
        });
  }


  // handle show job review, apply modal without action btns
  const handleShowJobReview=(job)=>{
    setCurrentFocusedJob(job)
    setOpenModalJobReview(true)
  }

  return (
    <Paper elevation={0} 
    className={'rounded shadow'}
    sx={{ 
    maxWidth: window.screen.availWidth, 
    maxHeight:!CustomDeviceIsSmall() ? '75vh':undefined,
    border:'1px solid',
    color:'divider',  
    overflow:'auto',
     }}>

    <Box 
    mt={1}
    width={'100%'} 
    display={'flex'} 
    justifyContent={'space-between'}
     alignItems={'center'} gap={2}>
        {/* avatar current user */}
         <Box p={1}>
            <Avatar
            src={user?.avatar}
            alt=""
            className="border"
            sx={{ width: 32, height: 32,}}
              />
            </Box>
    
    {/* Title */}
      <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} >
        <Typography color={'primary'} fontWeight={'bold'} textAlign={'center'} variant='body2' mt={1}>Jobs Management Center</Typography>
        <Typography  textAlign={'center'} variant='caption' mt={1} sx={{ color:'text.secondary' }}>You Posted {MyPostedJobs?.length} {MyPostedJobs?.length>1 ? "Jobs":"Job"}</Typography>

      </Box>

    {/* close table  */}
    <Box display={'flex'} justifyContent={'flex-end'} p={1}>
      <Tooltip title={'close'} arrow>
      <IconButton className='border' onClick={handleCloseManageJobsTable}>
        <Close sx={{ width:10,height:10 }}/>
      </IconButton>
      </Tooltip>
      </Box>
    </Box>

      <TableContainer       
       sx={{ 
        maxHeight: CustomDeviceIsSmall() || CustomDeviceTablet() ? 700:440, 
        maxWidth: window.screen.availWidth, 
       overflow: "auto",
        // Hide scrollbar for Chrome, Safari and Opera
        "&::-webkit-scrollbar": {
          display: "none",
        },
        // Hide scrollbar for IE, Edge and Firefox
        msOverflowStyle: "none",
        scrollbarWidth: "none", }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columnsHeader.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {myJobsPosted
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((job,index) => {
                return (
                  <TableRow hover tabIndex={-1} key={job}>
                    {columnsHeader.map((column) => {
                      return (
                        
                        <TableCell 
                        key={column.id} 
                        align={column.align}
                        sx={{ fontSize:'small', textTransform:'uppercase' }}
                        >
                          {/* avatar column */}
                          {column.id==="logo" && (
                          <Box display={'flex'} alignItems={'center'} gap={2}>
                            {`${index+1}.`}
                              <IconButton onClick={()=>handleShowJobPreview(job)}>   
                            <Tooltip title={'preview'} arrow>
                              {/* active job */}
                            {job?.status?.toLowerCase()==='active' && (
                              <StyledBadgeActive
                              overlap="circular"
                              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                              variant="dot"
                            >
                              <Avatar 
                              src={getImageMatch(job?.logo)}
                              alt="" 
                              sx={{ width: 34, height: 34 }}
                              >
                                <Typography
                                  variant="body2"
                                  textTransform={"uppercase"}
                                  fontWeight={"bold"}
                                >
                                  {job?.title[0]}
                                </Typography>
                              </Avatar>
                            </StyledBadgeActive>
                            )}

                            {/* inactive job */}

                            {job?.status?.toLowerCase()==='inactive' && (
                              <StyledBadgeInactive
                              overlap="circular"
                              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                              variant="dot"
                            >
                              <Avatar 
                              src={getImageMatch(job?.logo)}
                              alt="" 
                              sx={{ width: 34, height: 34 }}
                              >
                                <Typography
                                  variant="body2"
                                  textTransform={"uppercase"}
                                  fontWeight={"bold"}
                                >
                                  {job?.title[0]}
                                </Typography>
                              </Avatar>
                            </StyledBadgeInactive>
                            )}

                            </Tooltip>
                            </IconButton>
                            </Box>
                          )}

                          {/* name column */}
                          {column.id==='name' && (
                              `${job?.title}`
                            )}
                          {/* applicants column */}
                          {column.id==='applicants' && 
                          <Typography sx={{textTransform:'capitalize'}} variant='caption'>{`${job?.website!=="" ? "external website": 
                          `${job?.applicants?.total}/${job?.applicants_max}  ------ ${Math.ceil(job?.applicants?.total/job?.applicants_max*100)}%`}`}</Typography>}

                          {/* job status column */}
                          {column.id==='status' && (
                            <TextField
                            required
                            select
                            disabled={isFetching}
                            variant='standard'
                            value={job?.status || "active" }
                            sx={{ fontSize:'small'}}
                            onChange={(e)=>{
                            // update the function fo text status and main job iD
                            handleUpdateJobStatus(e.target.value,job)
                            }}
                            >
                            {jobStatus.map((status) => (
                                <MenuItem key={status} value={status} sx={{ fontSize:'small' }}>
                                    <Typography variant='body2'>
                                    {status}
                                    </Typography>
                                </MenuItem>
                                ))}
                            </TextField>
                        )}

                        {/* delete button */}
                        {column.id==='action' && (
                          <Box display={'flex'} 
                          alignItems={'center'}
                          gap={2}
                          width={'100%'}
                          justifyContent={'flex-end'}
                          >


                             {/* full view icon */}
                            <Tooltip title={'review'} arrow>
                            <IconButton onClick={()=>{handleShowJobReview(job)}}>
                              <RemoveRedEye color='secondary' sx={{width:22,height:22}}/> 
                              </IconButton>
                            </Tooltip>

                          {/* update icon */}
                          <Tooltip title={'update'} arrow>
                          <IconButton onClick={()=>{handleShowUpdateJobModal(job)}}>
                            <UpdateRounded color='success' sx={{width:24,height:24}}/> 
                          </IconButton>
                          </Tooltip>

                            {/* delete icon */}
                            <Tooltip title={'delete'} arrow>
                            <IconButton onClick={()=>{handleShowDeleteAlert(job)}}>
                              <Delete color='primary' sx={{width:22,height:22}}/> 
                              </IconButton>
                            </Tooltip>

                          </Box>
                        )}

                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[4,5,10,20,25,50,100,150,200,250]}
        component="div"
        count={myJobsPosted.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* show modal job review */}
      {openModalJobReview && (
        <ApplyJobModal 
        openApplyJobModal={openModalJobReview}
        setOpenApplyJobModal={setOpenModalJobReview}
        isPreview={true}
        jobID={currentFocusedJob?._id}
        title={currentFocusedJob?.title}
        skills={currentFocusedJob?.skills}
        websiteLink={currentFocusedJob?.website}
        jobaccesstype={currentFocusedJob?.jobtypeaccess}
        location={currentFocusedJob?.location}
        organisation={currentFocusedJob?.organisation}
        requirements={currentFocusedJob?.requirements}
        salary={currentFocusedJob?.salary} 
        whitelist={currentFocusedJob?.whitelist}
        />
      )}

      {/* show alert job preview */}
      {openJobAlertPreview && (
        <AlertJobPreview 
        openAlert={openJobAlertPreview} 
        setOpenAlert={setOpenJobAlertPreview}
        defaultIcon={<Info/>}
        job={currentFocusedJob}
        />
      )}

      {/* update job modal */}
      {isUpdateJobModal && (
        <JobPostUpdateModal
        openModalJob={isUpdateJobModal} 
        setOpenModalJob={setIsUpdateJobModal}
        job_updated={currentFocusedJob}
        setMyCurrentJobs={setMyJobsPosted}
        />
      )}

      {/* delete job */}
      {isAlertDelete && currentFocusedJob && (
        <DeleteJobAlert
        openAlert={isAlertDelete} 
        setOpenAlert={setIsAlertDelete}
          my_email={user?.email}
          job_id={currentFocusedJob?._id}
          title={currentFocusedJob?.title}
          applicants={currentFocusedJob?.applicants?.total}
          message={'This job will be permanently deleted with all its associated information including application details.'}
          />
      )}

      {/* alert error */}
      {errorMessage && (
        <AlertGeneral
        isError={true}
        openAlertGeneral={errorMessage}
        title={'something went wrong'}
        defaultIcon={<InfoRounded/>}
        message={errorMessage}
        setErrorMessage={setErrorMessage}
      />
      )}
    
  
    </Paper>
  );
}

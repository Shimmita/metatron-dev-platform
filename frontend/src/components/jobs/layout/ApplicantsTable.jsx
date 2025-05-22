import { Close, DownloadRounded } from '@mui/icons-material';
import { Avatar, Box, Button, IconButton, MenuItem, TextField, Tooltip, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import  React from 'react';
import devImage from '../../../images/dev.jpeg';
import CustomDeviceIsSmall from '../../utilities/CustomDeviceIsSmall';
import CustomDeviceTablet from '../../utilities/CustomDeviceTablet';
import { getImageMatch } from '../../utilities/getImageMatch';
import { useState } from 'react';
import { useLayoutEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import CustomCountryName from '../../utilities/CustomCountryName';
import AlertMiniProfileView from '../../alerts/AlertMiniProfileView';

const columnsHeader = [
  { id: 'profile', label: 'Profile', minWidth: 170 },

  { id: 'name', label: 'Name', minWidth: 200 },

  { id: 'gender', label: 'Gender', minWidth: 100 },


  {
    id: 'country',
    label: 'Country',
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
    id: 'status',
    label: 'Status',
    minWidth: 170,
    align: 'right',
  },
];


const applicantStatus=["pending", "proceed", "rejected"]


export default function ApplicantsTable({setIsApplicantsTable,focusedJob}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [jobApplicants,setJobApplicants]=useState([])
  // track axios progress
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // redux user HR manager
  const { user } = useSelector((state) => state.currentUser);

  // track the applicant status and Id on change; default pending
  const[currentStatus,setCurrentStatus]=useState("pending")
  const[applicantId,setApplicantId]=useState("")

  // control showing of the miniprofile of the user
  const[openMiniProfile,setOpenMiniProfile]=useState(false)
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // close the applicants table
  const handleCloseApplicantsTable=()=>{
    setIsApplicantsTable(false)
  }

   // Download CV
   const handleDownload = async (link) => {

    // testing download
    window.open(link,"__blank")
   
  };

  // use layout effect to fetch the data of the job applicants
  useLayoutEffect(()=>{
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
            })
            .finally(() => {
              setIsFetching(false);
            });
  },[focusedJob,user])


  // handle showing of mini profile of the job applicant
  const handleShowProfile=(applicant_id)=>{
    // update the applicant Id
    setApplicantId(applicant_id)

    // set show profile to true
    setOpenMiniProfile(true)
  }

  return (
    <Paper elevation={0} 
    className={'rounded'}
    sx={{ 
    maxWidth: '100%', 
    border:'1px solid',
    color:'divider',  
    overflow:'auto',
     }}>

    <Box width={'100%'} display={'flex'} justifyContent={'space-between'} alignItems={'center'} gap={2}>
    
    {/* job logo */}
    <Box p={1}>
    <Avatar
        alt=""
        className="border"
        sx={{ width: 25, height: 25,}}
        src={getImageMatch(focusedJob?.logo)}
      />
    </Box>
   
    
    {/* job applicants */}
      <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} >
        <Typography color={'primary'} textAlign={'center'} variant='body2' mt={1}> {focusedJob?.title} Assessment</Typography>
        <Typography  textAlign={'center'} variant='caption' mt={1} sx={{ color:'text.secondary' }}> {focusedJob?.applicants?.total} {focusedJob?.applicants?.total===1?"candidate":"candidates"} applied &nbsp;|&nbsp; 0 candidate assessed</Typography>

      </Box>

    {/* close table  */}
    <Box display={'flex'} justifyContent={'flex-end'} p={1}>
      <Tooltip title={'close'} arrow>
      <IconButton className='border' onClick={handleCloseApplicantsTable}>
        <Close sx={{ width:11,height:11 }}/>
      </IconButton>
      </Tooltip>
      </Box>
    </Box>

      <TableContainer sx={{ 
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
            {jobApplicants
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((job_applicant,index) => {
                return (
                  <TableRow hover tabIndex={-1} key={job_applicant.code}>
                    {columnsHeader.map((column) => {
                      return (
                        
                        <TableCell 
                        key={column.id} 
                        align={column.align}
                        sx={{ fontSize:'small', textTransform:'uppercase' }}
                        >
                          {/* avatar section */}
                          {column.id==="profile" && (
                          <Box display={'flex'} alignItems={'center'} gap={3}>
                            {`${index+1}.`}
                              <IconButton onClick={()=>{handleShowProfile(job_applicant?.applicant?.applicantID)}}>   
                            <Tooltip title={'profile'} arrow>
                              <Avatar
                            sx={{ width: 34, height: 34 }}
                            src={devImage}
                            alt={""}
                            />
                            </Tooltip>
                             </IconButton>
                            </Box>
                          )}

                          {/* gender */}
                          {column.id==='gender' && (`${job_applicant?.applicant?.gender}`)}

                          {/* name */}
                          {column.id==='name' && (
                            `${job_applicant?.applicant?.name}`
                          )}

                          {/* country of the applicant */}
                          {column.id==='country' && (`
                          ${CustomCountryName(job_applicant?.applicant?.country)}`
                          )}

                          {/* cv part is download button */}
                          {column.id==='resume' && (
                            <Button size='small' sx={{ borderRadius:5 }} endIcon={<DownloadRounded/>} onClick={()=>handleDownload(job_applicant?.cvLink)}>download </Button>
                          )}

                          {/* status of the application */}
                          {column.id==='status' && (
                             <TextField
                              required
                              select
                              variant='standard'
                              value={currentStatus}
                              sx={{ fontSize:'small' }}
                              onChange={(e)=>{
                                // update the selected status
                                setCurrentStatus(e.target.value)

                                // update the job applicant id for backend update of job status too
                                setApplicantId(job_applicant?.applicant?.applicantID)
                              }}
                            >
                              {applicantStatus.map((status) => (
                                <MenuItem key={status} value={status} sx={{ fontSize:'small' }}>
                                    <Typography variant='body2'>
                                    {status}
                                    </Typography>
                                </MenuItem>
                                ))}
                            </TextField>
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
        count={jobApplicants.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* alert mini profile */}
      <AlertMiniProfileView openAlert={openMiniProfile} setOpenAlert={setOpenMiniProfile} userId={applicantId}/>
    
    </Paper>
  );
}

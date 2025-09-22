import { Close, InfoRounded } from '@mui/icons-material';
import { Avatar, AvatarGroup, Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import axios from 'axios';
import React, { useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AlertGeneral from '../../alerts/AlertGeneral';
import AlertInputMessage from '../../alerts/AlertInputMessage';
import AlertMiniProfileView from '../../alerts/AlertMiniProfileView';
import CustomDeviceIsSmall from '../../utilities/CustomDeviceIsSmall';
import CustomDeviceTablet from '../../utilities/CustomDeviceTablet';
import { getImageMatch } from '../../utilities/getImageMatch';

const columnsHeader = [
  { id: 'profile', label: 'Profile', minWidth: 100 },

  { id: 'gender', label: 'Gender', minWidth: 100 },

  { id: 'name', label: 'Name', minWidth: 200 },
  
  { id: 'email', label: 'Email', minWidth: 200 },

  {
    id: 'country',
    label: 'Country',
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


export default function EventStatsLayout({setIsEventsStats, focusedEvent}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [eventStats,setEventStats]=useState([])
  // track axios progress
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // display of message alert
  const [openAlertMessage,setOpenAlertMessage]=useState(false)

  // redux user 
  const { user } = useSelector((state) => state.currentUser);

  const[applicantId,setApplicantId]=useState("")
  const[applicantName,setApplicantName]=useState('')


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
    setIsEventsStats(false)
  }

    // handle opening of alert message to send message to the event applicant
  const handleOpenAlertMessage=(eventStat)=>{
    setApplicantName(eventStat?.userName)
    setApplicantId(eventStat?.userId)

    // set open alert message 
    setOpenAlertMessage(true)
  }


  // use layout effect to fetch the data of job applicants
  // also when current job that has been update, refetch though expensive; 
  useLayoutEffect(()=>{
    setIsFetching(true)
     axios.get(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/events/all/rsvp/stats/${focusedEvent?._id}`, {
              withCredentials: true,
            })
            .then((res) => {
              // update the redux of current post
              if (res?.data) {
                setEventStats(res.data)
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
  },[focusedEvent?._id])


  // handle showing of mini profile of the job applicant
  const handleShowProfile=(applicant_id)=>{
    // update the applicant Id
    setApplicantId(applicant_id)

    // set show profile to true
    setOpenMiniProfile(true)
  }

    // get date from the event
  const handleGetDate=()=>{
    return focusedEvent?.dateHosted?.split("T")[0]
  }

  // handle get time
  const handleGetTime=()=>{
  return focusedEvent?.dateHosted?.split("T")[1]?.split("+")[0]?.split(".")[0]
  
  }


  return (
    <Paper elevation={0} 
    className={'rounded shadow-sm mt-1'}
    sx={{ 
    maxWidth: window.screen.availWidth, 
    border:'1px solid',
    color:'divider',  
    overflow:'auto',
     }}>

    <Box width={'100%'} 
    display={'flex'} 
    mt={1}
    justifyContent={'space-between'} 
    alignItems={'center'} 
    gap={2}>
    
    <Box p={1}>
    <Box>
    <AvatarGroup max={user?.selectedSkills?.length}>
        {/* loop through the skills and their images matched using custom fn */}
        {focusedEvent?.skills?.map((skill, index) => (
        <Tooltip title={skill} arrow  key={index}
        >
            <Avatar
                alt={skill}
                className="border"
                sx={{ width: 25, height: 25 }}
                src={getImageMatch(skill)}
            />
            </Tooltip>
            ))}
        </AvatarGroup>
    </Box>
        {/* date of the event */}
        <Box mt={1}>
         <Typography
        variant="caption"
        textTransform={"capitalize"}
        sx={{ color:'text.secondary' }}
        >
        {handleGetDate()} | {handleGetTime()}
        </Typography>
        </Box>
    </Box>
   
    
    {/* job applicants */}
      <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} >
        <Typography color={'primary'} textAlign={'center'} variant='body2' mt={1} fontWeight={'bold'}> {focusedEvent?.title}</Typography>
        <Typography  textAlign={'center'} variant='caption'  mt={1} sx={{ color:'text.secondary' }}> {focusedEvent?.users?.count} {focusedEvent?.users?.count===1?"user":"users"} enrolled for this event</Typography>

      </Box>

    {/* close table  */}
    <Box display={'flex'} justifyContent={'flex-end'} p={1}>
      <Tooltip title={'close'} arrow>
      <IconButton 
      className='border' 
      disabled={isFetching} 
       onClick={handleCloseApplicantsTable}>
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
            {eventStats
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((eventStat,index) => {
                return (
                  <TableRow hover tabIndex={-1} key={eventStat}>
                    {columnsHeader.map((column) => {
                      return (
                        
                        <TableCell 
                        key={column.id} 
                        align={column.align}
                        sx={{ fontSize:'small', textTransform:'uppercase' }}
                        >
                          {/* avatar section */}
                          {column.id==="profile" && (
                          <Box display={'flex'} alignItems={'center'} gap={2}>
                            {`${index+1}.`}
                            <IconButton onClick={()=>{handleShowProfile(eventStat?.userId)}}>
                            <Tooltip title={'profile'} arrow>
                              <Avatar
                            sx={{ width: 34, height: 34 }}
                            src={eventStat?.userAvatar}
                            alt={""}
                            />
                            </Tooltip>
                            </IconButton>
                            </Box>
                          )}

                          {/* gender */}
                          {column.id==='gender' && (`${eventStat?.userGender}`)}

                          {/* name */}
                          {column.id==='name' && (
                            `
                              ${eventStat?.userName}
                              `
                          )}

                          {/* country of the applicant */}
                          {column.id==='country' && (`
                          ${eventStat?.userCountry}`
                          )}

                          {/* email of the applicant */}
                          {column.id==='email' && (`
                          ${eventStat?.userEmail}`
                          )}

                          {/* send message btn */}
                          {column.id==="message" && (
                            <Button  sx={{borderRadius:5}}
                            onClick={()=>handleOpenAlertMessage(eventStat)}
                            disableElevation
                            variant='outlined' size='small'>message</Button>
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
        count={eventStats.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
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
         userId={applicantId}/>
      )}  


      {/* alert error */}
      {errorMessage && (
      <AlertGeneral
      isError={true}
      openAlertGeneral={errorMessage}
      setErrorMessage={setErrorMessage}
      defaultIcon={<InfoRounded/>}
      title={'something went wrong'}
      message={errorMessage}
      />)}
      

    </Paper>
  );
}

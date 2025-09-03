import { Close, InfoRounded, SchoolOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Rating, Tooltip, Typography } from '@mui/material';
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
import { updateCurrentSnackBar } from '../../../redux/CurrentSnackBar';
import AlertGeneral from '../../alerts/AlertGeneral';
import CustomDeviceIsSmall from '../../utilities/CustomDeviceIsSmall';
import CustomDeviceTablet from '../../utilities/CustomDeviceTablet';

const columnsHeader = [

  { id: 'course_name', label: 'Course', minWidth: 200 },

  { id: 'students_total', label: 'Students', minWidth: 200 },

  { id: 'course_lectures', label: 'Lectures', minWidth: 200 },

  { id: 'course_rating', label: 'Rating', minWidth: 200 },

  { id: 'course_action', label: 'Action', minWidth: 200 },

];


const labels = {
  0.5: "poor",
  1: "poor+",
  1.5: "fair",
  2: "fair+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

export default function ManageCoursesTable({coursesData,setCourseManager,setTextOption}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [focusedCert,setFocusedCert]=useState(null)

  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { user } = useSelector((state) => state.currentUser);
  const dispatch=useDispatch()

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // handle close of the table
  const handleClose=()=>{
    setCourseManager(false)
    setTextOption("Uploaded Courses")
  }


  // handle deletion of the course
  // handle deleting of the course
  const handleDeleteCourse=(course)=>{

    // fetching true
    setIsFetching(true)

    // axios patch request, to update the rating state of the course
     axios.delete(`${process.env.REACT_APP_BACKEND_BASE_ROUTE}/courses/all/delete/instructor/${user?._id}/${course?._id}`, {
       withCredentials: true,
      })
      .then((res) => {
        if (res?.data) {

          // update the success status
          dispatch(updateCurrentSnackBar(res.data))
          setTextOption("")
          setTextOption("Manage Courses")
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
  }

  return (
    <Paper elevation={0} 
    className={'rounded'}
    sx={{ 
    maxWidth: window.screen.availWidth, 
    maxHeight:!CustomDeviceIsSmall() ? '75vh':undefined,
    border:'1px solid',
    color:'divider',  
    overflow:'auto',
     }}>

    <Box 
    width={'100%'} 
    display={'flex'} 
    justifyContent={'space-between'}
     alignItems={'center'} gap={2}>
     <Box px={1}>
          <SchoolOutlined
        sx={{
            width:30,height:30
        }}
    />
     </Box>
   

    {/* job applicants */}
      <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} >
        <Typography color={'primary'} fontWeight={'bold'} textAlign={'center'} variant='body2' mt={1}>
            Currently Uploaded Courses
        </Typography>
        <Typography 
         textAlign={'center'} variant='caption'
         mt={1} 
         sx={{ color:'text.secondary' }}> 
          You Uploaded {coursesData.length} {coursesData?.length>1 ? "Courses":"Course"}
        </Typography>

      </Box>

    {/* close table  */}
    <Box display={'flex'} justifyContent={'flex-end'} p={1}>
      <Tooltip title={'close'} arrow>
      <IconButton className='border' onClick={handleClose} >
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
            {coursesData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((course,index) => {
                return (
                  <TableRow hover tabIndex={-1} key={course}>
                    {columnsHeader.map((column) => {
                      return (
                        
                        <TableCell 
                        key={column.id} 
                        align={column.align}
                        sx={{ fontSize:'small', textTransform:'uppercase' }}
                        >
                    

                          {/* course name */}
                          {column.id==='course_name' && (
                            <Box display={'flex'}  alignItems={'center'}>
                            {course?.course_title}
                            </Box>
                        )} 

                        {/* students total */}
                          {column.id==='students_total' && (
                            <Box display={'flex'}  alignItems={'center'}>
                            {course?.student_count}
                            </Box>
                        )}

                        

                        {/* lectures total */}
                        {column.id==='course_lectures' && (
                            <Box display={'flex'}  alignItems={'center'}>
                            {course?.course_video_lectures?.length}
                            </Box>
                        )}

                         {/* students total */}
                          {column.id==='course_rating' && (
                            <Box display={'flex'} gap={2} alignItems={'center'}>
                            {/* count */}
                            {course?.course_rate_count}
                            {/* stars */}
                              <Rating
                                name="feedback"
                                size="medium"
                                value={course?.course_rate_count}
                                readOnly
                                precision={0.5}
                              />
      
                              {/* message rating */}
                              <Box>
                                <Typography variant="caption" color={'text.secondary'}>
                                {labels[course?.course_rate_count]}
                                  </Typography>
                              </Box>
                              </Box>
                        )} 

                        {column.id==='course_action' && (
                            <Box display={'flex'}  alignItems={'center'}>
                             <Button size='small'
                            onClick={()=>handleDeleteCourse(course)}
                            variant='contained'
                            disabled={isFetching || errorMessage}
                            color='warning'
                            sx={{ borderRadius:5 }}
                            >
                            Delete
                            </Button>
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
        rowsPerPageOptions={[4,5,10,20,25,50,100,150,200,250,300]}
        component="div"
        count={coursesData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

        {/* alert error  */}
      {errorMessage && (
        <AlertGeneral
         openAlertGeneral={errorMessage}
        defaultIcon={<InfoRounded/>}
        setErrorMessage={setErrorMessage}
        isError={true}
        title={"Something went wrong"}
        message={errorMessage}
         />
      )}
    </Paper>
  );
}

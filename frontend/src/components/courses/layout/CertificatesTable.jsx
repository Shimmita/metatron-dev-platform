import { Close, SchoolOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, { useState } from 'react';
import CustomDeviceIsSmall from '../../utilities/CustomDeviceIsSmall';
import CustomDeviceTablet from '../../utilities/CustomDeviceTablet';
import AlertCertDialog from '../../alerts/AlertCertDialog';

const columnsHeader = [

  { id: 'name', label: 'Name', minWidth: 200 },

  { id: 'instructor', label: 'Instructor', minWidth: 200 },

  { id: 'price', label: 'Paid', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
  {
    id: 'get now',
    label: 'Get Certificate',
    minWidth: 200,
    align: 'right',
  },

];


export default function CertificatesTable({certsData}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [focusedCert,setFocusedCert]=useState(null)

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


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
    width={'100%'} 
    mt={1}
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
            Courses and Certifications
        </Typography>
        <Typography 
         textAlign={'center'} variant='caption'
         mt={1} 
         sx={{ color:'text.secondary' }}> 
          You Earned {certsData.length} {certsData?.length>1 ? "Certificates":"Certificate"}
        </Typography>

      </Box>

    {/* close table  */}
    <Box display={'flex'} justifyContent={'flex-end'} p={1}>
      <Tooltip title={'close'} arrow>
      <IconButton className='border' >
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
            {certsData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((cert,index) => {
                return (
                  <TableRow hover tabIndex={-1} key={cert}>
                    {columnsHeader.map((column) => {
                      return (
                        
                        <TableCell 
                        key={column.id} 
                        align={column.align}
                        sx={{ fontSize:'small', textTransform:'uppercase' }}
                        >
                     

                          {/* name */}
                          {column.id==='name' && (
                            <Box display={'flex'}  alignItems={'center'}>
                            {cert?.course_title}
                            </Box>
                        )}

                          {/* instructor */}
                        {column.id==='instructor' && (
                        <Box>
                        {cert?.instructorName}
                        </Box>
                        )}

                        {column.id==='price' && (
                        <Box>
                        ${cert?.price}
                        </Box>
                        )}


                        {column.id==='status' && (
                        <Box>
                        {cert?.status}
                        </Box>
                        )}

                          {/* cv part is download button */}
                          {column.id==='get now' && (
                            <Button size='small'
                            onClick={()=>setFocusedCert(cert)}
                            variant='outlined'
                            color='success'
                            sx={{ borderRadius:5 }}
                            >
                            Print
                            </Button>
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
        count={certsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* show focused cert */}
      {focusedCert && (
        <AlertCertDialog
        certData={focusedCert}
        setCertData={setFocusedCert}
        />
      )}

    </Paper>
  );
}

import { DiamondOutlined, InfoRounded, SchoolOutlined } from '@mui/icons-material';
import { Box, Divider, ListSubheader } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import React from 'react';
import NodejsImage from '../../images/node.png';
import PythonImage from '../../images/python.jpeg';

export default function PromotedAds({isDarkMode}) {
  return (
    <Box
     sx={{ width:'100%',
     height:200, 
     display:'flex',
    justifyContent:'center',
    flexDirection:'column' }}>
        {/* divider */}
    <Divider component="div" />
    {/* title */}
    <ImageListItem key="Subheader">
        <ListSubheader
         component="div" 
         sx={{ fontWeight:'bold',
          display:'flex',
          gap:1,
          color:!isDarkMode ? "#1976D2" : "#90CAF9",
          textTransform:'uppercase',
          alignItems:'center' }}>
            {/* icon */}
            <DiamondOutlined sx={{width:22, height:22}}/>
            {/* title */}
          Promoted Courses
          {/* icon */}
          <SchoolOutlined/>
        </ListSubheader>
      </ImageListItem>
    <Divider component="div" />

    {/* images listed */}
      {itemData.map((item) => (
        <ImageListItem key={item.title} >
          <img
            src={item.img}
            alt={''}
            loading="lazy"
            className='rounded p-1'
            style={{maxWidth:80}}
        
          />
          <ImageListItemBar
            title={item.title}
            subtitle={item.author}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`info about ${item.title}`}
              >
                <InfoRounded />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </Box>
  );
}

const itemData = [
  
  {
    img: NodejsImage,
    title: 'Learn Nodejs',
    author: '@metatron_courses',
    cols: 2,
  },

  {
    img: PythonImage,
    title: 'Learn Python',
    author: '@metatron_courses',
    cols: 2,
  },

  
];

import { EmailOutlined, PhoneOutlined, WbIncandescentRounded } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import DevAccountConfig from "../config/DevAccountConfig";
import CustomCountryName from "../utilities/CustomCountryName";
import { getImageMatch } from "../utilities/getImageMatch";
export default function SkillAvatars({ user, isDarkMode }) {

 
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Stack gap={1}>

        {/* user connections */}
        <Box 
        display={'flex'} 
        mt={1}
        justifyContent={'center'}
        width={'100%'}
        >
        <Typography 
        textAlign={'center'}
        variant="caption" 
        width={'100%'}
        justifyContent={'center'}
        display={'flex'}
        ml={2}
        alignItems={'center'}>
          {user?.network_count} connections
        </Typography>
        </Box>

        {/* location of the user */}
        <Box 
        display={'flex'} 
        justifyContent={'center'}
        width={'100%'}
        >
        <Typography 
        textAlign={'center'}
        variant="caption" 
        width={'100%'}
        justifyContent={'center'}
        display={'flex'}
        ml={2}
        alignItems={'center'}>
          {CustomCountryName(user?.country)} | {user?.county}
        </Typography>
        </Box>


        {/* skills avatars */}
        <Box display={"flex"} justifyContent={"center"}>
          <AvatarGroup max={user?.selectedSkills?.length}>
            {/* loop through the skills and their images matched using custom fn */}
            {user?.selectedSkills?.map((skill, index) => (
              <Tooltip title={skill} arrow  key={index}
>
                <Avatar
                  alt={skill}
                  className="border"
                  sx={{ width: 30, height: 30 }}
                  src={getImageMatch(skill)}
                />
              </Tooltip>
            ))}
          </AvatarGroup>
        </Box>

        {/* name */}
        <Typography
          textAlign={"center"}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          color={isDarkMode ? "whitesmoke" : "inherit"}
        >
           {user?.name}
        </Typography>

        {/* specialization */}
        <Typography
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={1}
          color={isDarkMode ? "whitesmoke" : "inherit"}
        >
          <WbIncandescentRounded
            color="primary"
            sx={{ width: 20, height: 20, color: isDarkMode && "yellow" }}
          />
          {user?.specialisationTitle}
          <WbIncandescentRounded
            color="primary"
            sx={{ width: 20, height: 20, color: isDarkMode && "yellow" }}
          />
        </Typography>

        {/* divider */}
        <Divider component={'div'} className="w-100 p-1"/>

        {/* about */}
        <Box
          maxWidth={275}
          display={"flex"}
          mt={1}
          justifyContent={"center"}
          flexDirection={'column'}
          px={"4px"}
        >
          {/* about me */}
          <Typography 
          textAlign={'center'} 
          variant="body2" 
          fontWeight={'bold'}
          sx={{ fontSize:'small' }}>
            About Me
          </Typography>

          {user?.about && user?.about && (
            <Typography
              textTransform={"capitalize"}
              variant="caption"
              p={1}
              width={"100%"}
              color={"text.secondary"}
            >
              {user?.about}
            </Typography>
          )}       
        </Box>

    {/* divider */}
    <Divider component={'div'} className="w-100 p-1"/>
 
        {/* contact us */}
        <Box 
        display={'flex'}
         justifyContent={'center'} 
         gap={1}
         flexDirection={'column'}
         >
          <Link 
          className="w-100"
           to={`tel:${DevAccountConfig.dev_phone}`}
           >
          <Button 
          startIcon={<PhoneOutlined/>}
          className="w-100"
          disableElevation
           sx={{ 
            fontSize:'small', 
            textTransform:'capitalize',
            
           }}
           >Call Our Support Team
           </Button>
           </Link>

          <Link
           target="_blank_"
           className="w-100"
            to={`mailto:[${DevAccountConfig.dev_email_1}]`}>
          <Button 
          startIcon={<EmailOutlined/>}
          disableElevation
          className="w-100"
           sx={{ fontSize:'small',
            textTransform:'capitalize',
          
          }}
           >Email Our Support Team
           </Button>
           </Link>
        </Box>

      </Stack>
    </Box>
  );
}

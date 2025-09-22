import { useTheme } from '@emotion/react'
import { Add, CheckCircleRounded, KeyboardArrowLeft, KeyboardArrowRight, PageviewRounded, PersonAdd, PostAddRounded, Settings } from '@mui/icons-material'
import { Avatar, Box, Button, Divider, IconButton, ListItem, ListItemAvatar, ListItemText, MobileStepper, Stack, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import AlertMiniProfileView from '../alerts/AlertMiniProfileView'
import CardFeed from '../custom/CardFeed'
import PostTechModal from '../modal/PostTechModal'
import PostDetailsContainer from '../post/PostDetailsContiner'
import CustomCountryName from '../utilities/CustomCountryName'
import { getImageMatch } from '../utilities/getImageMatch'

export default function GroupCommunityMobile({
    focusedGroup,
    groups,
    userId,
    handleJoinCommunity,
}) 
    {
    const[openProfile,setOpenProfile]=useState(false)
    const [tempUserId,setTempUserId]=useState(null)
    const [openPostTech,setOpenPostTech]=useState(false)
    const [postDetailedData,setPostDetailedData]=useState(null)
    
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = 2;
    
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
    
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

// trigger show of mini profile
 const handleShowProfile=(userIdParams)=>{
    setTempUserId(userIdParams)
    setOpenProfile(true)
 }

//  handle display of post tech modal
const handlePostTech=()=>{
    setOpenPostTech(true)
}


return (
    <Stack>
        <Box 
        borderRadius={1}
        justifyContent={'center'}
        border={'1px solid'}
        borderColor={'divider'}
        className='shadow-sm'
        bgcolor={'background.default'}
        sx={{
        overflow: "auto",
        maxHeight:'80vh',
        // Hide scrollbar for Chrome, Safari and Opera
        "&::-webkit-scrollbar": {
            display: "none",
        },
        // Hide scrollbar for IE, Edge and Firefox
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        }}
        >

        {/* stepper, community and user */}
        <Box mb={1}>
            <Box mb={1}>
              {/* first step, communities | second is users */}
            {activeStep===0 ?(
                <Box 
                flexWrap={'wrap'}
                border={'1px solid'}
                borderColor={'divider'}
                className='shadow-sm'
                borderRadius={1}
                bgcolor={'background.default'}
                p={1}
                >
                <Typography 
                gutterBottom
                variant='body2'
                fontWeight={'bold'}
                textTransform={'uppercase'}
                textAlign={'center'}>
                Tech Communities
                </Typography>

                    <Box
                    mt={1}
                    sx={{
                    overflow: "auto",
                    maxHeight:'50vh',
                    // Hide scrollbar for Chrome, Safari and Opera
                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                    // Hide scrollbar for IE, Edge and Firefox
                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    }}
                    >
                    {groups?.map((group,index)=>(
                    <React.Fragment key={group}>
                    <Stack 
                    key={group.name}
                    direction={'row'}
                    alignItems={'center'}
                    borderRadius={1}
                    border={'1px solid'}
                    borderColor={focusedGroup?.group._id===group._id ? 'divider':'transparent'}
                    >
                    <ListItem>
                    <ListItemAvatar>
                    {group.name
                    .includes("System Design and Principles") ? 
                    (<Settings sx={{width:34,height:34}}/>):
                    <Avatar 
                    src={getImageMatch(group.name.split(","),false,true)}
                    alt=""/>}
                    </ListItemAvatar>
                    <ListItemText
                    primary={<Typography variant='body2'>{group.name}</Typography>} 
                    secondary={`${group.total} ${group.total===1 ? "member":"members"} | ${group.post_count} ${group.post_count===1 ? "post":"posts"}`} />
                </ListItem>

                {/* join btn, if not current focused group */}
                {focusedGroup?.group._id!==group._id ? (
                    <React.Fragment>
                    {/* if user is a member, no add btn */}
                    {group.isMember ? (
                        <Typography 
                        variant='caption'
                        color={'text.secondary'}>
                            Member
                        </Typography>
                    ):(
                        <Tooltip 
                    title='join'
                    arrow
                    >
                    <IconButton
                    onClick={handleJoinCommunity}
                    sx={{
                        border:'1px solid',
                        borderColor:'divider'
                    }}
                    >
                        <Add sx={{
                            width:18,
                            height:18
                        }}/>
                    </IconButton>
                    </Tooltip>
                    )}
                    
                    </React.Fragment>
                ):(
                    <CheckCircleRounded
                        color='success'
                        sx={{
                            width:30,
                            height:30
                        }}
                    />
                )}
                
                    </Stack>

                    {index!==groups.length-1 && <Divider variant="inset" component="div" />}
                    </React.Fragment>
                    ))}
                    </Box>
                    </Box>
                        ):(
                    <Box 
                    mb={2}
                    borderRadius={1}
                    justifyContent={'center'}
                    border={'1px solid'}
                    borderColor={'divider'}
                    className='shadow-sm'
                    bgcolor={'background.default'}
                    >

                    <Typography 
                    variant='body2'
                    gutterBottom
                    fontWeight={'bold'}
                    textTransform={'uppercase'}
                    textAlign={'center'}>
                    Top Members
                    </Typography>

                    <Box>
                    {focusedGroup?.users?.map((user)=>(
                        <React.Fragment key={user}>
                        <Stack 
                        key={user.name}
                        direction={'row'}
                        alignItems={'center'}
                        >
                        <ListItem>
                        <ListItemAvatar
                        onClick={()=>handleShowProfile(user?._id)}
                        >
                        <Tooltip
                        title='profile'
                        arrow
                        >
                        <Avatar 
                        src={user.avatar}
                        alt=""/>
                        </Tooltip>
                        </ListItemAvatar>
                        <ListItemText
                        primary={<Typography variant='body2'>{user.name}</Typography>} 
                        secondary={`${user.specialisationTitle} | ${CustomCountryName(user?.country)}`} />
                    </ListItem>

                    {/* join btn if not current user */}
                    {userId===user._id ? (
                        <Typography 
                        mr={1}
                        color={'text.secondary'}
                        variant='caption'>
                        You
                        </Typography>
                    ):(
                    <Tooltip 
                    title='connect'
                    arrow
                    >
                    <IconButton
                    sx={{
                        border:'1px solid',
                        borderColor:'divider'
                    }}
                    >
                        <PersonAdd sx={{
                            width:18,
                            height:18
                        }}/>
                    </IconButton>
                    </Tooltip>
                    )}

                    </Stack>
                    <Divider 
                    variant="inset" 
                    component="div" />
                    </React.Fragment>
                    ))}
                    </Box>

                    </Box>
                    )}

                </Box>
                    <MobileStepper
                    variant="dots"
                    steps={maxSteps}
                    position="static"
                    activeStep={activeStep}
                    nextButton={
                    <Button
                        size="small"
                        onClick={handleNext}
                        disabled={activeStep === maxSteps - 1}
                    >
                        Next
                        {theme.direction === 'rtl' ? (
                        <KeyboardArrowLeft />
                        ) : (
                        <KeyboardArrowRight />
                        )}
                    </Button>
                    }
                    backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                        <KeyboardArrowRight />
                        ) : (
                        <KeyboardArrowLeft />
                        )}
                        Back
                    </Button>
                    }
                />
                </Box>


        <Box >
        {/* posts */}
        <Typography 
        variant='body2'
        mt={2}
        display={postDetailedData ? 'none':'block'}
        fontWeight={'bold'}
        textTransform={'uppercase'}
        textAlign={'center'}>
        Popular Posts
        </Typography>

        {!focusedGroup?.posts?.length ? (
            <Box
            mt={2} 
            gap={2}
            flexDirection={'column'}
            display={'flex'} 
            justifyContent={'center'}>
            {/* icon */}
            <Box display={'flex'} 
            justifyContent={'center'}>
            <PageviewRounded
            sx={{
                width:35,
                height:35
            }}
            />
            </Box>
            {/* text */}
            <Typography
            textAlign={'center'} 
            color={'text.secondary'}
            variant='body2'>
            members of this group have not yet posted
            </Typography>

            {/* btn */}
            <Button 
            onClick={handlePostTech}
            size='small'
            startIcon={<PostAddRounded/>}
            variant='outlined'>
                Post Content
            </Button>
            </Box>
        ):(
        <Box pt={1}>
        {postDetailedData ? (
            <PostDetailsContainer
            postDetailedData={postDetailedData}
            setPostDetailedData={setPostDetailedData}
            />
        ):(
            <React.Fragment>
            {focusedGroup?.posts?.map(post=>(
            <CardFeed
                post={post}
                posts={focusedGroup.posts}
                key={post._id}
                setPostDetailedData={setPostDetailedData}
            />
        ))} 
            </React.Fragment>
        )}
            </Box>
            )}
            </Box>
            </Box>
            
          {/* show mini profile */}
            {openProfile &&
            <AlertMiniProfileView
            openAlert={openProfile}
            setOpenAlert={setOpenProfile}
            userId={tempUserId}
            />}

            {/* post tech modal */}

            {openPostTech && (
            <PostTechModal
                openModalTech={openPostTech}
                setOpenModalTech={setOpenPostTech}
            />
            )}
        
        </Stack>
    )
}

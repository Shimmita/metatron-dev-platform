import { Add, CheckCircleRounded, PageviewRounded, PersonAdd, PostAddRounded, Settings } from '@mui/icons-material'
import { Avatar, Box, Button, Divider, IconButton, ListItem, ListItemAvatar, ListItemText, Stack, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import AlertMiniProfileView from '../alerts/AlertMiniProfileView'
import CardFeed from '../custom/CardFeed'
import PostTechModal from '../modal/PostTechModal'
import PostDetailsContainer from '../post/PostDetailsContiner'
import CustomCountryName from '../utilities/CustomCountryName'
import { getImageMatch } from '../utilities/getImageMatch'

export default function GroupCommunityDetails({
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
    <Stack 
    gap={2}
    direction={'row'}
    >
    {/* sidebar */}
    <Box 
    flex={2} 
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
        pr={1}
        sx={{
        overflow: "auto",
        maxHeight:'68vh',
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

        {/* feed */}
        <Box 
        flex={3} 
        borderRadius={1}
        p={1}
        justifyContent={'center'}
        border={'1px solid'}
        borderColor={'divider'}
        className='shadow-sm'
        bgcolor={'background.default'}
        >
        <Typography 
        variant='body2'
        gutterBottom
        display={postDetailedData ? 'none':'block'}
        fontWeight={'bold'}
        textTransform={'uppercase'}
        textAlign={'center'}>
        Popular Posts
        </Typography>

        {/* post display */}
        <Box 
        display={'flex'}
        justifyContent={'center'}
        flexDirection={'column'}
        alignItems={'center'}
        gap={2}
        sx={{
            overflow: "auto",
            maxHeight:'70vh',
            // Hide scrollbar for Chrome, Safari and Opera
            "&::-webkit-scrollbar": {
                display: "none",
            },
            // Hide scrollbar for IE, Edge and Firefox
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            }}
        >

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
            startIcon={<PostAddRounded/>}
            size='small'
            variant='outlined'>
                Post Content
            </Button>
            </Box>
        ):(
        <Box 
        pt={postDetailedData ? 10:30}>
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

        {/* rightbar */}
        <Box 
        p={1}
        flex={2} 
        borderRadius={1}
        justifyContent={'center'}
        border={'1px solid'}
        borderColor={'divider'}
        className='shadow-sm'
        bgcolor={'background.default'}

        >
        <Typography 
        gutterBottom
        variant='body2'
        fontWeight={'bold'}
        textTransform={'uppercase'}
        textAlign={'center'}>
        Top Members
        </Typography>

    {/* people, user be the top */}
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
            mr={2}
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

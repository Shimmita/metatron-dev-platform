import { DeleteRounded, Refresh } from '@mui/icons-material'
import { Box, Divider, ListItemText, MenuItem, Typography } from '@mui/material'
import React from 'react'

export const PostCardMore = ({handleUpdateMyPost,handleDeleteMyPost}) => {
  return (
    <Box>
        <MenuItem onClick={handleUpdateMyPost}>
            <ListItemText>
            <Refresh color="success" className="mx-2" />
            </ListItemText>
            <ListItemText
            sx={{ textTransform: "capitalize" }}
            primary={<Typography variant={'body2'}>Update</Typography>}
            />
        </MenuItem>

        <Divider component={"li"} />
        <MenuItem onClick={handleDeleteMyPost}>
            <ListItemText>
            <DeleteRounded color="warning" className="mx-2" sx={{ width:22,height:22 }}/>
            </ListItemText>
            <ListItemText
            sx={{ textTransform: "capitalize" }}
            primary={<Typography variant={'body2'}>Delete</Typography>}
            />
        </MenuItem>
    </Box>
  )
}

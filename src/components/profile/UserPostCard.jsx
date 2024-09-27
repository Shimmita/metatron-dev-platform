import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import devImage from "../../images/dev.jpeg";

export default function UserPostCard() {
  return (
    <Card sx={{ maxWidth: 200 }} >
      <CardActionArea>
        <CardMedia
          component="img"
          height="180"
          image={devImage}
          alt="image"
        />
        <CardContent>
          <Typography className='text-center' gutterBottom variant="body2" component="div">
            Artistic
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a group of squamate...
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

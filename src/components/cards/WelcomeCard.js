/* eslint-disable react/prop-types */
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import imgsvg from '../../assets/images/backgrounds/welcome-bg-2x-svg.svg';

const WelcomeCard = (props) => (
  <Card sx={{ p: 0, width: '100%' }}>
    <img src={imgsvg} alt="img" width="100%" />
    <CardContent sx={{ p: 3 }}>
      <Typography>{props.title}</Typography>
    </CardContent>
  </Card>
);

export default WelcomeCard;

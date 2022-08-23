import React from 'react';
import { Box, Typography, Avatar, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import FeatherIcon from 'feather-icons-react';

const ProfileDropdown = () => {
  const { user } = useSelector((state) => state.auth.user);

  return (
    <Box>
      <Box
        sx={{
          pb: 3,
          mt: 3,
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              width: '90px',
              height: '90px',
              fontSize: '50px'
            }}
          >
            {user.name && user.name[0]}
          </Avatar>
          <Box
            sx={{
              ml: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                lineHeight: '1.235',
              }}
            >
              {user.name}
            </Typography>
            <Typography color="textSecondary" variant="h6" fontWeight="400">
              {user.rol}
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography
                color="textSecondary"
                display="flex"
                alignItems="center"
                sx={{
                  color: (theme) => theme.palette.grey.A200,
                  mr: 1,
                }}
              >
                <FeatherIcon icon="mail" width="18" />
              </Typography>
              <Typography color="textSecondary" variant="h6">
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider
        style={{
          marginTop: 0,
          marginBottom: 0,
        }}
      />
    </Box>
  );
};

export default ProfileDropdown;

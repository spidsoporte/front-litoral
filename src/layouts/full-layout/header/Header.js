import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FeatherIcon from 'feather-icons-react';
import { AppBar, Box, IconButton, Toolbar, Menu, Typography, Avatar, Button } from '@mui/material';
import PropTypes from 'prop-types';
// Dropdown Component
import ProfileDropdown from './ProfileDropdown';
import { logout } from '../../../redux/auth/Action'; 
// Logos
import LogoAmericana from '../../../assets/images/logos/Logo-Americana.png';
import LogoLitoral from '../../../assets/images/logos/Logo-Litoral.png';

const Header = ({ sx, customClass, toggleSidebar, toggleMobileSidebar }) => {
  const [anchorEl4, setAnchorEl4] = React.useState(null);
  const { user } = useSelector((state) => state.auth.user);
  const { ies } = useSelector((state) => state.view);
  const dispatch = useDispatch();

  const handleClick4 = (event) => {
    setAnchorEl4(event.currentTarget);
  };

  const handleClose4 = () => {
    setAnchorEl4(null);
  };

  return (
    <AppBar sx={sx} elevation={0} className={customClass}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          size="large"
          sx={{
            display: {
              lg: 'flex',
              xs: 'none',
            },
          }}
        >
          <FeatherIcon icon="menu" />
        </IconButton>

        <IconButton
          size="large"
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'flex',
            },
          }}
        >
          <FeatherIcon icon="menu" width="20" height="20" />
        </IconButton>
        <Box
          sx={{
            width: '1px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            height: '25px',
            ml: 1,
            mr: 1,
          }}
        />
        {/* ------------------------------------------- */}
        {/* Logos */}
        {/* ------------------------------------------- */}

        <Box sx={{ width: '15em' }}>
          <img
            src={
              ies === 'Corporacion Universitaria Americana'
                ? LogoAmericana
                : ies === 'Corporacion Educativa Del Litoral' && LogoLitoral
            }
            alt="Logo corporacion"
            width="100%"
            style={{ marginRight: '20px' }}
          />
        </Box>

        {/* ------------------------------------------- */}
        {/* Profile Dropdown */}
        {/* ------------------------------------------- */}
        <Button
          aria-label="menu"
          color="inherit"
          aria-controls="profile-menu"
          aria-haspopup="true"
          onClick={handleClick4}
          sx={{
            ml: 'auto',
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main,
                width: '30px',
                height: '30px',
              }}
            >
              {user.name && user.name[0]}
            </Avatar>
            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'flex',
                },
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h5"
                fontWeight="700"
                sx={{
                  ml: 1,
                }}
              >
                {user && user.name}
              </Typography>
              <FeatherIcon icon="chevron-down" width="20" height="20" />
            </Box>
          </Box>
        </Button>
        <Menu
          id="profile-menu"
          anchorEl={anchorEl4}
          keepMounted
          open={Boolean(anchorEl4)}
          onClose={handleClose4}
          sx={{
            '& .MuiMenu-paper': {
              width: '385px',
              right: 0,
              top: '70px !important',
            },
            '& .MuiList-padding': {
              p: '30px',
            },
          }}
        >
          <Box
            sx={{
              mb: 1,
            }}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="h4" fontWeight="500">
                Perfil de usuario
              </Typography>
            </Box>
          </Box>

          <ProfileDropdown />

          <Link
            style={{
              textDecoration: 'none',
            }}
            to="/"
          >
            <Button
              sx={{
                mt: 2,
                display: 'block',
                width: '100%',
              }}
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch(logout());
              }}
            >
              Cerrar Sesion
            </Button>
          </Link>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  customClass: PropTypes.string,
  toggleSidebar: PropTypes.func,
  toggleMobileSidebar: PropTypes.func,
};

export default Header;

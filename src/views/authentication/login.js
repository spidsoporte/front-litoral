import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Box,
  Typography,
  Button,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import Swal from 'sweetalert2';

import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import PageContainer from '../../components/container/PageContainer';

import { AlertCharging, AlertError } from '../../components/SweetAlerts/Alerts';
import { FetchTokenless } from '../../services/Fetch';
import { setDataUser, setLogged } from '../../redux/auth/Action';
import LogoIcon from '../../layouts/full-layout/logo/LogoIcon';

const Login = () => {
  const { ies: IES } = useSelector((state) => state.view);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const newDatos = { ...user, [e.target.name]: e.target.value };
    setUser(newDatos);
  };

  // eslint-disable-next-line consistent-return
  const handleSubmit = async () => {
    if (user.email === '' || user.password === '') {
      AlertError('Lo sentimos. Todos los campos son obligatorios');
    } else {
      AlertCharging();
      const res = await FetchTokenless('auth/login', user, 'POST');
      const body = await res.json();
      Swal.close();
      if (body.statusCode === 200) {
        dispatch(setLogged(true));
        dispatch(setDataUser(body));
        navigate('/dashboard');
      }
      if (body.message === 'email must be a valid email') {
        return AlertError('Correo invalido');
      }
      if (body.message === 'password length must be at least 6 characters long') {
        return AlertError('La contraseña es incorrecta');
      }
      if (body.msg) {
        if (body.msg === 'Usuario / Password no son correctos - correo') {
          return AlertError('Este usuario no se encuentra resgistrado');
        }
        if (body.msg === 'Usuario / Password no son correctos - password') {
          return AlertError('Contraseña incorrecta');
        }
        if (body.msg === 'Usuario / Password no son correctos - estado: false') {
          return AlertError(
            'Este usuario Esta inactivo actualmente, favor contactar con soporte tecnico',
          );
        }
        if (body.msg === 'User / access denied - corporation') {
          return AlertError('Acceso denegado a este espacio, Cambie la corporacion');
        }
      }
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <PageContainer title="Login" description="this is Login page">
      <Grid container spacing={0} sx={{ height: '100vh', justifyContent: 'center' }}>
        <Grid item xs={12} sm={8} lg={6} display="flex" alignItems="center">
          <Grid container spacing={0} display="flex" justifyContent="center">
            <Grid item xs={12} lg={9} xl={6}>
              <Box
                sx={{
                  p: 4,
                }}
              >
                <Box>
                  <Box sx={{ width: '15em', margin: 'auto' }}>
                    <LogoIcon text />
                  </Box>
                </Box>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      textAlign: 'center',
                      marginTop: '20px',
                      fontWeight: 'bold',
                      color: 'primary.main',
                    }}
                  >
                    {IES}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 3,
                  }}
                >
                  <CustomFormLabel htmlFor="email">Correo Electronico</CustomFormLabel>
                  <CustomTextField
                    name="email"
                    id="email"
                    variant="outlined"
                    fullWidth
                    onChange={handleInputChange}
                  />
                  <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleInputChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <Box
                    sx={{
                      display: {
                        xs: 'block',
                        sm: 'flex',
                        lg: 'flex',
                      },
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        ml: 'auto',
                        display: 'flex',
                        justifyContent: 'beetwen',
                      }}
                    >
                      <Typography
                        component={Link}
                        to="/auth/reset-password"
                        fontWeight="500"
                        sx={{
                          display: 'block',
                          textDecoration: 'none',
                          mb: '16px',
                          color: 'primary.main',
                        }}
                      >
                        Olvidaste la contraseña ?
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      pt: '10px',
                      pb: '10px',
                    }}
                    onClick={handleSubmit}
                  >
                    Iniciar Sesion
                  </Button>
                  <Button
                    component={Link}
                    to="/auth"
                    color="secondary"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      mt: '10px',
                      pt: '10px',
                      pb: '10px',
                    }}
                    startIcon={<ArrowBack />}
                  >
                    Corporaciones
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Login;

import React, { useState } from 'react';
import { Grid, Box, Typography, Button, TextField } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import PageContainer from '../../components/container/PageContainer';
import LogoIcon from '../../layouts/full-layout/logo/LogoIcon';
import { FetchTokenized } from '../../services/Fetch';
import { AlertError, AlertMessage } from '../../components/SweetAlerts/Alerts';

const NewPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    password: '',
    conf_password: '',
  });

  const [errors, setErrors] = useState({
    cedula: false,
    name: false,
    email: false,
    password: false,
    conf_password: false,
  });
  const expressions = {
    cedula: /^\d{7,10}$/, // 4 a 12 digitos.
    name: /^[a-zA-ZÀ-ÿ\s]{1,}$/, // Letras y espacios, pueden llevar acentos.
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{1,}$/, // Validacion de corrreos
    password: /^.{6,}$/, // 7 a 14 numeros.
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (expressions[name]) {
      const exre = expressions[name];
      if (!exre.test(value)) {
        setErrors({
          ...errors,
          [name]: true,
        });
      } else {
        setErrors({
          ...errors,
          [name]: false,
        });
      }
    }
    setUser({ ...user, [name]: value });
  };

  const handlePass = (e) => {
    const { name, value } = e.target;
    if (value === user.password) {
      setErrors({
        ...errors,
        [name]: false,
      });
    } else {
      setErrors({
        ...errors,
        [name]: true,
      });
    }
    setUser({ ...user, [name]: value });
  };

  // eslint-disable-next-line consistent-return
  const handleSubmit = async () => {
    if (errors.password === false && errors.conf_password === false) {
      const res = await FetchTokenized(
        'auth/Recovery-auth-password',
        token,
        { password: user.password },
        'POST',
      );
      const body = await res.json();
      if (body.statusCode === 200) {
        AlertMessage(
          'La contraseña ha sido restablecida correctamente, presione ok para ser redirigido al inicio de sesion',
        ).then((result) => {
          if (result.isConfirmed) {
            navigate('/auth');
          }
        });
      }
      if (body.statusCode === 401) {
        AlertError('Lo sentimos, el token es invalido o ha expirado').then((result) => {
          if (result.isConfirmed) {
            navigate('/auth');
          }
        });
      }
    } else {
      AlertError('El formulario contiene errores o campos vacios');
    }
  };

  const TokenValidation = async () => {
    const res = await FetchTokenized('auth/token-validarJWT', token);
    const body = await res.json();
    if (body.statusCode === 401) {
      AlertError('Lo sentimos, el token es invalido o ha expirado').then((result) => {
        if (result.isConfirmed) {
          navigate('/auth');
        }
      });
    }
  };

  React.useEffect(() => {
    TokenValidation();
  }, []);

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
                    Reestablecer Contraseña
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 3,
                  }}
                >
                  <CustomFormLabel htmlFor="password">Nueva Contraseña</CustomFormLabel>
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    onChange={handleInputChange}
                    required
                    error={errors.password}
                    helperText={
                      errors.password ? 'La contraseña debe tener mas de 6 digitos' : null
                    }
                  />
                  <CustomFormLabel htmlFor="conf_password">Confirmar Contraseña</CustomFormLabel>
                  <TextField
                    id="conf_password"
                    name="conf_password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    sx={{
                      mb: 3,
                    }}
                    onChange={handlePass}
                    required
                    error={errors.conf_password}
                    helperText={errors.conf_password ? 'Las contraseñas no coinciden' : null}
                  />

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
                    Cambiar Contraseña
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
                    Volver
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

export default NewPassword;

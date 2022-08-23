import React, { useState } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import PageContainer from '../../components/container/PageContainer';

import { AlertCharging, AlertError, AlertMessage } from '../../components/SweetAlerts/Alerts';
import { FetchTokenless } from '../../services/Fetch';
import LogoIcon from '../../layouts/full-layout/logo/LogoIcon';

const ResetPassword = () => {
  const [user, setUser] = useState({
    email: '',
    url: `http://${window.location.host}/auth/new-password`
  });

  const handleInputChange = (e) => {
    const newDatos = { ...user, [e.target.name]: e.target.value };
    setUser(newDatos);
  };
  // eslint-disable-next-line consistent-return
  const handleSubmit = async () => {
    if (user.email === '') {
      AlertError('Lo sentimos. Todos los campos son obligatorios');
    } else {
      AlertCharging();
      const res = await FetchTokenless('auth/Recovery-password', user, 'POST');
      const body = await res.json();
      if (body.statusCode === 400){
        if (body.msg === 'users does not exist'){
          AlertError('Este correo no esta registrado')
        }
      }
      if (body.statusCode === 200){
        AlertMessage(`Correo de verificacion enviado exitosamente a ${user.email}, revise su bandeja de entrada`)
      }
      if (body.statusCode === 401){
        AlertError('Token invalido o expirado')
      }
    }
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
                    Reestablecer Contraseña
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
                    sx={{
                      mb: '16px',
                    }}
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
                    Enviar Correo de Recuperacion
                  </Button>
                  <Button
                    component={Link}
                    to="/auth/login"
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

export default ResetPassword;

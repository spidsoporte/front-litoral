import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/container/PageContainer';

const FailedToFetch = () => (
  <PageContainer title="Error" description="this is Error page">
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      textAlign="center"
      justifyContent="center"
      sx={{ backgroundColor: '#e4f5ff' }}
    >
      <Container maxWidth="md">
        <Typography
          align="center"
          variant="h1"
          sx={{
            pt: 2,
            color: (theme) =>
              `${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.87)'}`,
          }}
        >
          500
        </Typography>
        <Typography
          align="center"
          variant="h4"
          sx={{
            pt: 1,
            pb: 3,
            color: (theme) =>
              `${theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(0, 0, 0, 0.87)'}`,
          }}
        >
          Lo Sentimos, no hemos podido conectar con el servidor, nuestro equipo de soporte y mantenimiento esta trabajando para solucionarlo lo antes posible.
        </Typography>
        <Button color="primary" variant="contained" component={Link} to="/" disableElevation>
          Volver a intentar
        </Button>
      </Container>
    </Box>
  </PageContainer>
);

export default FailedToFetch;

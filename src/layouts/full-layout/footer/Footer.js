import React from 'react';
import { Box, Typography } from '@mui/material';
import LogoAlcaldia from '../../../assets/images/logos/Logo-Alcaldia.jpg';
import LogoUAB from '../../../assets/images/logos/Logo-UAB.png';

const Footer = () => {
  return (
    <Box sx={{ p: 3, textAlign: 'center', display: { sm: 'block', lg: 'flex' }}}>
      <Box>
        <img src={LogoUAB} alt="Logo alcaldia" width="100" />
        <img src={LogoAlcaldia} alt="Logo alcaldia" width="300" style={{ marginRight: '20px' }} />
      </Box>
      <Typography sx={{marginLeft:'auto'}}>© 2022 Todos los derechos reservados - Departamento de Bienestar Institucional</Typography>
    </Box>
  );
};

export default Footer;

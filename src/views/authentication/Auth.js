import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { Grid, Box, Card, Typography } from '@mui/material';
import PageContainer from '../../components/container/PageContainer';
import LogoAmericana from '../../assets/images/logos/Logo-Americana.png';
import LogoLitoral from '../../assets/images/logos/Logo-Litoral.png';
import { setIES } from '../../redux/view/Action';
import Logo from '../../assets/images/Logo SPID/Logo.png';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (uid) => {
    if (uid === 1) {
      dispatch(setIES('Corporacion Universitaria Americana'));
    } else if (uid === 2) {
      dispatch(setIES('Corporacion Educativa Del Litoral'));
    }
    navigate('./login');
  };
  return (
    <PageContainer title="Login" description="this is Login page">
      <Grid container spacing={0} sx={{ height: '100vh', justifyContent: 'center' }}>
        <Grid item xs={12} sm={8} lg={6} display="flex" alignItems="center">
          <Grid container spacing={0} display="flex" justifyContent="center">
            <Grid item xs={12} lg={10} xl={8}>
              <Box
                sx={{
                  p: 2,
                }}
              >
                <Box mb={5}>
                  <Box sx={{ width: '15em', margin: 'auto' }}>
                    <img src={Logo} alt="Logo spid" width="100%" />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    mt: 5,
                  }}
                >
                  <Card
                    className="card-transition"
                    p="10px"
                    onClick={() => handleClick(1)}
                  >
                    <img src={LogoAmericana} alt="Logo Americana" width="100%" />
                    <Box textAlign='center'>
                      <Typography color="textSecondary">Presione Aqui</Typography>
                    </Box>
                  </Card>
                  <Card
                    className="card-transition"
                    onClick={() => handleClick(2)}
                  >
                    <img src={LogoLitoral} alt="Logo Litoral" width="100%" />
                    <Box textAlign='center'>
                      <Typography color="textSecondary">Presione Aqui</Typography>
                    </Box>
                  </Card>
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

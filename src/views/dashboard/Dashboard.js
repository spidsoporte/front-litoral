/* eslint-disable no-unused-vars */
import React from 'react';
import Swal from 'sweetalert2';
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import AttendanceResults from '../../components/dashboard/AttendaceResults';
import { FetchTokenless } from '../../services/Fetch';
import { AlertCharging, AlertError, AlertSuccess } from '../../components/SweetAlerts/Alerts';
// import DailyReport from '../../components/dashboard/DailyReport';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth.user);

  const handleRecount = async () => {
    AlertCharging()
    await FetchTokenless('student/up')
      .then((res) => {res.json()})
      .then((res) => {
        Swal.close()
        if (res.statusCode === 200){
          AlertSuccess('Reconteo Exitoso')
        }else{
          AlertError('ERROR, Ejecucion de reconteo cancelada')
        }
      })
      .catch((err) => {
        Swal.close()
        AlertError(`ERROR - ${err}`)
      })
  };

  return (
    <PageContainer title="SPID | Dashboard" description="this is Starter Page">
      {/* breadcrumb */}
      <Breadcrumb title="Inicio" subtitle={`Bienvenido a SPID ${user.name}`} />
      {/* end breadcrumb */}
      <Grid container spacing={0}>
        {/* ------------------------- row 1 ------------------------- */}
        <Grid item xs={12} lg={12}>
          <Card>
            <CardContent>
              <Typography variant="h2">
                Sistema para la prevención de inasistencias y deserción
              </Typography>
              <Typography variant="body1">
                Bienvenido a SPID (Sistema para la Prevención de Inasistencias y Deserción)
              </Typography>
            </CardContent>
          </Card>
          <AttendanceResults/>
          {/* <Button variant="contained" onClick={handleRecount}>Reconteo</Button> */}
        </Grid>
      </Grid>
    </PageContainer>
  );
};
export default Dashboard;

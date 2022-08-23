import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import AttendanceResults from '../../components/dashboard/AttendaceResults';
// import DailyReport from '../../components/dashboard/DailyReport';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth.user);


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
          {/* <DailyReport /> */}
        </Grid>
      </Grid>
    </PageContainer>
  );
};
export default Dashboard;

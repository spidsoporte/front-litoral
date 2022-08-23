/* eslint-disable prefer-template */
import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { FetchTokenized } from '../../services/Fetch';
import { logout } from '../../redux/auth/Action';

const AttendanceResults = () => {
  const { token } = useSelector((state) => state.auth.user);

  const [trafficLights, setTrafficLights] = React.useState({});
  const dispatch = useDispatch()

  const listTrafficLights = async () => {
    const res = await FetchTokenized('student/list-trafficLights', token);
    const body = await res.json();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    if (body.statusCode === 200) {
      setTrafficLights(body.TrafficLights);
    }
  };

  React.useEffect(() => {
    listTrafficLights();
  }, []);

  const theme = useTheme();
  const success = theme.palette.success.main;
  const warning = theme.palette.warning.main;
  const danger = theme.palette.danger.main;
  const dark = theme.palette.dark.main;
  const blue = theme.palette.primary.main;

  const optionstotalsales = {
    labels: [
      '1 - 4 Inasistencias',
      '5 - 9 Inasistencias',
      '10 - 15 Inasistencias',
      '15+ Inasistencias',
      'Sin inasistencias',
    ],

    chart: {
      height: 280,
      type: 'donut',
      foreColor: '#adb0bb',
      fontFamily: 'DM sans',
    },
    colors: [success, warning, danger, dark, blue],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      colors: ['transparent'],
    },
    plotOptions: {
      pie: {
        donut: {
          size: '78%',
          background: 'transparent',
          labels: {
            show: false,
            name: {
              show: true,
              fontSize: '18px',
              color: undefined,
              offsetY: -10,
            },
            value: {
              show: false,
              color: '#98aab4',
            },
            total: {
              show: false,
              label: 'Our Visitors',
              color: '#98aab4',
            },
          },
        },
      },
    },
    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
    },
  };

  const { total } = trafficLights;
  const { green } = trafficLights;
  const { yellow } = trafficLights;
  const { red } = trafficLights;
  const { black } = trafficLights;

  const totalBlue = total - (green + yellow + red + black);

  const seriestotalsales = [green, yellow, red, black, totalBlue];

  return (
    <Card>
      <Typography variant="h2" marginY={1} marginLeft={2}>
        Semaforo de inasistentes
      </Typography>
      <Chart options={optionstotalsales} series={seriestotalsales} type="donut" height="280" />
      <Box
        sx={{
          mt: 4,
        }}
      >
        {optionstotalsales.labels.map((label, i) => (
          <Box display="flex" alignItems="center" ml="45px">
            <Box
              sx={{
                backgroundColor: optionstotalsales.colors[i],
                borderRadius: '50%',
                height: 8,
                width: 8,
                mr: 1,
              }}
            />
            <Typography color="textSecondary" variant="h6">
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default AttendanceResults;

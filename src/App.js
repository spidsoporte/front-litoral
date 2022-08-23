import React from 'react';
import './assets/css/master.css';
import { useRoutes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import RTL from './layouts/full-layout/customizer/RTL';
import ThemeSettings from './layouts/full-layout/customizer/ThemeSettings';
import Router from './routes/Router';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { logout } from './redux/auth/Action';
import { FetchTokenized } from './services/Fetch';
import { AlertError } from './components/SweetAlerts/Alerts';
import SessionTimeout from './SessionTimeout';

const App = () => {
  const routing = useRoutes(Router);
  const theme = ThemeSettings();
  const customizer = useSelector((state) => state.custom);
  const { token } = useSelector((state) => state.auth.user);
  const { isLogged } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const TokenValidation = async () => {
    await FetchTokenized('auth/token-validarJWT', token)
      .then((res) => {
        const body = res.json();
        if (body.statusCode === 401) {
          dispatch(logout());
        }
      })
      .catch((err) => AlertError(err));
  };

  React.useEffect(() => {
    TokenValidation();
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <RTL direction={customizer.activeDir}>
          <CssBaseline />
          {routing}
        </RTL>
        {isLogged && <SessionTimeout />}
      </ThemeProvider>
    </>
  );
};

export default App;

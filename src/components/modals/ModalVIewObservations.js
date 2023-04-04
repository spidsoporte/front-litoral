/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-template */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import FeatherIcon from 'feather-icons-react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Card, MenuItem, Typography, Box, IconButton, Chip, Avatar } from '@mui/material';
import CustomSelect from '../forms/custom-elements/CustomSelect';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import { AlertCharging, AlertError, AlertSuccess } from '../SweetAlerts/Alerts';
import { FetchTokenized } from '../../services/Fetch';
import { logout } from '../../redux/auth/Action';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalViewObservations({ uid, open, handleClose }) {
  const { token } = useSelector((state) => state.auth.user);
  const { user } = useSelector((state) => state.auth.user);
  const [data, setData] = React.useState([]);
  const [years, setYears] = React.useState([]);
  const [date, setDate] = React.useState('');
  const [semester, setSemester] = React.useState('');
  const dispatch = useDispatch();

  const handleList = async () => {
    const student = { id_student: uid, date, periodo: semester };
    const res = await FetchTokenized('student/observations-list', token, student, 'POST');
    const body = await res.json();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    if (body.statusCode === 200) {
      setData(body.observationDate);
    }
    if (body.statusCode === 400) {
      AlertError(body.msg || body.message);
    }
    if (body.statusCode === 410) {
      AlertError(body.msg || body.message);
    }
  };

  const handleListYears = async () => {
    const res = await FetchTokenized('student/observations-list-a', token);
    const body = await res.json();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    if (body.statusCode === 200) {
      setYears(body.fecha);
    }
    if (body.statusCode === 400) {
      AlertError('Error en la peticion');
    }
    if (body.statusCode === 410) {
      AlertError('Contactar con soporte');
    }
  };

  React.useEffect(() => {
    if (uid) {
      handleList();
      handleListYears();
    }
  }, [uid]);

  React.useEffect(() => {
    setData([]);
  }, [open]);

  // eslint-disable-next-line no-shadow
  const deleteObservation = async (uidObservation) => {
    AlertCharging();
    // eslint-disable-next-line prefer-template
    const url = 'student/observations-delete/' + uidObservation;
    const res = await FetchTokenized(url, token, { '': '' }, 'DELETE');
    const body = await res.json();
    Swal.close();
    if (body.msg === 'observation deleted successfully') {
      AlertSuccess('Observacion eliminada exitosamente');
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  // eslint-disable-next-line no-shadow
  const handleDelete = (uidObservation) => {
    Swal.fire({
      customClass: {
        container: 'z-index',
      },
      title: '¿Estas Seguro?',
      text: '¿Quieres eliminar a esta observacion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteObservation(uidObservation);
      }
    });
  };

  return (
    <div>
      <Dialog
        maxWidth="md"
        fullScreen={screen.width < 600}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          margin: 'auto',
        }}
      >
        <DialogTitle sx={{ fontSize: '1.5em' }}>Observaciones del estudiante</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ width: '100%', padding: '3px' }}>
              <CustomFormLabel htmlFor="institution">Año</CustomFormLabel>
              <CustomSelect
                id="date"
                name="date"
                fullWidth
                variant="outlined"
                size="small"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      overflow: 'auto',
                    },
                  },
                }}
                onChange={(e) => setDate(e.target.value)}
                value={date}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </CustomSelect>
            </Box>
            <Box sx={{ width: '100%', padding: '3px' }}>
              <CustomFormLabel htmlFor="institution">Semestre</CustomFormLabel>
              <CustomSelect
                id="semester"
                name="semester"
                fullWidth
                variant="outlined"
                size="small"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      overflow: 'auto',
                    },
                  },
                }}
                onChange={(e) => setSemester(e.target.value)}
                value={semester}
              >
                <MenuItem value="1">1</MenuItem>
                <MenuItem value="2">2</MenuItem>
              </CustomSelect>
            </Box>
            <Box
              sx={{
                width: '25%',
                padding: '3px',
                marginTop: 'auto',
              }}
            >
              <IconButton variant="contained" color="primary" onClick={handleList}>
                <SendIcon fontSize="inherit" />
              </IconButton>
            </Box>
          </Box>
          {data.length === 0 ? (
            <Typography textAlign="center">Sin Observaciones</Typography>
          ) : (
            data.map((dato) => {
              const dateTimestamp = Date.parse(dato.createdAt);
              const dateParse = new Date(dateTimestamp);

              const year = dateParse.getFullYear();
              let month = dateParse.getMonth() + 1;
              let day = dateParse.getDate();

              if (month < 10) {
                month = '0' + month;
              }

              if (day < 10) {
                day = '0' + day;
              }

              let hour = dateParse.getHours();
              let minutes = dateParse.getMinutes();

              if (hour < 10) {
                hour = '0' + hour;
              }

              if (minutes < 10) {
                minutes = '0' + minutes;
              }

              const fullDate = `${day}/${month}/${year}`;
              const time = `${hour}:${minutes}`;

              return (
                <Card
                  sx={{
                    marginX: '0',
                    width: '750px',
                  }}
                >
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption" color="text.danger">
                      {fullDate} - {time}
                    </Typography>
                    {user.rol === 'ADMINISTRADOR' && (
                      <IconButton
                        aria-label="delete"
                        size="small"
                        color="danger"
                        onClick={() => handleDelete(dato.uid)}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    )}
                  </Box>
                  <Typography variant="h4" mt={1}>
                    <Chip
                      variant="contened"
                      sx={{
                        backgroundColor:
                          dato.status_attendance === '1'
                            ? (theme) => theme.palette.success.main
                            : dato.status_attendance === '2'
                            ? (theme) => theme.palette.warning.main
                            : dato.status_attendance === '3'
                            ? (theme) => theme.palette.danger.main
                            : (theme) => theme.palette.dark.main,
                        color: '#fff',
                        width: '15px',
                        height: '15px',
                        mr: '5px',
                        borderRadius: '50%',
                      }}
                      size="small"
                    />
                    {dato.reason}
                  </Typography>
                  <Chip
                    sx={{
                      backgroundColor:
                        dato.state_contact === 'Contactado'
                          ? (theme) => theme.palette.success.main
                          : (theme) => theme.palette.danger.main,
                      color: '#fff',
                      borderRadius: '6px',
                    }}
                    size="small"
                    label={dato.state_contact}
                  />
                  <Typography variant="body2" my={3}>
                    {dato.body}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        backgroundColor: (theme) => theme.palette.primary.main,
                        width: '35px',
                        height: '35px',
                        color: '#fff',
                        mr: '10px',
                      }}
                    >
                      {dato.id_user && dato.id_user.name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h5">{dato.id_user && dato.id_user.name}</Typography>
                      <Typography variant="caption">{dato.id_user && dato.id_user.rol}</Typography>
                    </Box>
                  </Box>
                </Card>
              );
            })
          )}
        </DialogContent>
        <DialogActions sx={{ margin: '5px' }}>
          <Button onClick={handleClose} color="danger">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

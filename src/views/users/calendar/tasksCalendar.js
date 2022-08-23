import React, { useState } from 'react';
import FeatherIcon from 'feather-icons-react';
import {
  Card,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fab,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import PageContainer from '../../../components/container/PageContainer';
import Breadcrumb from '../../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomTextField from '../../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/custom-elements/CustomFormLabel';
import { FetchTokenized } from '../../../services/Fetch';
import { AlertCharging, AlertSuccess } from '../../../components/SweetAlerts/Alerts';
import CustomRadio from '../../../components/forms/custom-elements/CustomRadio';
import { logout } from '../../../redux/auth/Action';

moment.locale('es');
const localizer = momentLocalizer(moment);

const ACalendar = () => {
  const { token } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch()

  const [calevents, setCalEvents] = useState();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [state, setState] = useState('');
  const [slot, setSlot] = useState();
  const [color, setColor] = useState('default');
  const [update, setUpdate] = useState();
  const [UID, setUid] = useState();

  const getTasks = async () => {
    AlertCharging();
    const events = [];
    const url = `user/calendar-list`;
    const res = await FetchTokenized(url, token);
    const body = await res.json();
    Swal.close();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    body.calendar.forEach((element) => {
      const { start, end, ...data } = element;
      const s = new Date(start);
      const e = new Date(end);
      const d = {
        ...data,
        start: s,
        end: e,
      };
      events.push(d);
    });
    setCalEvents(events);
  };

  React.useEffect(() => {
    getTasks();
  }, []);

  const ColorVariation = [
    {
      id: 1,
      eColor: '#1a97f5',
      value: 'default',
    },
    {
      id: 2,
      eColor: '#49af56',
      value: 'green',
    },
    {
      id: 3,
      eColor: '#e52020',
      value: 'red',
    },
    {
      id: 5,
      eColor: '#ffd000',
      value: 'warning',
    },
    {
      id: 4,
      eColor: '#102235',
      value: 'azure',
    },
  ];
  const addNewEventAlert = (slotInfo) => {
    setOpen(true);
    setSlot(slotInfo);
  };

  const editEvent = (event) => {
    setOpen(true);
    setColor(event.color);
    setTitle(event.title);
    setComment(event.comment);
    setState(event.state);
    setColor(event.color);
    setSlot({ start: event.start, end: event.end });
    setUpdate(event);
    setUid(event.uid);
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    AlertCharging();

    // eslint-disable-next-line no-shadow
    const updateEvent = {
      title,
      comment,
      state,
      color,
      start: slot.start,
      end: slot.end,
    };

    const url = `user/calendar-update/${UID}`;
    const res = await FetchTokenized(url, token, updateEvent, 'PUT');
    const body = await res.json();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    if (body.msg === 'successful update') {
      Swal.close();
      AlertSuccess('Tarea Actualizada');
      setTimeout(() => {
        getTasks();
      }, 2000);
    }
    setOpen(false);
    setTitle('');
    setComment('');
    setState('');
    setColor('default');
    setUpdate(null);
  };
  const inputChangeHandler = (e) => setTitle(e.target.value);
  const commentChangeHandler = (e) => setComment(e.target.value);
  const stateChangeHandler = (e) => setState(e.target.value);

  const selectinputChangeHandler = (id) => setColor(id);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newEvents = {
      title,
      comment,
      state,
      color,
      start: slot.start,
      end: slot.end,
    };
    setOpen(false);
    e.target.reset();

    AlertCharging();
    const res = await FetchTokenized('user/calendar-new', token, newEvents, 'POST');
    const body = await res.json();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    Swal.close();
    if (body.msg === 'Registro exitoso') {
      AlertSuccess('Tarea Agregada');
      setTitle('');
      setTimeout(() => {
        getTasks();
      }, 1000);
    }
    if (body.msg === 'color is not allowed to be empty') {
      AlertSuccess('Tarea Agregada');
      setTitle('');
      setTimeout(() => {
        getTasks();
      }, 1000);
    }
  };
  const deleteHandler = async (uid) => {
    AlertCharging();
    // eslint-disable-next-line prefer-template
    const url = 'user/calendar-delete/' + uid;
    const res = await FetchTokenized(url, token, { '': '' }, 'DELETE');
    const body = await res.json();
    Swal.close();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    if (body.msg === 'deleted successfully') {
      AlertSuccess('Tarea Eliminada', 1000);
      setTimeout(() => {
        getTasks();
      }, 1000);
    }
    setOpen(false);
    setTitle('');
    setComment('');
    setState('');
    setColor('default');
    setUpdate(null);
  };
  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setComment('');
    setState('');
    setColor('default');
    setUpdate(null);
  };

  const eventColors = (event) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }
    return { className: `event-default` };
  };
  const BCrumb = [
    {
      title: 'Usuarios',
    },
    {
      title: 'Calendario de Tareas',
    },
  ];

  return (
    <PageContainer title="SPID | Calendario de tareas" description="this is Calendar page">
      <Breadcrumb title="Calendario de Tareas" items={BCrumb} />
      <Card>
        <CardContent>
          <Calendar
            selectable
            events={calevents}
            defaultView="month"
            scrollToTime={new Date(1970, 1, 1, 6)}
            defaultDate={new Date()}
            localizer={localizer}
            style={{ height: 'calc(100vh - 350px' }}
            onSelectEvent={(event) => editEvent(event)}
            onSelectSlot={(slotInfo) => addNewEventAlert(slotInfo)}
            eventPropGetter={(event) => eventColors(event)}
            messages={{
              next: "Siguiente",
              previous: "Anterior",
              today: "Hoy",
              month: "Mes",
              week: "Semana",
              day: "Día",
              noEventsInRange: "No hay eventos actualmente"
            }}
          />
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth>
        <form onSubmit={update ? updateEvent : submitHandler}>
          <DialogContent>
            <Typography variant="h3" sx={{ mb: 2 }}>
              {update ? 'Actualizar Tarea' : 'Agregar Tarea'}
            </Typography>
            <CustomFormLabel htmlFor="Event Title">Tarea</CustomFormLabel>
            <CustomTextField
              id="Event Title"
              placeholder="Escriba la tarea"
              variant="outlined"
              fullWidth
              value={title}
              sx={{ mb: 1 }}
              onChange={inputChangeHandler}
              size="small"
            />
            <CustomFormLabel htmlFor="Event Comment">Comentario</CustomFormLabel>
            <CustomTextField
              id="Event Comment"
              placeholder="Escriba un comentario"
              variant="outlined"
              fullWidth
              value={comment}
              sx={{ mb: 1 }}
              onChange={commentChangeHandler}
              size="small"
              multiline
              rows={5}
            />
            <CustomFormLabel htmlFor="estado_de_estudiante">Estado de la tarea</CustomFormLabel>
            <FormControl component="fieldset">
              <RadioGroup name="estado_de_estudiante" value={state} onChange={stateChangeHandler}>
                <FormControlLabel value="pendiente" control={<CustomRadio />} label="Pendiente" />
                <FormControlLabel value="realizado" control={<CustomRadio />} label="Realizado" />
              </RadioGroup>
            </FormControl>
            <CustomFormLabel>Seleccione el semáforo de Riesgo de la tarea</CustomFormLabel>

            {ColorVariation.map((mcolor) => {
              return (
                <Fab
                  color="primary"
                  style={{ backgroundColor: mcolor.eColor }}
                  sx={{ marginRight: '3px' }}
                  size="small"
                  key={mcolor.id}
                  onClick={() => selectinputChangeHandler(mcolor.value)}
                >
                  {mcolor.value === color ? <FeatherIcon icon="check" size="16" /> : ''}
                </Fab>
              );
            })}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>

            {update ? (
              <Button color="error" variant="contained" onClick={() => deleteHandler(UID)}>
                Eliminar
              </Button>
            ) : (
              ''
            )}
            <Button type="submit" disabled={!title} variant="contained">
              {update ? 'Actualizar' : 'Agregar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default ACalendar;

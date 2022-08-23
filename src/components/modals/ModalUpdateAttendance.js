/* eslint-disable no-restricted-globals */
/* eslint-disable no-lonely-if */
/* eslint-disable react/prop-types */
import * as React from 'react';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {
  FormControl,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
} from '@mui/material';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import { AlertCharging, AlertError, AlertSuccess } from '../SweetAlerts/Alerts';
import { FetchTokenized } from '../../services/Fetch';
import CustomCheckbox from '../forms/custom-elements/CustomCheckbox';
import { logout } from '../../redux/auth/Action';

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalUpdateAttendance({ open, handleClose }) {
  const { token } = useSelector((state) => state.auth.user);
  const dispatch = useDispatch()

  const [dataForm, setDataForm] = React.useState({});
  const [attendance, setAttendance] = React.useState({});
  const [checkbox, setCheckbox] = React.useState(true);

  const handleChange = (e) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setCheckbox(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    AlertCharging();
    // eslint-disable-next-line prefer-template
    const res = await FetchTokenized('student/search', token, dataForm, 'POST');
    const body = await res.json();
    Swal.close();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    if (
      body.success === true &&
      body.attendanceStudentDate.lenght !== 0 &&
      body.attendanceStudentDate[0]
    ) {
      setAttendance(body.attendanceStudentDate[0]);
      setCheckbox(body.attendanceStudentDate[0].attendance);
    } else {
      if (body.msg === 'the student does not exist') {
        AlertError('Este estudiante no existe');
      } else {
        AlertError('Este estudiante no registra asistencia el dia de hoy');
      }
    }
  };

  const handleSave = async () => {
    AlertCharging();
    const data = {
      uid: attendance.uid,
      attendance: checkbox,
    };
    // eslint-disable-next-line prefer-template
    const res = await FetchTokenized('student/attendance-update', token, data, 'PUT');
    const body = await res.json();
    Swal.close();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    if (body.msg === 'support update successful') {
      setDataForm({ identificacion: '' });
      setAttendance({});
      AlertSuccess('Asistencia Registrada');
    }
    if (body.msg === 'error cannot modify this assistance') {
      setDataForm({ identificacion: '' });
      setAttendance({});
      AlertError('Ya no se puede modificar esta asistencia');
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ fontSize: '1.5em' }}>Corregir Asistencia</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth>
              <CustomFormLabel
                sx={{
                  mt: 0,
                }}
                htmlFor="identificacion"
              >
                Identificacion
              </CustomFormLabel>
              <OutlinedInput
                type="number"
                id="identificacion"
                name="identificacion"
                value={dataForm.identificacion}
                fullWidth
                size="small"
                onChange={handleChange}
                required
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              sx={{
                marginY: '10px',
              }}
              variant="contained"
            >
              Consultar asistencia
            </Button>
          </form>
          <Box sx={{ overflow: 'auto' }}>
            <Table
              aria-label="simple table"
              sx={{
                whiteSpace: 'nowrap',
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h5">Identificaion</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h5">Nombre</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h5">Asistencia</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendance.uid && (
                  <TableRow>
                    <TableCell>
                      <Typography>{attendance.id_student.identificacion}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {attendance.id_student.nombre_completo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <CustomCheckbox onChange={handleCheckbox} checked={checkbox} />
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
        <DialogActions sx={{ margin: '5px' }}>
          <Button onClick={handleClose} color="danger">
            Cancelar
          </Button>
          <Button onClick={handleSave} endIcon={<SaveIcon />}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

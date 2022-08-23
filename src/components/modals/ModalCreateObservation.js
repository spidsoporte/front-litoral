/* eslint-disable no-restricted-globals */
/* eslint-disable react/prop-types */
import * as React from 'react';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import CustomTextField from '../forms/custom-elements/CustomTextField';
import { AlertCharging, AlertSuccess } from '../SweetAlerts/Alerts';
import { FetchTokenized } from '../../services/Fetch';

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

const reasons = [
  'Dificultades economicas',
  'Dificultades personales',
  'Dificultades familiares',
  'Dificultades de cruce laboral',
  'Desmotivacion',
  'Traslado de ciudad',
  'Traslado de Pais',
  'Estudiante fallecido',
  'Desconocido',
  'Otro',
];
const stateContacts = ['Contactado', 'No Contactado'];

export default function ModalCreateObservation({ statusAttendance, uid, open, handleClose }) {
  const { token } = useSelector((state) => state.auth.user);
  const { user } = useSelector((state) => state.auth.user);

  const [dataForm, setDataForm] = React.useState({});
  const [otherReason, setOtherReason] = React.useState('');

  React.useEffect(() => {
    setDataForm({ id_student: uid, id_user: user.uid, status_attendance: statusAttendance });
  }, [open]);

  const handleChange = (e) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    AlertCharging();
    let data = dataForm
    if(otherReason !== ''){
      data = {...data, reason: otherReason}
    }
    const res = await FetchTokenized('student/observations-create', token, data, 'POST');
    const body = await res.json();
    Swal.close();

    if (body.msg === 'successful observation') {
      AlertSuccess('Observacion registrada');
      setTimeout(() => {
        setDataForm({});
        handleClose();
      }, 2000);
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
        <DialogTitle sx={{ fontSize: '1.5em' }}>Observacion</DialogTitle>
        <DialogContent>
          <form>
            <FormControl fullWidth size="small" sx={{ marginY: '10px' }}>
              <InputLabel id="reason">Motivo de inasistencia</InputLabel>
              <Select
                labelId="reason"
                id="reason"
                name="reason"
                fullWidth
                value={dataForm.reason ? dataForm.reason : ''}
                onChange={(e) => {
                  handleChange(e)
                  setOtherReason('')
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      overflow: 'auto',
                    },
                  },
                }}
                required
                input={<OutlinedInput label="Motivo de inasistencia" />}
              >
                {reasons.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {dataForm.reason === 'Otro' && (
              <FormControl fullWidth>
                <CustomFormLabel
                  sx={{
                    mt: 0,
                  }}
                  htmlFor="otherReason"
                >
                  Cual?
                </CustomFormLabel>
                <CustomTextField
                  id="otherReason"
                  name="otherReason"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  required
                />
              </FormControl>
            )}
            <FormControl fullWidth size="small" sx={{ marginY: '10px' }}>
              <InputLabel id="state_contact">Estado de contacto</InputLabel>
              <Select
                labelId="state_contact"
                id="state_contact"
                name="state_contact"
                fullWidth
                value={dataForm.state_contact ? dataForm.state_contact : ''}
                onChange={handleChange}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      overflow: 'auto',
                    },
                  },
                }}
                required
                input={<OutlinedInput label="Estado de contacto" />}
              >
                {stateContacts.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <CustomFormLabel
                sx={{
                  mt: 0,
                }}
                htmlFor="body"
              >
                Descripcion del acompañamiento
              </CustomFormLabel>
              <CustomTextField
                id="body"
                name="body"
                multiline
                rows={6}
                variant="outlined"
                fullWidth
                size="small"
                value={dataForm.body ? dataForm.body : ''}
                onChange={handleChange}
              />
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions sx={{ margin: '5px' }}>
          <Button onClick={handleClose} color="danger">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} endIcon={<SaveIcon />}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

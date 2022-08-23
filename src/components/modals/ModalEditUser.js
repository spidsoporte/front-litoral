/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { FormControl, MenuItem, TextField } from '@mui/material';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import CustomSelect from '../forms/custom-elements/CustomSelect';
import { AlertCharging, AlertError, AlertSuccess } from '../SweetAlerts/Alerts';
import { FetchTokenized } from '../../services/Fetch';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalEditUser({ dataUser, open, handleClose, listUsers }) {
  const { token } = useSelector((state) => state.auth.user);

  const [dataForm, setDataForm] = React.useState({});

  React.useEffect(() => {
    init();
  }, [dataUser]);

  const init = () => {
    setDataForm(dataUser);
  };

  const roles = [
    {
      value: 'ADMINISTRADOR',
      label: 'ADMINISTRADOR',
    },
    {
      value: 'COORDINADOR',
      label: 'COORDINADOR',
    },
    {
      value: 'DOCENTE',
      label: 'DOCENTE',
    },
    {
      value: 'PSICOLOGO',
      label: 'PSICOLOGO',
    },
    {
      value: 'EXTERNO',
      label: 'EXTERNO',
    },
  ];
  const [errors, setErrors] = React.useState({
    cedula: false,
    name: false,
    email: false,
  });
  const expressions = {
    cedula: /^\d{7,10}$/, // 4 a 12 digitos.
    name: /^[a-zA-ZÀ-ÿ\s]{1,}$/, // Letras y espacios, pueden llevar acentos.
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{1,}$/, // Validacion de corrreos
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (expressions[name]) {
      const exre = expressions[name];
      if (!exre.test(value)) {
        setErrors({
          ...errors,
          [name]: true,
        });
      } else {
        setErrors({
          ...errors,
          [name]: false,
        });
      }
    }
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      errors.cedula === false &&
      errors.name === false &&
      errors.email === false &&
      dataForm.rol !== null
    ) {
      handleClose();
      AlertCharging();
      const { uid, estado, createdAt, updatedAt, ...data } = dataForm;
      // eslint-disable-next-line prefer-template
      const url = 'user/' + uid;
      const res = await FetchTokenized(url, token, data, 'PUT');
      const body = await res.json();
      Swal.close();
      
      if (body.message === 'email must be a valid email') {
        AlertError('Correo invalido');
      }

      if (body.statusCode === 410) {
        AlertError('Error en la estructura del formulario, contactarse con soporte');
      }

      if (body.msg === 'corporate or personal email existing') {
        AlertError('Este correo ya esta siendo usado por otro estudiante');
      }

      if (body.statusCode === 200) {
        AlertSuccess('Estudiante actualizado exitosamente');
        setTimeout(() => {
          listUsers();
        }, 2000);
      }
    } else {
      AlertError('Lo sentimos. El formulario contiene errores o campos vacios');
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        fullScreen={screen.width < 600}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ fontSize: '1.5em' }}>Modificar datos del usuario</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}> 
            <FormControl fullWidth>
              <CustomFormLabel
                sx={{
                  mt: 0,
                }}
                htmlFor="cedula"
              >
                Cedula
              </CustomFormLabel>
              <TextField
                id="cedula"
                name="cedula"
                value={dataForm.cedula}
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.cedula}
                helperText={
                  errors.cedula
                    ? 'La cedula debe tener de 7 a 10 numeros enteros y positivos'
                    : null
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="nombre">Nombre</CustomFormLabel>
              <TextField
                id="name"
                name="name"
                value={dataForm.name}
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.name}
                helperText={
                  errors.name
                    ? 'El nombre no permite numeros o caracteres especiales, solo acentos'
                    : null
                }
              />
            </FormControl>
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="email">Correo Electronico</CustomFormLabel>
              <TextField
                id="email"
                name="email"
                value={dataForm.email}
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.email}
                helperText={errors.email ? 'El correo no es valido' : null}
              />
            </FormControl>
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="ies">IES</CustomFormLabel>
              <TextField
                id="ies"
                name="ies"
                value={dataForm.ies}
                fullWidth
                size="small"
                disabled
                required
              />
            </FormControl>
            <CustomFormLabel htmlFor="rol">Rol</CustomFormLabel>
            <CustomSelect
              id="rol"
              name="rol"
              value={dataForm.rol}
              fullWidth
              variant="outlined"
              size="small"
              onChange={handleChange}
              required
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </CustomSelect>
            <DialogActions sx={{ margin: '5px' }}>
              <Button onClick={handleClose} color="danger">
                Cancelar
              </Button>
              <Button type='submit'>Actualizar Cambios</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

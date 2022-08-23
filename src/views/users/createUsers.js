/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import { Card, CardContent, Box, Button, FormControl, MenuItem, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { AlertCharging, AlertError, AlertSuccess } from '../../components/SweetAlerts/Alerts';
import { FetchTokenized } from '../../services/Fetch';
import { logout } from '../../redux/auth/Action';

const roles = [
  {
    value: null,
    label: 'Vacio',
  },
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

const BCrumb = [
  {
    title: 'Usuarios',
  },
  {
    title: 'Crear usuario',
  },
];

const CreateUser = () => {
  const { token } = useSelector((state) => state.auth.user);
  const { ies: Ies } = useSelector((state) => state.view);
  const initialData = {
    cedula: '',
    name: '',
    email: '',
    password: '',
    conf_password: '',
    rol: '',
    ies: Ies,
  };
  const dispatch = useDispatch();

  const [dataForm, setDataForm] = useState(initialData);
  const [errors, setErrors] = useState({
    cedula: false,
    name: false,
    email: false,
    password: false,
    conf_password: false,
  });
  const expressions = {
    cedula: /^\d{7,10}$/, // 4 a 12 digitos.
    name: /^[a-zA-ZÀ-ÿ\s]{1,}$/, // Letras y espacios, pueden llevar acentos.
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{1,}$/, // Validacion de corrreos
    password: /^.{6,}$/, // 7 a 14 numeros.
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

  const handlePass = (e) => {
    const { name, value } = e.target;
    if (value === dataForm.password) {
      setErrors({
        ...errors,
        [name]: false,
      });
    } else {
      setErrors({
        ...errors,
        [name]: true,
      });
    }
    setDataForm({ ...dataForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      errors.cedula === false &&
      errors.name === false &&
      errors.email === false &&
      errors.password === false &&
      errors.conf_password === false &&
      dataForm.rol !== null
    ) {
      if (dataForm.password === dataForm.conf_password) {
        const { conf_password, ...user } = dataForm;
        sendUser(user);
      } else {
        AlertError('Las contraseñas no coinciden');
      }
    } else {
      AlertError('El formulario contiene errores o campos vacios');
    }
  };

  // function - create user
  const sendUser = async (user) => {
    AlertCharging();
    const res = await FetchTokenized('user/new', token, user, 'POST');
    const body = await res.json();
    Swal.close();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    if (body.message === 'password length must be at least 6 characters long') {
      AlertError('La contraseña debe tener minimo 6 caracteres');
    }
    if (body.message === 'email must be a valid email') {
      AlertError('Correo invalido');
    }
    if (body.msg === 'user exitente en BD') {
      AlertError('Este usuario ya existe, use otro correo o cedula');
    }
    if (body.msg === 'Registro exitoso') {
      AlertSuccess('Usuario registrado exitosamente');
      setDataForm(initialData);
    }
  };

  return (
    <PageContainer title="SPID | Crear usuario">
      {/* breadcrumb */}
      <Breadcrumb title="Formulario de registro" items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        <CardContent
          sx={{
            padding: '30px',
          }}
        >
          <form onSubmit={handleSubmit} id="form-create-user">
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
                type="number"
                id="cedula"
                name="cedula"
                placeholder="cedula"
                fullWidth
                size="small"
                value={dataForm.cedula}
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
              <CustomFormLabel htmlFor="name">Nombre</CustomFormLabel>
              <TextField
                id="name"
                name="name"
                placeholder="Nombre"
                fullWidth
                size="small"
                value={dataForm.name}
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
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                fullWidth
                size="small"
                value={dataForm.email}
                onChange={handleChange}
                required
                error={errors.email}
                helperText={errors.email ? 'El correo no es valido' : null}
              />
            </FormControl>
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="ies">IES</CustomFormLabel>
              <TextField id="ies" name="ies" value={Ies} fullWidth size="small" disabled required />
            </FormControl>
            <CustomFormLabel htmlFor="rol">Rol</CustomFormLabel>
            <CustomSelect
              id="rol"
              name="rol"
              value={dataForm.rol === '' ? roles[0].value : dataForm.rol}
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
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="password">Contraseña</CustomFormLabel>
              <TextField
                type="password"
                id="password"
                name="password"
                placeholder="Contraseña"
                fullWidth
                size="small"
                value={dataForm.password}
                onChange={handleChange}
                required
                error={errors.password}
                helperText={errors.password ? 'La contraseña debe tener mas de 6 digitos' : null}
              />
            </FormControl>
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="conf_password">Confirmar Contraseña</CustomFormLabel>
              <TextField
                type="password"
                id="conf_password"
                name="conf_password"
                placeholder="Confirmar Contraseña"
                fullWidth
                size="small"
                value={dataForm.conf_password}
                onChange={handlePass}
                required
                error={errors.conf_password}
                helperText={errors.conf_password ? 'Las contraseñas no coinciden' : null}
              />
            </FormControl>
            <Box pt={3}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                sx={{
                  mr: 1,
                }}
              >
                Registrar
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default CreateUser;

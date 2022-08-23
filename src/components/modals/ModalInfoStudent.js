/* eslint-disable no-restricted-globals */
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
import { useSelector } from 'react-redux';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
// iconos
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import { AlertCharging, AlertError, AlertSuccess } from '../SweetAlerts/Alerts';
import { FetchTokenized } from '../../services/Fetch';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalInfoStudent({ dataStudent, open, handleClose }) {
  const { ies: Ies } = useSelector((state) => state.view);
  let fuldate = ''

  if (open) {
    const date = new Date(dataStudent.fecha_de_nacimiento);
    console.log(date);
    const year = date.getFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();

    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    fuldate = `${year}-${month}-${day}`;
  }

  return (
    <div>
      <Dialog
        sx={{ width: { sm: '100%' } }}
        open={open}
        fullScreen={screen.width < 600}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ fontSize: '1.5em' }}>Informacion Completa</DialogTitle>
        <DialogContent>
          <form>
            {/* COORPORACION (IES) */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="ies">IES</CustomFormLabel>
              <OutlinedInput
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="book" width="20" />
                  </InputAdornment>
                }
                id="ies"
                name="ies"
                value={Ies}
                fullWidth
                size="small"
                disabled
                required
              />
            </FormControl>
            {/* INSTITUCION (IED) */}
            <CustomFormLabel htmlFor="ied">IED</CustomFormLabel>
            <FormControl fullWidth>
              <OutlinedInput
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <AccountBalanceOutlinedIcon />
                  </InputAdornment>
                }
                id="ied"
                name="ied"
                placeholder="ied"
                fullWidth
                size="small"
                value={dataStudent && dataStudent.ied}
                required
                disabled
              />
            </FormControl>
            {/* IDENTIFICACION */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="identificacion">Identificacion</CustomFormLabel>
              <OutlinedInput
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="credit-card" width="20" />
                  </InputAdornment>
                }
                value={dataStudent && dataStudent.identificacion}
                id="identificacion"
                name="identificacion"
                placeholder="1234567890"
                fullWidth
                size="small"
                required
                disabled
              />
            </FormControl>
            {/* NOMBRE COMPLETO */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="nombre_completo">Nombre Completo</CustomFormLabel>
              <OutlinedInput
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="user" width="20" />
                  </InputAdornment>
                }
                value={dataStudent && dataStudent.nombre_completo}
                id="nombre_completo"
                name="nombre_completo"
                placeholder="Nombre completo"
                fullWidth
                size="small"
                required
                disabled
              />
            </FormControl>
            {/* CODIGO DEL PROGRAMA */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="codigo_programa">Codigo del programa</CustomFormLabel>
              <OutlinedInput
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="hash" width="20" />
                  </InputAdornment>
                }
                value={dataStudent && dataStudent.codigo_programa}
                id="codigo_programa"
                name="codigo_programa"
                fullWidth
                size="small"
                disabled
                required
              />
            </FormControl>
            {/* PROGRAMA ACADEMICO */}
            <CustomFormLabel htmlFor="programa_academico">Programa Academico</CustomFormLabel>
            <FormControl fullWidth>
              <OutlinedInput
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <SchoolOutlinedIcon />
                  </InputAdornment>
                }
                id="programa_academico"
                name="programa_academico"
                placeholder="Programa academico"
                fullWidth
                size="small"
                value={dataStudent && dataStudent.programa_academico}
                disabled
                required
              />
            </FormControl>
            {/* GRUPO */}
            <CustomFormLabel htmlFor="grupo">Grupo</CustomFormLabel>
            <FormControl fullWidth>
              <OutlinedInput
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <SchoolOutlinedIcon />
                  </InputAdornment>
                }
                id="grupo"
                name="grupo"
                placeholder="Grupo"
                fullWidth
                size="small"
                value={dataStudent && dataStudent.grupo}
                disabled
                required
              />
            </FormControl>
            {/* ESTADO DEL ESTUDIANTE */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="estado_de_estudiante">
                Estado del Estudiante
              </CustomFormLabel>
              <OutlinedInput
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="user" width="20" />
                  </InputAdornment>
                }
                value={dataStudent && dataStudent.estado_de_estudiante}
                id="estado_de_estudiante"
                name="estado_de_estudiante"
                placeholder="Matriculado, Desertor,...."
                fullWidth
                size="small"
                required
                disabled
              />
            </FormControl>
            {/* PERIODO DE INGRESO */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="periodo_de_ingreso">Periodo de ingreso</CustomFormLabel>
              <OutlinedInput
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="user" width="20" />
                  </InputAdornment>
                }
                value={dataStudent && dataStudent.periodo_de_ingreso}
                id="periodo_de_ingreso"
                name="periodo_de_ingreso"
                placeholder="20221"
                fullWidth
                size="small"
                required
                disabled
              />
            </FormControl>
            {/* NIVEL */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="nivel">Nivel</CustomFormLabel>
              <OutlinedInput
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="user" width="20" />
                  </InputAdornment>
                }
                value={dataStudent && dataStudent.nivel}
                id="nivel"
                name="nivel"
                placeholder="1,2,3,..."
                fullWidth
                size="small"
                required
                disabled
              />
            </FormControl>
            {/* NUMERO DE CELULAR */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="n_de_celular">Numero de celular</CustomFormLabel>
              <OutlinedInput
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="user" width="20" />
                  </InputAdornment>
                }
                value={dataStudent && dataStudent.n_de_celular}
                id="n_de_celular"
                name="n_de_celular"
                placeholder="1234567890"
                fullWidth
                size="small"
                required
                disabled
              />
            </FormControl>
            {/* NUMERO DE TELEFONO */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="n_de_telefono">Numero de telefono</CustomFormLabel>
              <OutlinedInput
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="user" width="20" />
                  </InputAdornment>
                }
                value={dataStudent && dataStudent.n_de_telefono}
                id="n_de_telefono"
                name="n_de_telefono"
                placeholder="1234567"
                fullWidth
                size="small"
                required
                disabled
              />
            </FormControl>
            {/* FECHA DE NACIMIENTO */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="fecha_de_nacimiento">Fecha de nacimiento</CustomFormLabel>
              <OutlinedInput
                value={fuldate}
                type="date"
                id="fecha_de_nacimiento"
                name="fecha_de_nacimiento"
                placeholder="1234567"
                fullWidth
                size="small"
                required
                disabled
              />
            </FormControl>
            {/* LUGAR DE RESIDENCIA */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="n_de_telefono">Lugar de residencia</CustomFormLabel>
              <OutlinedInput
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="user" width="20" />
                  </InputAdornment>
                }
                value={dataStudent && dataStudent.lugar_de_recidencia}
                id="lugar_de_recidencia"
                name="lugar_de_recidencia"
                placeholder="Barranquilla - Atlantico - (Colombia)"
                fullWidth
                size="small"
                required
                disabled
              />
            </FormControl>
            {/* DIRECCION DE RESIDENCIA */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="direccion">Direccion de residencia</CustomFormLabel>
              <OutlinedInput
                type="text"
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="user" width="20" />
                  </InputAdornment>
                }
                value={dataStudent && dataStudent.direccion}
                id="direccion"
                name="direccion"
                placeholder="calle 00 # 00-00 (apto, casa,....)"
                fullWidth
                size="small"
                required
                disabled
              />
            </FormControl>
            {/* CORREO ELECTRONICO INSTITUCIONAL */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="correo_electronico_institucional">
                Correo electronico institucional
              </CustomFormLabel>
              <OutlinedInput
                type="email"
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="user" width="20" />
                  </InputAdornment>
                }
                value={dataStudent && dataStudent.correo_electronico_institucional}
                id="correo_electronico_institucional"
                name="correo_electronico_institucional"
                placeholder="ejemplo@corporacion.edu.co"
                fullWidth
                size="small"
                required
                disabled
              />
            </FormControl>
            {/* CORREO ELECTRONICO PERSONAL */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="correo_electronico_personal">
                Correo electronico personal
              </CustomFormLabel>
              <OutlinedInput
                type="email"
                endAdornment={
                  <InputAdornment position="end">
                    <FeatherIcon icon="user" width="20" />
                  </InputAdornment>
                }
                value={dataStudent && dataStudent.correo_electronico_personal}
                id="correo_electronico_personal"
                name="correo_electronico_personal"
                placeholder="ejemplo@gmail.com"
                fullWidth
                size="small"
                required
                disabled
              />
            </FormControl>
          </form>
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

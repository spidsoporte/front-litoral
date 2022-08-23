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
import { useDispatch, useSelector } from 'react-redux';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
// iconos
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ReplayIcon from '@mui/icons-material/Replay';

import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import { AlertCharging, AlertError, AlertSuccess } from '../SweetAlerts/Alerts';
import { FetchTokenized } from '../../services/Fetch';
import CustomRadio from '../forms/custom-elements/CustomRadio';
import { logout } from '../../redux/auth/Action';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalEditUser({ dataStudent, open, handleClose, listStudents }) {
  const { token } = useSelector((state) => state.auth.user);
  const { ies: Ies } = useSelector((state) => state.view);

  const [dataForm, setDataForm] = React.useState({});

  React.useEffect(() => {
    init(dataStudent);
  }, [open]);

  const init = (dataStuden) => {
    const date = new Date(dataStudent.fecha_de_nacimiento);

    const year = date.getFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    
    if (month < 10){
      month = `0${month}`
    }
    if (day < 10){
      day = `0${day}`
    }
    const fuldate = `${year}-${month}-${day}`
    
    setDataForm({...dataStuden, fecha_de_nacimiento: fuldate});
  };

  const [institutions, setInstitutions] = React.useState([]);
  const [programs, setPrograms] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
  // Estados de selects
  const [newInstitution, setNewInstitution] = React.useState(false);
  const [newProgram, setNewProgram] = React.useState(false);
  const [newGroup, setNewGroup] = React.useState(false);
  const dispatch = useDispatch();

  const [errors, setErrors] = React.useState({});
  const expressions = {
    ied: /^[a-zA-ZÀ-ÿ\s]{1,}$/,
    identificacion: /^\d{7,10}$/,
    nombre_completo: /^[a-zA-ZÀ-ÿ\s]{1,}$/,
    codigo_programa: /^[a-zA-Z0-9\s_.+-]{1,}$/,
    programa_academico: /^[a-zA-ZÀ-ÿ\s()]{1,}$/,
    grupo: /^[\w\s_-]{1,}$/,
    periodo_de_ingreso: /^\d{1,}$/,
    nivel: /^\d{1,2}$/,
    n_de_celular: /^\d{10}$/,
    n_de_telefono: /^\d{7,10}$/,
    lugar_de_recidencia: /^[a-zA-Z\s()-]{1,}$/,
    direccion: /^[a-zA-Z\s\d#°()-.,]{1,}$/,
    correo_electronico_institucional: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{1,}$/,
    correo_electronico_personal: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{1,}$/,
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

  const handleInstitution = async () => {
    const data = {
      ies: Ies,
    };
    const res = await FetchTokenized('student/filter-institutions', token, data, 'POST');
    const body = await res.json();
    if (body.statusCode === 200) {
      const insti = body.Institutions;
      for (let i = 0; i < insti.length; i++) {
        // eslint-disable-next-line no-shadow
        setInstitutions((institutions) => [...institutions, { value: insti[i], label: insti[i] }]);
      }
    }

    if (body.statusCode === 410){
      AlertError('Error de estructura, contactarse con soporte')
    }
  };

  React.useEffect(() => {
    handleInstitution();
  }, [open]);

  const handleProgram = async () => {
    const data = {
      ies: Ies,
      ied: dataForm.ied,
    };
    const res = await FetchTokenized('student/filter-programs', token, data, 'POST');
    const body = await res.json();
    const pro = body.programs;
    for (let i = 0; i < pro.length; i++) {
      // eslint-disable-next-line no-shadow
      setPrograms((programs) => [...programs, { value: pro[i], label: pro[i] }]);
    }
  };

  const handleProgramCode = async (value) => {
    const data = { programa_academico: value };
    const res = await FetchTokenized('student/filter-programs-codigo', token, data, 'POST');
    const body = await res.json();
    setDataForm({
      ...dataForm,
      codigo_programa: body.codigo_programa[0],
      programa_academico: value,
    });
  };

  // eslint-disable-next-line no-unused-vars
  const handleGroup = async () => {
    const data = {
      ies: Ies,
      ied: dataForm.ied,
      programa_academico: dataForm.programa_academico,
    };
    const res = await FetchTokenized('student/filter-groups', token, data, 'POST');
    const body = await res.json();
    const grou = body.groups;
    for (let i = 0; i < grou.length; i++) {
      // eslint-disable-next-line no-shadow
      setGroups((groups) => [...groups, { value: grou[i], label: grou[i] }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const keys = Object.keys(errors);
    let error = false;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (errors[key] === false) {
        error = false;
      } else {
        error = true;
        break;
      }
    }
    if (error === false) {
      handleClose();
      AlertCharging();
      // eslint-disable-next-line camelcase
      const { uid, edad, count_day, status, createdAt, updatedAt, ...data } = dataForm;
      // eslint-disable-next-line prefer-template
      const url = 'student/update/' + uid;
      const res = await FetchTokenized(url, token, data, 'PUT');
      const body = await res.json();
      Swal.close();
      if (body.statusCode === 401) {
        dispatch(logout());
      }
      if (body.message === 'email must be a valid email') {
        AlertError('Correo invalido');
      }

      if (body.msg === 'email exitente') {
        AlertError('Este correo ya esta siendo usado por otro usuario');
      }

      if (body.msg === 'successful update') {
        AlertSuccess('Usuario actualizado exitosamente');
        setTimeout(() => {
          listStudents();
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
            {/* COORPORACION (IES) */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="ies">IES</CustomFormLabel>
              <TextField id="ies" name="ies" value={Ies} fullWidth size="small" disabled required />
            </FormControl>
            {/* INSTITUCION (IED) */}
            <CustomFormLabel htmlFor="ied">IED</CustomFormLabel>
            <Box display="flex">
              {!newInstitution ? (
                <>
                  <FormControl fullWidth>
                    <TextField
                      type="text"
                      id="ied"
                      name="ied"
                      placeholder="ied"
                      fullWidth
                      size="small"
                      value={dataForm.ied}
                      onChange={handleChange}
                      required
                      disabled
                    />
                  </FormControl>
                  <IconButton
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setNewInstitution(true);
                    }}
                  >
                    <AutorenewIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <FormControl fullWidth size="small">
                    <Select
                      id="ied"
                      name="ied"
                      fullWidth
                      value={dataForm.ied}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                            overflow: 'auto',
                          },
                        },
                      }}
                      onChange={(e) => {
                        handleChange(e);
                        setPrograms([])
                        handleProgram();
                      }}
                      onFocus={() => {
                        setInstitutions([]);
                        handleInstitution();
                      }}
                      onBlur={() => {
                        setInstitutions([]);
                        handleInstitution();
                      }}
                      onClick={() => setInstitutions([])}
                      required
                    >
                      {institutions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setNewInstitution(false);
                    }}
                  >
                    <ReplayIcon />
                  </IconButton>
                </>
              )}
            </Box>
            {/* IDENTIFICACION */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="identificacion">Identificacion</CustomFormLabel>
              <TextField
                type="text"
                value={dataForm.identificacion}
                id="identificacion"
                name="identificacion"
                placeholder="1234567890"
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.identificacion}
                helperText={
                  errors.identificacion
                    ? 'El campo debe tener de 7 a 10 numeros enteros y positivos'
                    : null
                }
              />
            </FormControl>
            {/* NOMBRE COMPLETO */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="nombre_completo">Nombre Completo</CustomFormLabel>
              <TextField
                type="text"
                value={dataForm.nombre_completo}
                id="nombre_completo"
                name="nombre_completo"
                placeholder="Nombre completo"
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.nombre_completo}
                helperText={
                  errors.nombre_completo
                    ? 'El campo no permite numeros o caracteres especiales, solo acentos'
                    : null
                }
              />
            </FormControl>
            {/* CODIGO DEL PROGRAMA */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="codigo_programa">Codigo del programa</CustomFormLabel>
              <TextField
                value={dataForm.codigo_programa}
                id="codigo_programa"
                name="codigo_programa"
                placeholder={!newProgram ? 'Se genera automaticamente' : 'Digite un nuevo codigo'}
                fullWidth
                size="small"
                disabled
                required
              />
            </FormControl>
            {/* PROGRAMA ACADEMICO */}
            <CustomFormLabel htmlFor="programa_academico">Programa Academico</CustomFormLabel>
            <Box display="flex">
              {!newProgram ? (
                <>
                  <FormControl fullWidth>
                    <TextField
                      type="text"
                      id="programa_academico"
                      name="programa_academico"
                      placeholder="Programa academico"
                      fullWidth
                      size="small"
                      value={dataForm.programa_academico}
                      disabled
                      required
                      error={errors.programa_academico}
                      helperText={
                        errors.programa_academico
                          ? 'Este campo no permite numero acentos o caracteres especiales'
                          : null
                      }
                    />
                  </FormControl>
                  <IconButton
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setNewProgram(true);
                    }}
                  >
                    <AutorenewIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <FormControl fullWidth size="small">
                    <InputLabel id="programa_academico">Programa academico</InputLabel>
                    <Select
                      labelId="programa_academico"
                      id="programa_academico"
                      name="programa_academico"
                      fullWidth
                      value={dataForm.programa_academico}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                            overflow: 'auto',
                          },
                        },
                      }}
                      onChange={(e) => {
                        handleChange(e);
                        setGroups([])
                        handleProgramCode(e.target.value);
                        handleGroup();
                      }}
                      onFocus={() => {
                        setPrograms([]);
                        handleProgram();
                      }}
                      onBlur={() => {
                        setPrograms([]);
                        handleProgram();
                      }}
                      onClick={() => setPrograms([])}
                      required
                      input={<OutlinedInput label="Programa academico" />}
                    >
                      {programs.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <IconButton
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setNewProgram(false);
                    }}
                  >
                    <ReplayIcon />
                  </IconButton>
                </>
              )}
            </Box>
            {/* GRUPO */}
            <CustomFormLabel htmlFor="grupo">Grupo</CustomFormLabel>
            <Box display="flex">
              {!newGroup ? (
                <>
                  <FormControl fullWidth>
                    <TextField
                      type="text"
                      id="grupo"
                      name="grupo"
                      placeholder="Grupo"
                      fullWidth
                      size="small"
                      value={dataForm.grupo}
                      disabled
                      required
                      error={errors.grupo}
                      helperText={
                        errors.grupo
                          ? 'El campo no permite caracteres especiales, excepto guiones'
                          : null
                      }
                    />
                  </FormControl>
                  <IconButton
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setNewGroup(true);
                    }}
                  >
                    <AutorenewIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <FormControl fullWidth size="small">
                    <InputLabel id="grupo">Grupo</InputLabel>
                    <Select
                      labelId="grupo"
                      id="grupo"
                      name="grupo"
                      fullWidth
                      value={dataForm.grupo}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                            overflow: 'auto',
                          },
                        },
                      }}
                      onChange={handleChange}
                      onFocus={() => {
                        setGroups([]);
                        handleGroup();
                      }}
                      onBlur={() => {
                        setGroups([]);
                        handleGroup();
                      }}
                      onClick={() => setGroups([])}
                      required
                      input={<OutlinedInput label="Grupo" />}
                    >
                      {groups.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <IconButton
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setNewGroup(false);
                    }}
                  >
                    <ReplayIcon />
                  </IconButton>
                </>
              )}
            </Box>
            {/* ESTADO DEL ESTUDIANTE */}
            <CustomFormLabel htmlFor="estado_de_estudiante">Estado del estudiante</CustomFormLabel>
            <FormControl component="fieldset">
              <RadioGroup
                name="estado_de_estudiante"
                value={dataForm.estado_de_estudiante ? dataForm.estado_de_estudiante : ''}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="Matriculado"
                  control={<CustomRadio />}
                  label="Matriculado"
                />
                <FormControlLabel value="Desertor" control={<CustomRadio />} label="Desertor" />
              </RadioGroup>
            </FormControl>
            {/* PERIODO DE INGRESO */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="periodo_de_ingreso">Periodo de ingreso</CustomFormLabel>
              <TextField
                type="text"
                value={dataForm.periodo_de_ingreso}
                id="periodo_de_ingreso"
                name="periodo_de_ingreso"
                placeholder="20221"
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.periodo_de_ingreso}
                helperText={
                  errors.periodo_de_ingreso ? 'El campo solo permite numeros y guiones' : null
                }
              />
            </FormControl>
            {/* NIVEL */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="nivel">Nivel</CustomFormLabel>
              <TextField
                type="text"
                value={dataForm.nivel}
                id="nivel"
                name="nivel"
                placeholder="1,2,3,..."
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.nivel}
                helperText={
                  errors.nivel ? 'El campo solo permite entre 1 y 2 numeros positivos ' : null
                }
              />
            </FormControl>
            {/* NUMERO DE CELULAR */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="n_de_celular">Numero de celular</CustomFormLabel>
              <TextField
                type="text"
                value={dataForm.n_de_celular}
                id="n_de_celular"
                name="n_de_celular"
                placeholder="1234567890"
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.n_de_celular}
                helperText={errors.n_de_celular ? 'El campo debe tener 10 digitos' : null}
              />
            </FormControl>
            {/* NUMERO DE TELEFONO */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="n_de_telefono">Numero de telefono</CustomFormLabel>
              <TextField
                type="text"
                value={dataForm.n_de_telefono}
                id="n_de_telefono"
                name="n_de_telefono"
                placeholder="1234567"
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.n_de_telefono}
                helperText={
                  errors.n_de_telefono ? 'El campo debe tener entre 7 y 10 digitos' : null
                }
              />
            </FormControl>
            {/* FECHA DE NACIMIENTO */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="fecha_de_nacimiento">Fecha de nacimiento</CustomFormLabel>
              <TextField
                value={dataForm.fecha_de_nacimiento}
                type="date"
                id="fecha_de_nacimiento"
                name="fecha_de_nacimiento"
                placeholder="1234567"
                fullWidth
                size="small"
                onChange={handleChange}
                required
              />
            </FormControl>
            {/* LUGAR DE RESIDENCIA */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="n_de_telefono">Lugar de residencia</CustomFormLabel>
              <TextField
                type="text"
                value={dataForm.lugar_de_recidencia}
                id="lugar_de_recidencia"
                name="lugar_de_recidencia"
                placeholder="Barranquilla - Atlantico - (Colombia)"
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.lugar_de_recidencia}
                helperText={
                  errors.lugar_de_recidencia ? 'El campo solo permite guiones y parentesis' : null
                }
              />
            </FormControl>
            {/* DIRECCION DE RESIDENCIA */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="direccion">Direccion de residencia</CustomFormLabel>
              <TextField
                type="text"
                value={dataForm.direccion}
                id="direccion"
                name="direccion"
                placeholder="calle 00 # 00-00 (apto, casa,....)"
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.direccion}
                helperText={
                  errors.direccion ? 'El campo solo permite acentos guiones y parentesis' : null
                }
              />
            </FormControl>
            {/* CORREO ELECTRONICO INSTITUCIONAL */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="correo_electronico_institucional">
                Correo electronico institucional
              </CustomFormLabel>
              <TextField
                type="email"
                value={dataForm.correo_electronico_institucional}
                id="correo_electronico_institucional"
                name="correo_electronico_institucional"
                placeholder="ejemplo@corporacion.edu.co"
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.correo_electronico_institucional}
                helperText={
                  errors.correo_electronico_institucional ? 'El correo no es valido' : null
                }
              />
            </FormControl>
            {/* CORREO ELECTRONICO PERSONAL */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="correo_electronico_personal">
                Correo electronico personal
              </CustomFormLabel>
              <TextField
                type="email"
                value={dataForm.correo_electronico_personal}
                id="correo_electronico_personal"
                name="correo_electronico_personal"
                placeholder="ejemplo@gmail.com"
                fullWidth
                size="small"
                onChange={handleChange}
                required
                error={errors.correo_electronico_personal}
                helperText={errors.correo_electronico_personal ? 'El correo no es valido' : null}
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
                Actualizar
              </Button>
            </Box>
          </form>
        </DialogContent>
        <DialogActions sx={{ margin: '5px' }}>
          <Button onClick={handleClose} color="danger">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

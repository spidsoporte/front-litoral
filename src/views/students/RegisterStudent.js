/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Button,
  FormControl,
  OutlinedInput,
  MenuItem,
  IconButton,
  Select,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  TextField,
} from '@mui/material';
// iconos
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Swal from 'sweetalert2';

import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import { FetchTokenized } from '../../services/Fetch';
import CustomRadio from '../../components/forms/custom-elements/CustomRadio';
import { AlertCharging, AlertError, AlertSuccess } from '../../components/SweetAlerts/Alerts';
import { logout } from '../../redux/auth/Action';

const BCrumb = [
  {
    title: 'Estudiantes',
  },
  {
    title: 'Registrar Estudiante',
  },
];

const RegisterStudent = () => {
  const { token } = useSelector((state) => state.auth.user);
  const { ies: Ies } = useSelector((state) => state.view);
  const initialData = { ies: Ies };

  const [dataForm, setDataForm] = useState(initialData);
  const [institutions, setInstitutions] = React.useState([]);
  const [programs, setPrograms] = React.useState([]);
  const [groups, setGroups] = React.useState([]);
  // Estados de selects
  const [newInstitution, setNewInstitution] = React.useState(false);
  const [newProgram, setNewProgram] = React.useState(false);
  const [newGroup, setNewGroup] = React.useState(false);
  const dispatch = useDispatch()

  const [errors, setErrors] = useState({});
  const expressions = {
    ied: /^[a-zA-ZÀ-ÿ\s]{1,}$/,
    identificacion: /^\d{7,10}$/,
    nombre_completo: /^[a-zA-ZÀ-ÿ\s]{1,}$/,
    codigo_programa: /^[a-zA-Z0-9\s_.+-]{1,}$/,
    programa_academico: /^[a-zA-ZÀ-ÿ\s()]{1,}$/,
    grupo: /^[\w\s_-]{1,}$/,
    periodo_de_ingreso: /^[\d-]{1,}$/,
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
    setInstitutions([]);
    const res = await FetchTokenized('student/filter-institutions', token, dataForm, 'POST');
    const body = await res.json();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    if (body.statusCode === 200) {
      const insti = body.Institutions;
      for (let i = 0; i < insti.length; i++) {
        // eslint-disable-next-line no-shadow
        setInstitutions((institutions) => [...institutions, { value: insti[i], label: insti[i] }]);
      }
    }
  };

  const handleProgram = async (value) => {
    const data = {
      ies: dataForm.ies,
      ied: value,
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
  const handleGroup = async (value) => {
    const data = {
      ies: dataForm.ies,
      ied: dataForm.ied,
      programa_academico: value,
    };
    const res = await FetchTokenized('student/filter-groups', token, data, 'POST');
    const body = await res.json();
    const grou = body.groups;
    console.log(groups);
    for (let i = 0; i < grou.length; i++) {
      // eslint-disable-next-line no-shadow
      setGroups((groups) => [...groups, { value: grou[i], label: grou[i] }]);
    }
  };

  React.useEffect(() => {
    handleInstitution();
  }, []);

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
      AlertCharging();
      const res = await FetchTokenized('student/add', token, dataForm, 'POST');
      const body = await res.json();
      Swal.close();
      if (body.msg === 'Registro exitoso') {
        AlertSuccess('Estudiante Registrado exitosamente');
        setDataForm(initialData);
      }
      if (body.msg === 'This student already exists in the db') {
        AlertError('Esta cedula o correo ya existe');
      }
    } else {
      AlertError('Lo sentimos. El formulario contiene errores o campos vacios');
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
            padding: {
              lg: '30px',
            },
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* COORPORACION (IES) */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="ies">IES</CustomFormLabel>
              <TextField
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
            <Box display="flex">
              {newInstitution ? (
                <>
                  <FormControl fullWidth>
                    <TextField
                      type="text"
                      id="ied"
                      name="ied"
                      placeholder="ied"
                      fullWidth
                      size="small"
                      value={dataForm.ied ? dataForm.ied : ''}
                      onChange={handleChange}
                      required
                      error={errors.ied}
                      helperText={
                        errors.ied
                          ? 'Este campo no permite numero acentos o caracteres especiales'
                          : null
                      }
                    />
                  </FormControl>
                  <IconButton
                    color="danger"
                    variant="contained"
                    onClick={() => {
                      delete dataForm.ied;
                      setNewInstitution(false);
                    }}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <FormControl fullWidth size="small">
                    <InputLabel id="ied">IED</InputLabel>
                    <Select
                      labelId="ied"
                      id="ied"
                      name="ied"
                      fullWidth
                      value={dataForm.ied ? dataForm.ied : ''}
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
                        handleProgram(e.target.value);
                      }}
                      input={<OutlinedInput label="IED" />}
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
                      delete dataForm.ied;
                      setPrograms([]);
                      setNewInstitution(true);
                    }}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </>
              )}
            </Box>
            {/* IDENTIFICACION */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="identificacion">Identificacion</CustomFormLabel>
              <TextField
                type="number"
                id="identificacion"
                name="identificacion"
                placeholder="1234567890"
                fullWidth
                size="small"
                value={dataForm.identificacion ? dataForm.identificacion : ''}
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
                id="nombre_completo"
                name="nombre_completo"
                placeholder="Nombre completo"
                fullWidth
                size="small"
                value={dataForm.nombre_completo ? dataForm.nombre_completo : ''}
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
                id="codigo_programa"
                name="codigo_programa"
                value={dataForm.codigo_programa ? dataForm.codigo_programa : ''}
                placeholder={!newProgram ? 'Se genera automaticamente' : 'Digite un nuevo codigo'}
                fullWidth
                size="small"
                disabled={!newProgram}
                onChange={handleChange}
                required
                error={errors.codigo_programa}
                helperText={errors.codigo_programa ? 'aaaa' : null}
              />
            </FormControl>
            {/* PROGRAMA ACADEMICO */}
            <CustomFormLabel htmlFor="programa_academico">Programa Academico</CustomFormLabel>
            <Box display="flex">
              {newProgram ? (
                <>
                  <FormControl fullWidth>
                    <TextField
                      type="text"
                      id="programa_academico"
                      name="programa_academico"
                      placeholder="Programa academico"
                      fullWidth
                      size="small"
                      value={dataForm.programa_academico ? dataForm.programa_academico : ''}
                      onChange={handleChange}
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
                    color="danger"
                    variant="contained"
                    onClick={() => {
                      delete dataForm.programa_academico;
                      if (dataForm.codigo_programa) {
                        dataForm.codigo_programa = '';
                      }
                      setNewProgram(false);
                    }}
                  >
                    <RemoveCircleOutlineIcon />
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
                      value={dataForm.programa_academico ? dataForm.programa_academico : ''}
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
                        handleGroup(e.target.value);
                      }}
                      required
                      disabled={!dataForm.ied}
                      input={<OutlinedInput label="Programa academico" />}
                    >
                      {programs.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                      {programs.length === 0 && (
                        <MenuItem value={null}>No hay programas para esta institutcion</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <IconButton
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      delete dataForm.programa_academico;
                      if (dataForm.codigo_programa) {
                        dataForm.codigo_programa = '';
                      }
                      setNewProgram(true);
                      setGroups([]);
                    }}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </>
              )}
            </Box>
            {/* GRUPO */}
            <CustomFormLabel htmlFor="grupo">Grupo</CustomFormLabel>
            <Box display="flex">
              {newGroup ? (
                <>
                  <FormControl fullWidth>
                    <TextField
                      type="text"
                      id="grupo"
                      name="grupo"
                      placeholder="Grupo"
                      fullWidth
                      size="small"
                      value={dataForm.grupo ? dataForm.grupo : ''}
                      onChange={handleChange}
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
                    color="danger"
                    variant="contained"
                    onClick={() => {
                      delete dataForm.grupo;
                      setNewGroup(false);
                    }}
                  >
                    <RemoveCircleOutlineIcon />
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
                      value={dataForm.grupo ? dataForm.grupo : ''}
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
                      disabled={!dataForm.programa_academico}
                      input={<OutlinedInput label="Grupo" />}
                    >
                      {groups.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                      {groups.length === 0 && (
                        <MenuItem value={null}>No hay grupos para este programa</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                  <IconButton
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      delete dataForm.grupo;
                      setNewGroup(true);
                    }}
                  >
                    <AddCircleOutlineIcon />
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
              </RadioGroup>
            </FormControl>
            {/* PERIODO DE INGRESO */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="periodo_de_ingreso">Periodo de ingreso</CustomFormLabel>
              <TextField
                type="number"
                id="periodo_de_ingreso"
                name="periodo_de_ingreso"
                placeholder="20221"
                fullWidth
                size="small"
                value={dataForm.periodo_de_ingreso ? dataForm.periodo_de_ingreso : ''}
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
                inputProps={{ min: 1, max: 99 }}
                type="number"
                id="nivel"
                name="nivel"
                placeholder="1,2,3,..."
                fullWidth
                size="small"
                value={dataForm.nivel ? dataForm.nivel : ''}
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
                type="number"
                id="n_de_celular"
                name="n_de_celular"
                placeholder="1234567890"
                fullWidth
                size="small"
                value={dataForm.n_de_celular ? dataForm.n_de_celular : ''}
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
                type="number"
                id="n_de_telefono"
                name="n_de_telefono"
                placeholder="1234567"
                fullWidth
                size="small"
                value={dataForm.n_de_telefono ? dataForm.n_de_telefono : ''}
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
                type="date"
                id="fecha_de_nacimiento"
                name="fecha_de_nacimiento"
                placeholder="1234567"
                fullWidth
                size="small"
                value={dataForm.fecha_de_nacimiento ? dataForm.fecha_de_nacimiento : ''}
                onChange={handleChange}
                required
              />
            </FormControl>
            {/* LUGAR DE RESIDENCIA */}
            <FormControl fullWidth>
              <CustomFormLabel htmlFor="n_de_telefono">Lugar de residencia</CustomFormLabel>
              <TextField
                type="text"
                id="lugar_de_recidencia"
                name="lugar_de_recidencia"
                placeholder="Barranquilla - Atlantico - (Colombia)"
                fullWidth
                size="small"
                value={dataForm.lugar_de_recidencia ? dataForm.lugar_de_recidencia : ''}
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
                id="direccion"
                name="direccion"
                placeholder="calle 00 # 00-00 (apto, casa,....)"
                fullWidth
                size="small"
                value={dataForm.direccion ? dataForm.direccion : ''}
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
                id="correo_electronico_institucional"
                name="correo_electronico_institucional"
                placeholder="ejemplo@corporacion.edu.co"
                fullWidth
                size="small"
                value={
                  dataForm.correo_electronico_institucional
                    ? dataForm.correo_electronico_institucional
                    : ''
                }
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
                id="correo_electronico_personal"
                name="correo_electronico_personal"
                placeholder="ejemplo@gmail.com"
                fullWidth
                size="small"
                value={
                  dataForm.correo_electronico_personal ? dataForm.correo_electronico_personal : ''
                }
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
                Registrar
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default RegisterStudent;

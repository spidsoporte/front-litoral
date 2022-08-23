/* eslint-disable prefer-template */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
} from '@mui/material';
import Swal from 'sweetalert2';
import SaveIcon from '@mui/icons-material/Save';
import { useDispatch, useSelector } from 'react-redux';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import { FetchTokenized } from '../../services/Fetch';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { AlertCharging, AlertError, AlertSuccess } from '../../components/SweetAlerts/Alerts';
import ModalUpdateAttendance from '../../components/modals/ModalUpdateAttendance';
import { logout } from '../../redux/auth/Action';

const BCrumb = [
  {
    title: 'Estudiantes',
  },
  {
    title: 'Asistencia',
  },
];

const initSelect = [
  {
    value: 0,
    label: 'Todos',
  },
];

const Attendance = () => {
  const { token } = useSelector((state) => state.auth.user);
  const { ies: IED } = useSelector((state) => state.auth.user.user);
  const [students, setStudents] = React.useState([]);
  const [dataSelects, setDataSelects] = React.useState({
    ies: IED,
  });
  const [institutions, setInstitutions] = React.useState(initSelect);
  const [programs, setPrograms] = React.useState(initSelect);
  const [groups, setGroups] = React.useState(initSelect);
  const [attendance, setAttendance] = React.useState([{}]);
  const [openUpdateAttendance, setOpenUpdateAttendance] = React.useState(false);
  const [time, setTime] = React.useState();
  const dispatch = useDispatch();

  // Date of today
  const date = new Date();

  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month < 10) {
    month = '0' + month;
  }

  if (day < 10) {
    day = '0' + day;
  }

  setTimeout(() => {
    let hour = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (hour < 10) {
      hour = '0' + hour;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    setTime(`${hour}:${minutes}:${seconds}`);
  }, 1000);

  const fulDate = `${day}-${month}-${year}`;

  const handleInstitution = async () => {
    const data = { ies: dataSelects.ies };
    const res = await FetchTokenized('student/filter-institutions', token, data, 'POST');
    const body = await res.json();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    const insti = body.Institutions;
    for (let i = 0; i < insti.length; i++) {
      // eslint-disable-next-line no-shadow
      setInstitutions((institutions) => [...institutions, { value: insti[i], label: insti[i] }]);
    }
  };
  const handleProgram = async () => {
    const data = { ies: dataSelects.ies, ied: dataSelects.institution };
    const res = await FetchTokenized('student/filter-programs', token, data, 'POST');
    const body = await res.json();
    const pro = body.programs;
    for (let i = 0; i < pro.length; i++) {
      // eslint-disable-next-line no-shadow
      setPrograms((programs) => [...programs, { value: pro[i], label: pro[i] }]);
    }
  };
  const handleGroup = async () => {
    const data = {
      ies: dataSelects.ies,
      ied: dataSelects.institution,
      programa_academico: dataSelects.program,
    };
    const res = await FetchTokenized('student/filter-groups', token, data, 'POST');
    const body = await res.json();
    const grou = body.groups;
    for (let i = 0; i < grou.length; i++) {
      // eslint-disable-next-line no-shadow
      setGroups((groups) => [...groups, { value: grou[i], label: grou[i] }]);
    }
  };

  const handleSubmit = async () => {
    setAttendance([{}]);
    const keys = Object.keys(dataSelects);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (dataSelects[key] === 0) {
        setDataSelects({ ...dataSelects, [key]: undefined });
      }
    }

    const data = {
      ies: dataSelects.ies,
      ied: dataSelects.institution,
      programa_academico: dataSelects.program,
      grupo: dataSelects.group,
    };

    const res = await FetchTokenized('student/filter-students', token, data, 'POST');
    const body = await res.json();
    const arrayOne = [];
    body.students.forEach((element) => {
      const object = {
        uid: element.uid,
        checked: true,
      };
      arrayOne.push(object);
    });
    setAttendance(arrayOne);
    setStudents(body.students);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === 0) {
      setDataSelects({ ...dataSelects, [name]: undefined });
    } else {
      setDataSelects({ ...dataSelects, [name]: value });
    }
  };

  const handleCheckbox = (index, value) => {
    const newState = JSON.parse(JSON.stringify(attendance));
    // newState.splice(index, 1, value);
    newState[index].checked = value;
    setAttendance(newState);
  };

  const handleSave = async () => {
    AlertCharging();
    const res = await FetchTokenized('student/absence', token, attendance, 'POST');
    const body = await res.json();
    if (body.msg === 'asistencia exitosa') {
      AlertSuccess('Asistencia registrada');
      setDataSelects({
        ies: IED,
      });
      setStudents([]);
    }
    if (body.msg === 'asistencia erronea') {
      AlertError('Esta asistencia ya ha sido registrada');
    }
  };

  const modalUpdateAttendance = () => {
    setOpenUpdateAttendance(true);
  };

  const handleClose = () => {
    setOpenUpdateAttendance(false);
  };

  return (
    <PageContainer title="SPID | Lista de asistencias">
      {/* breadcrumb */}
      <Breadcrumb title="Registro de asistencias" items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        <CardContent>
          <Box
            sx={{
              overflow: {
                xs: 'auto',
                sm: 'unset',
              },
            }}
          >
            <form>
              <CustomFormLabel htmlFor="institution">Institucion</CustomFormLabel>
              <CustomSelect
                id="institution"
                name="institution"
                value={dataSelects.institution ? dataSelects.institution : institutions[0].value}
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
                onFocus={() => {
                  setInstitutions(initSelect);
                  handleInstitution();
                }}
                onBlur={() => {
                  setInstitutions(initSelect);
                  handleInstitution();
                }}
                onClick={() => setInstitutions(initSelect)}
                onChange={handleChange}
              >
                {institutions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomSelect>
              <CustomFormLabel htmlFor="program">Programa</CustomFormLabel>
              <CustomSelect
                id="program"
                name="program"
                value={dataSelects.program ? dataSelects.program : programs[0].value}
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
                disabled={dataSelects.institution ? false : true}
                onFocus={() => {
                  setPrograms(initSelect);
                  handleProgram();
                }}
                onBlur={() => {
                  setPrograms(initSelect);
                  handleProgram();
                }}
                onClick={() => setPrograms(initSelect)}
                onChange={handleChange}
              >
                {programs.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomSelect>
              <CustomFormLabel htmlFor="group">Grupo</CustomFormLabel>
              <CustomSelect
                id="group"
                name="group"
                value={dataSelects.group ? dataSelects.group : groups[0].value}
                fullWidth
                variant="outlined"
                size="small"
                sx={{ maxHeight: '15em' }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      overflow: 'auto',
                    },
                  },
                }}
                disabled={dataSelects.program ? false : true}
                onFocus={() => {
                  setGroups(initSelect);
                  handleGroup();
                }}
                onBlur={() => {
                  setGroups(initSelect);
                  handleGroup();
                }}
                onClick={() => setGroups(initSelect)}
                onChange={handleChange}
              >
                {groups.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomSelect>
              <Box sx={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
                <Button
                  sx={{
                    marginRight: '5px',
                  }}
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={dataSelects.group ? false : true}
                >
                  Generar listado
                </Button>
                <Button
                  sx={{
                    marginLeft: '5px',
                  }}
                  variant="contained"
                  onClick={() => modalUpdateAttendance()}
                >
                  Corregir Asistencia
                </Button>
              </Box>
              <ModalUpdateAttendance open={openUpdateAttendance} handleClose={handleClose} />
            </form>
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Box
            sx={{
              overflow: {
                xs: 'auto',
                sm: 'unset',
              },
            }}
          >
            <Typography variant="h2" marginTop={4}>
              Lista de estudiantes
            </Typography>
            <Typography color="textSecondary">
              {fulDate} - {time}
            </Typography>
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
                      <Typography variant="h5">#</Typography>
                    </TableCell>
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
                  {students.map((student, i) => {
                    if (attendance[i]) {
                      return (
                        <TableRow key={student.uid}>
                          <TableCell>
                            <Typography>{i + 1}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{student.identificacion}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6" fontWeight="400">
                              {student.nombre_completo}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <CustomCheckbox
                              onChange={(e) => handleCheckbox(i, e.target.checked)}
                              checked={attendance[i].checked}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return null;
                  })}
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ marginTop: '20px' }}>
              <Button
                variant="contained"
                endIcon={<SaveIcon />}
                sx={{ display: 'flex', marginLeft: 'auto' }}
                onClick={handleSave}
                disabled={students.length === 0}
              >
                Guardar
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default Attendance;

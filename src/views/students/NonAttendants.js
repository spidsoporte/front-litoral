/* eslint-disable no-underscore-dangle */
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
  Avatar,
  Chip,
  IconButton,
  TableFooter,
  TablePagination,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import SendIcon from '@mui/icons-material/Send';
import { useDispatch, useSelector } from 'react-redux';
import TrafficIcon from '@mui/icons-material/Traffic';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import { FetchTokenized } from '../../services/Fetch';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import ModalCreateObservation from '../../components/modals/ModalCreateObservation';
import ModalViewObservations from '../../components/modals/ModalVIewObservations';
import ModalInfoStudent from '../../components/modals/ModalInfoStudent';
import ModalViewResults from '../../components/modals/ModalViewResults';
import { logout } from '../../redux/auth/Action';
import { AlertError } from '../../components/SweetAlerts/Alerts';


const BCrumb = [
  {
    title: 'Estudiantes',
  },
  {
    title: 'Inasistentes',
  },
];

const initSelect = [
  {
    value: 0,
    label: 'Todos',
  },
];

const NonAttendance = () => {
  const { token } = useSelector((state) => state.auth.user);
  const { ies: IED } = useSelector((state) => state.auth.user.user);
  const [students, setStudents] = React.useState([]);
  const [dataSelects, setDataSelects] = React.useState({
    ies: IED,
  });
  const [institutions, setInstitutions] = React.useState(initSelect);
  const [programs, setPrograms] = React.useState(initSelect);
  const [groups, setGroups] = React.useState(initSelect);
  const [trafficLight, setTrafficLight] = React.useState([
    ...initSelect,
    {
      value: 1,
      label: 'Verde',
    },
    {
      value: 2,
      label: 'Amarillo',
    },
    {
      value: 3,
      label: 'Rojo',
    },
    {
      value: 4,
      label: 'Desertor',
    },
  ]);
  // Pagination
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState();
  const [page, setPage] = React.useState(0);
  // props of modals
  const [uidStudent, setUidStudent] = React.useState();
  const [statusAttendance, setStatusAttendance] = React.useState();
  const [dataStudent, setDataStudent] = React.useState();
  const [openCreateObservation, setOpenCreateObservation] = React.useState(false);
  const [openViewObservations, setOpenViewObservations] = React.useState(false);
  const [openInfoStudent, setOpenInfoStudents] = React.useState(false);
  const [openViewResults, setOpenViewResults] = React.useState(false);
  const dispatch = useDispatch()

  const handleInstitution = async () => {
    const data = {};
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
    const data = { ied: dataSelects.institution };
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

  const handleSubmit = async (sinc = 0, lim = limit) => {
    const keys = Object.keys(dataSelects)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (dataSelects[key] === 0){
        setDataSelects({ ...dataSelects, [key]: undefined });
      }
    }

    const data = {
      ied: dataSelects.institution,
      programa_academico: dataSelects.program,
      grupo: dataSelects.group,
      status: dataSelects.status,
    };

    // eslint-disable-next-line prefer-template
    const url = 'student/filter-absence?since='+sinc+'&limit='+lim;
    const res = await FetchTokenized(url, token, data, 'POST');
    const body = await res.json();
    if (body.statusCode === 200) {
      setStudents(body.students);
      setTotal(body.total);
    }
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    if (body.statusCode === 400) {
      AlertError(`Error en la peticion ${body.msg}`);
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target
    if (value === 0){
      setDataSelects({ ...dataSelects, [name]: undefined });
    }else{
      setDataSelects({ ...dataSelects, [name]: value });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const since = limit * newPage;
    handleSubmit(since);
  };

  const handleChangeRowsPerPage = (event) => {
    const lim = event.target.value;

    setLimit(lim);
    setPage(0);
    handleSubmit(0, lim);
  };

  const modalCreateObservation = (uid, status) => {
    setStatusAttendance(status);
    setUidStudent(uid);
    setOpenCreateObservation(true);
  };

  const modalViewObservation = (uid) => {
    setUidStudent(uid);
    setOpenViewObservations(true);
  };

  const modalInfoStudents = (student) => {
    setDataStudent(student);
    setOpenInfoStudents(true);
  };

  const modalViewResults = () => {
    setOpenViewResults(true);
  };

  const handleClose = () => {
    setOpenCreateObservation(false);
    setOpenViewObservations(false);
    setOpenInfoStudents(false);
    setOpenViewResults(false);
  };

  return (
    <PageContainer title="SPID | Inasistentes">
      {/* breadcrumb */}
      <Breadcrumb title="Estudiantes Inasistentes" items={BCrumb} />
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
                disabled={dataSelects.institution ? false : true}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      overflow: 'auto',
                    },
                  },
                }}
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
                disabled={dataSelects.program ? false : true}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      overflow: 'auto',
                    },
                  },
                }}
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
              <CustomFormLabel htmlFor="status">Semaforo</CustomFormLabel>
              <CustomSelect
                id="status"
                name="status"
                value={dataSelects.status ? dataSelects.status : trafficLight[0].value}
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
                onChange={handleChange}
              >
                {trafficLight.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </CustomSelect>
              <Box sx={{ marginTop: '20px' }}>
                <Button
                  variant="contained"
                  sx={{ display: 'flex', marginLeft: 'auto' }}
                  onClick={() => handleSubmit()}
                >
                  Generar listado
                </Button>
              </Box>
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
              Lista de estudiantes inasistentes
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
                    <TableCell align="center">
                      <Typography variant="h5">Identificacion</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h5">Nombre</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h5">Inasistencias</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h5">Semaforo</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h5">Estado</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h5">Motivo</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h5">Contacto</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="h5">Opciones</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => {
                    let colorStatus = [];
                    if (student.status === 1) {
                      colorStatus = ['success.main'];
                    }
                    if (student.status === 2) {
                      colorStatus = ['success.main', 'warning.main'];
                    }
                    if (student.status === 3) {
                      colorStatus = ['success.main', 'warning.main', 'danger.main'];
                    }
                    if (student.status === 4) {
                      colorStatus = ['success.main', 'warning.main', 'danger.main', 'dark.main'];
                    }
                    return (
                      <TableRow key={student._id}>
                        <TableCell align="center">
                          <Typography>{student.identificacion}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography color="textSecondary" variant="h6" fontWeight="400">
                            {student.nombre_completo}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography>{student.count_day}/15</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center">
                            {colorStatus.map((status) => (
                              <Box
                                variant="contened"
                                sx={{
                                  backgroundColor: status,
                                  width: '35px',
                                  height: '35px',
                                  color: '#fff',
                                  ml: '-8px',
                                  borderRadius: '50%',
                                }}
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography>{student.estado_de_estudiante}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography>{student.reason}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            sx={{
                              backgroundColor:
                                student.state_contact === 'Contactado'
                                ? (theme) => theme.palette.success.main
                                : student.state_contact === 'No Contactado'
                                  ? (theme) => theme.palette.danger.main
                                  : (theme) => theme.palette.grey.A100,
                              color: 
                                student.state_contact === 'Sin Datos'
                                ? '#000'
                                : '#fff',
                              borderRadius: '6px',
                            }}
                            size="small"
                            label={student.state_contact}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center">
                            <IconButton
                              color="secondary"
                              onClick={() => modalInfoStudents(student)}
                            >
                              <FeatherIcon icon="info" width="24" height="24" />
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={() => modalViewObservation(student._id)}
                            >
                              <FeatherIcon icon="eye" width="24" height="24" />
                            </IconButton>
                            <IconButton
                              color="warning"
                              onClick={() => modalCreateObservation(student._id, student.status)}
                            >
                              <FeatherIcon icon="edit-3" width="24" height="24" />
                            </IconButton>
                            <IconButton onClick={() => modalViewResults()}>
                              <TrafficIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <ModalCreateObservation
                  statusAttendance={statusAttendance}
                  uid={uidStudent}
                  open={openCreateObservation}
                  handleClose={handleClose}
                />
                <ModalViewObservations
                  uid={uidStudent}
                  open={openViewObservations}
                  handleClose={handleClose}
                />
                <ModalInfoStudent
                  dataStudent={dataStudent}
                  open={openInfoStudent}
                  handleClose={handleClose}
                />
                <ModalViewResults open={openViewResults} handleClose={handleClose} />
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'Todos', value: total }]}
                      colSpan={8}
                      count={total || 0}
                      rowsPerPage={limit || 0}
                      page={page}
                      SelectProps={{
                        inputprops: {
                          'aria-label': 'rows per page',
                        },
                      }}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default NonAttendance;

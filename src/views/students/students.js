/* eslint-disable no-use-before-define */
import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TableFooter,
  TablePagination,
  FormControl,
  InputAdornment,
  Button,
  TextField,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { useDispatch, useSelector } from 'react-redux';

import Swal from 'sweetalert2';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import { AlertCharging, AlertError, AlertSuccess } from '../../components/SweetAlerts/Alerts';
import { FetchTokenized } from '../../services/Fetch';
import ModalEditStudent from '../../components/modals/ModalEditStudent';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import { logout } from '../../redux/auth/Action';

const Students = () => {
  const [dataStudents, setDataStudents] = React.useState([]);

  // Pagination
  const [limit, setLimit] = React.useState(25);
  const [total, setTotal] = React.useState();

  const { token } = useSelector((state) => state.auth.user);
  const { user: User } = useSelector((state) => state.auth.user);
  const [page, setPage] = React.useState(0);

  const [identification, setIdentification] = React.useState({});
  const dispatch = useDispatch();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const since = limit * newPage;
    listStudents(since);
  };

  const handleChangeRowsPerPage = (event) => {
    const lim = event.target.value;

    setLimit(lim);
    setPage(0);
    listStudents(0, lim);
  };

  // props of modal edit
  const [data, setData] = React.useState({});
  const [open, setOpen] = React.useState(false);

  const listStudents = async (sinc = 0, lim = limit) => {
    AlertCharging();
    const url = `student/list?since=${sinc}&limit=${lim}`;
    const res = await FetchTokenized(url, token);
    const body = await res.json();
    Swal.close();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    if (body.statusCode === 200) {
      setDataStudents(body.students);
      setTotal(body.total);
    }
  };

  const deleteStudents = async (uid) => {
    AlertCharging();
    // eslint-disable-next-line prefer-template
    const url = 'student/delete/' + uid;
    const res = await FetchTokenized(url, token, { '': '' }, 'DELETE');
    const body = await res.json();
    Swal.close();
    if (body.statusCode === 401) {
      dispatch(logout());
    }
    if (body.msg === 'deleted successfully') {
      AlertSuccess('Estudiante eliminado exitosamente');
      setTimeout(() => {
        listStudents(0);
      }, 2000);
    }
  };

  // List Users
  React.useEffect(() => {
    listStudents(0);
  }, []);

  // Delete users
  const handleDelete = (uid) => {
    Swal.fire({
      title: '¿Estas Seguro?',
      text: '¿Quieres eliminar a este estudiante?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteStudents(uid);
      }
    });
  };

  const modal = (student) => {
    setData(student);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [errors, setErrors] = React.useState({});
  const expressions = {
    identificacion: /^\d{7,10}$/, // 4 a 12 digitos.
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
    setIdentification({ ...identification, [name]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (errors.identificacion === false) {
      AlertCharging();
      const url = `student/filter-search`;
      const res = await FetchTokenized(url, token, identification, 'POST');
      const body = await res.json();
      Swal.close();
      if (body.statusCode === 401) {
        dispatch(logout());
      }
      if (body.statusCode === 200) {
        setDataStudents(body.student);
        setTotal(1);
      }
      if (body.statusCode === 400) {
        if (body.msg === 'the student does not exist') {
          AlertError('El estudiante no existe');
        }
      }
    } else {
      AlertError('Identificacion invalida');
    }
  };

  const BCrumb = [
    {
      title: 'Usuarios',
    },
    {
      title: 'Tabla de usuarios',
    },
  ];

  return (
    <>
      <PageContainer title="SPID | Tabla de usuarios" description="this is Basic Table page">
        {/* breadcrumb */}
        <Breadcrumb title="Listado de usuarios" items={BCrumb} />
        {/* end breadcrumb */}
        <Card>
          <CardContent>
            <Box
              sx={{
                overflow: 'auto',
              }}
            >
              <form onSubmit={handleSearch}>
                <CustomFormLabel htmlFor="identificacion">Identificacion</CustomFormLabel>
                <Box width={{ md: '50%' }}>
                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      endAdornment={
                        <InputAdornment position="end">
                          <FeatherIcon icon="credit-card" width="20" />
                        </InputAdornment>
                      }
                      id="identificacion"
                      name="identificacion"
                      placeholder="1234567890"
                      fullWidth
                      size="small"
                      value={identification.identificacion}
                      onChange={handleChange}
                      required
                      error={errors.identificacion}
                      helperText={
                        errors.identificacion
                          ? 'La identificacion debe tener de 7 a 10 numeros enteros y positivos'
                          : null
                      }
                    />
                  </FormControl>
                  <Box mt={1}>
                    <Button type="submit" variant="contained">
                      Buscar Estudiante
                    </Button>
                    <IconButton color="primary" onClick={() => listStudents(0)}>
                      <FeatherIcon icon="refresh-cw" width="24" height="24" />
                    </IconButton>
                  </Box>
                </Box>
              </form>
              {/* IDENTIFICACION */}
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Box
              sx={{
                overflow: 'auto',
              }}
            >
              <Table
                aria-label="simple table"
                sx={{
                  whiteSpace: 'nowrap',
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Typography variant="h5">Identificacion</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">Nombre Completo</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">Numero de celular</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">Correo Personal</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">Opciones</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataStudents.map((student) => (
                    <TableRow key={student.uid}>
                      <TableCell>
                        <Typography>{student.identificacion}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{student.nombre_completo}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{student.n_de_celular}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{student.correo_electronico_personal}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <IconButton color="primary" onClick={() => modal(student)}>
                            <FeatherIcon icon="edit" width="24" height="24" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(student.uid)}
                            disabled={student.uid === User.uid}
                            sx={{
                              marginLeft: '10px',
                            }}
                          >
                            <FeatherIcon
                              icon="trash"
                              width="24"
                              height="24"
                              color={student.uid === User.uid ? 'pink' : 'red'}
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <ModalEditStudent
                  dataStudent={data}
                  open={open}
                  handleClose={handleClose}
                  listStudents={listStudents}
                />
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, { label: 'All', value: total }]}
                      colSpan={6}
                      count={total}
                      rowsPerPage={limit}
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
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
};

export default Students;

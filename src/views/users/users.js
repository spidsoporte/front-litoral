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
  TextField,
  FormControl,
  Button,
} from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import { AlertCharging, AlertError, AlertSuccess } from '../../components/SweetAlerts/Alerts';
import { FetchTokenized } from '../../services/Fetch';
import ModalEditUser from '../../components/modals/ModalEditUser';
import { logout } from '../../redux/auth/Action';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';


const Users = () => {
  const [dataUsers, setDataUsers] = React.useState([]);

  // Pagination
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState();
  const dispatch = useDispatch()

  const { token } = useSelector((state) => state.auth.user);
  const { user: User } = useSelector((state) => state.auth.user);
  const [page, setPage] = React.useState(0);
  const [identification, setIdentification] = React.useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    const since = limit*newPage
    listUsers(since)
  };

  const handleChangeRowsPerPage = (event) => {
    const lim = event.target.value
    
    setLimit(lim)
    setPage(0);
    listUsers(0,lim)
  };

  // props of modal edit
  const [data, setData] = React.useState({
    cedula: '',
    name: '',
    email: '',
    rol: '',
    ies: '',
    uid: '',
  });
  const [open, setOpen] = React.useState(false);

  const listUsers = async (sinc = 0, lim = limit) => {
    AlertCharging();
    const url = `user/list?since=${sinc}&limit=${lim}`;
    const res = await FetchTokenized(url, token);
    const body = await res.json();
    Swal.close();
    if (body.statusCode === 200){
      setDataUsers(body.users);
      setTotal(body.total);
    }
    if (body.statusCode === 401) {
      dispatch(logout());
    }
  };

  const deleteUsers = async (uid) => {
    AlertCharging();
    // eslint-disable-next-line prefer-template
    const url = 'user/' + uid;
    const res = await FetchTokenized(url, token, { '': '' }, 'DELETE');
    const body = await res.json();
    Swal.close();
    if (body.msg === 'eliminado exitosamente') {
      AlertSuccess('Usuario eliminado exitosamente');
      setTimeout(() => {
        listUsers();
      }, 2000);
    }
  };
  

  // List Users
  React.useEffect(() => {
    listUsers();
  }, []);

  // Delete users
  const handleDelete = (uid) => {
    Swal.fire({
      title: '¿Estas Seguro?',
      text: '¿Quieres eliminar a este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUsers(uid);
      }
    });
  };

  const modal = (dataUser) => {
    setData(dataUser);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [errors, setErrors] = React.useState({});
  const expressions = {
    cedula: /^\d{7,10}$/, // 4 a 12 digitos.
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
    if (errors.cedula === false) {
      AlertCharging();
      const url = `user/search`;
      const res = await FetchTokenized(url, token, identification, 'POST');
      const body = await res.json();
      Swal.close();
      if (body.statusCode === 401) {
        dispatch(logout());
      }
      if (body.statusCode === 200) {
        setDataUsers(body.user);
        setTotal(1);
      }
      if (body.statusCode === 400) {
        if (body.msg === 'user does not exist') {
          AlertError('El usuario no existe');
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
                <CustomFormLabel htmlFor="cedula">Identificacion</CustomFormLabel>
                <Box width={{ md: '50%' }}>
                  <FormControl fullWidth>
                    <TextField
                      type="number"
                      id="cedula"
                      name="cedula"
                      placeholder="1234567890"
                      fullWidth
                      size="small"
                      value={identification.cedula}
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
                  <Box mt={1}>
                    <Button type="submit" variant="contained">
                      Buscar Usuario
                    </Button>
                    <IconButton color="primary" onClick={() => listUsers(0)}>
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
                      <Typography variant="h5">Cedula</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">Nombre</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">Correo</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">Rol</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h5">Opciones</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataUsers.map((user) => (
                    <TableRow key={user.uid}>
                      <TableCell>
                        <Typography>{user.cedula}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{user.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{user.rol}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <IconButton color="primary" onClick={() => modal(user)}>
                            <FeatherIcon icon="edit" width="24" height="24" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(user.uid)}
                            disabled={user.uid === User.uid}
                            sx={{
                              marginLeft: '10px',
                            }}
                          >
                            <FeatherIcon
                              icon="trash"
                              width="24"
                              height="24"
                              color={user.uid === User.uid ? 'pink' : 'red'}
                            />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <ModalEditUser
                  dataUser={data}
                  open={open}
                  handleClose={handleClose}
                  listUsers={listUsers}
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

export default Users;

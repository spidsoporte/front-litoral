/* eslint-disable import/extensions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable array-callback-return */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import * as XLSX from 'xlsx';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  Typography,
  Fab,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  ListItem,
  CardContent,
} from '@mui/material';
import UploadFile from '@mui/icons-material/UploadFile';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FeatherIcon from 'feather-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { AlertCharging, AlertError, AlertSuccess } from '../../components/SweetAlerts/Alerts';
import excelIcon from '../../assets/images/iconos/icons8-microsoft-excel.svg';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import { FetchTokenized } from '../../services/Fetch';
import { logout } from '../../redux/auth/Action';
import excel from '../../assets/files/Plantilla para el cargue de estudiantes.xlsx';
import ModalCleanData from './ModalCleanData';

const steps = ['Archivos', 'Finalizar'];

const Import = () => {
  const [render, setRender] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const { token } = useSelector((state) => state.auth.user);
  // Archivo
  const [files, setFiles] = React.useState([]);
  const [dataFiles, setDataFiles] = React.useState([]);
  const [filesName, setFilesName] = React.useState([]);
  const [fileError, setFileError] = React.useState(false);
  const [errors, setErrors] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setDataFiles([]);
    setFilesName([]);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      if (
        e.target.files[0].type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        setFileError(false);
        setFiles([e.target.files[0]]);
      } else {
        setFileError(true);
      }
    }
    document.querySelector('#file').value = null;
  };

  const parseDate = (date) => {
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    // agregacion del 0 al inicio cuando el numero es de un solo digito
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }

    // devolvemos la fecha en string con el formato yyyy/mm/dd
    return `${year}-${month}-${day}`;
  };

  const handlePreview = async () => {
    handleNext();
    for (let i = 0; i < files.length; i++) {
      AlertCharging('Este proceso puede demorar unos minutos, por favor espere...');
      // eslint-disable-next-line no-await-in-loop
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(files[i]);
        setFilesName((filesName) => [...filesName, files[i].name]);

        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          const wb = XLSX.read(bufferArray, { type: 'buffer', cellDates: true });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);

          // Se convierten todos los valores y fechas a string
          data.forEach((object) => {
            Object.keys(object).forEach((key) => {
              if (typeof object[key] === 'object') {
                object[key] = parseDate(object[key]);
              } else if (key === 'IES') {
                object[key] = object[key].replace(/(\w)(\S*)/g, (g0, g1, g2) => {
                  return g1.toUpperCase() + g2.toLowerCase();
                });
              } else {
                object[key] = object[key].toString();
              }
            });
          });

          resolve(data);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });
      // eslint-disable-next-line no-await-in-loop
      await promise.then((data) => {
        setDataFiles((dataFiles) => [...dataFiles, data]);
        Swal.close();
      });
    }

    AlertSuccess('Excel Convertido', 1000);
  };

  const handleImport = async () => {
    for (let i = 0; i < dataFiles.length; i++) {
      const file = dataFiles[i];
      let error = {};
      AlertCharging('Este proceso puede tardar unos minutos, por favor espere...');
      const res = await FetchTokenized('student/upload/', token, file, 'POST').catch((err) =>
        AlertError(err),
      );
      const body = await res.json();
      Swal.close();
      if (body.statusCode === 200) {
        setOpen(true);
      }
      if (body.statusCode === 401) {
        dispatch(logout());
      }
      if (body.statusCode === 400) {
        AlertError(body.message);
        if (body.datatemp) {
          error = body.datatemp;
        } else {
          error = {
            'Error de cargue': [{ 'Consultar con administrador': {} }],
          };
        }
      }

      if (body.statusCode === 410) {
        AlertError(body.message);
        if (body.datatemp) {
          error = body.datatemp;
        } else {
          error = {
            'Error de cargue': [{ 'Consultar con administrador': {} }],
          };
        }
      }
      if (body.statusCode === 500) {
        error = {
          'Error de cargue': [{ 'Consultar con administrador': {} }],
        };
        AlertError(body.msg);
      }
      setErrors((errors) => [...errors, error]);
    }
    handleNext();
  };

  const handleDelete = (i) => {
    files.splice(i, 1);
    setRender(!render);
  };

  // eslint-disable-next-line consistent-return
  const handleSteps = (step) => {
    switch (step) {
      case 0:
        return (
          /*
            CARGA Y LISTA DE ARCHIVOS
          */
          <Box sx={{ p: 3 }}>
            <CustomFormLabel htmlFor="file">Archivo Excel</CustomFormLabel>
            <Button variant="contained" component="label" endIcon={<UploadFile />}>
              Cargar Archivo
              <input
                hidden
                type="file"
                id="file"
                name="file"
                accept=".xlsx"
                onChange={handleChange}
              />
            </Button>
            {fileError && (
              <Typography sx={{ color: (theme) => theme.palette.error.main, fontSize: '12px' }}>
                Archivo no permitido, solo se permiten archivos .xlsx (EXCEL)
              </Typography>
            )}
            {files.map((file, i) => (
              <Box
                key={file.name}
                display="flex"
                alignItems="center"
                sx={{
                  mt: 2,
                  pt: 1,
                }}
              >
                <Fab
                  sx={{
                    background: 'none',
                    boxShadow: 'none',
                    height: '45px',
                    width: '45px',
                    borderRadius: '10px',
                  }}
                >
                  <img src={excelIcon} />
                </Fab>
                <Box
                  sx={{
                    ml: 2,
                  }}
                >
                  <Typography variant="h5">{file.name}</Typography>
                </Box>
                <Box
                  sx={{
                    ml: 2,
                  }}
                  onClick={() => handleDelete(i)}
                >
                  <IconButton>
                    <FeatherIcon icon="trash-2" color="red" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        );
      case 1:
        return (
          /*
            PREVISUALIZACION DE ARCHIVOS
          */
          <Box sx={{ p: 3 }}>
            <Typography sx={{ fontSize: '1.5em', fontWeight: 'bold' }}>
              Previsualizacion de archivos
            </Typography>
            {dataFiles.map((file, i) => {
              const keys = Object.keys(file[0]);
              return (
                <Card>
                  <Box marginY="20px" border="2px" sx={{ overflow: 'auto', maxHeight: '300px' }}>
                    <Box display="flex" alignItems="center">
                      <Fab
                        sx={{
                          background: 'none',
                          boxShadow: 'none',
                          height: '45px',
                          width: '45px',
                          borderRadius: '10px',
                        }}
                      >
                        <img src={excelIcon} />
                      </Fab>
                      <Typography variant="h3" sx={{ margin: '0 0 10px 10px' }}>
                        {filesName[i]}
                      </Typography>
                    </Box>
                    <Table>
                      <TableHead>
                        <TableRow>
                          {keys.map((key) => (
                            <TableCell>{key}</TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {file.map((f) => (
                          <TableRow>
                            {keys.map((key) => (
                              <TableCell>{f[key]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Card>
              );
            })}
          </Box>
        );
      default:
        break;
    }
  };

  const handleReset = () => {
    setDataFiles([]);
    setFiles([]);
    setFilesName([]);
    setErrors([]);
    setActiveStep(0);
  };

  const BCrumb = [
    {
      title: 'Reporte',
    },
    {
      title: 'Importaciones',
    },
    {
      title: 'Importacion de estudiantes',
    },
  ];

  console.log(errors);

  return (
    <PageContainer title="SPID | Importacion">
      <Breadcrumb title="Importar Estudiantes (Excel)" items={BCrumb} />
      <Card>
        <CardContent>
          <Typography variant="h3">Plantilla de excel para importar estudiantes</Typography>
          <Typography my={1}>
            Por favor leer y seguir las instrucciones para evitar errores en el cargue de la
            informacion a las bases de datos
          </Typography>
          <Typography variant="h4" mt={2} mb={1}>
            Instrucciones de uso
          </Typography>
          <Typography ml={2} my={1}>
            - Los campos no deben llevar tiles o caracteres especiales solo los nombres pueden
            llevar acentos
          </Typography>
          <Typography ml={2} my={1}>
            - El formato de escritura es formato oracion donde la primera letra de cada palabra debe
            ser mayuscula. (Este Es Un Ejemplo)
          </Typography>
          <Typography ml={2} my={1}>
            - Por favor no modificar los nombres de los campos
          </Typography>
          <Button href={excel} endIcon={<FileDownloadOutlinedIcon />}>
            Descargar Plantilla
          </Button>
        </CardContent>
      </Card>
      <Card>
        <Box sx={{ width: '100%' }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = <Typography variant="caption">Previsualizacion</Typography>;
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <>
              <Box sx={{ m: 3, p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
                Proceso de importacion finalizado
              </Box>
              {errors.map((error, i) => (
                <Box
                  sx={
                    !Object.keys(error).length
                      ? {
                          m: 3,
                          p: 2,
                          backgroundColor: 'info.light',
                          borderRadius: 1,
                          maxHeight: '500px',
                          overflow: 'auto',
                        }
                      : {
                          m: 3,
                          p: 2,
                          backgroundColor: 'danger.light',
                          borderRadius: 1,
                          maxHeight: '500px',
                          overflow: 'auto',
                        }
                  }
                >
                  <Box display="flex" alignItems="center">
                    <Fab
                      sx={{
                        background: 'none',
                        boxShadow: 'none',
                        height: '45px',
                        width: '45px',
                        borderRadius: '10px',
                      }}
                    >
                      <img src={excelIcon} />
                    </Fab>
                    <Typography variant="h3" sx={{ margin: '0 0 10px 10px' }}>
                      {filesName[i]}
                    </Typography>
                  </Box>
                  <Box sx={{ marginTop: '30px' }}>
                    <b>
                      {Object.keys(error).length
                        ? 'Errores encontrados'
                        : 'No se encontraron errores'}
                    </b>
                    <Box>
                      {Object.keys(error).map((key) => (
                        <Box>
                          {error[key].map((err) => (
                            <ListItem>
                              {err.identificacin} - {err.nombrecompleto}
                              <Typography marginLeft="auto">{key}</Typography>
                            </ListItem>
                          ))}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
              ))}
              <Box display="flex" sx={{ flexDirection: 'row', p: 3 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset} variant="contained" color="error">
                  Volver
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box>{handleSteps(activeStep)}</Box>
              <Box display="flex" sx={{ flexDirection: 'row', p: 3 }}>
                <Button
                  color="inherit"
                  variant="contained"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Anterior
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button
                  onClick={activeStep === steps.length - 1 ? handleImport : handlePreview}
                  variant="contained"
                  color={activeStep === steps.length - 1 ? 'success' : 'primary'}
                  disabled={files.length === 0}
                >
                  {activeStep === steps.length - 1 ? 'Importar' : 'Siguiente'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Card>
      <ModalCleanData open={open} handleClose={handleClose} data={dataFiles[0]} />
    </PageContainer>
  );
};

export default Import;

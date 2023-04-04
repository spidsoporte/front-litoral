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
import {
  AlertCharging,
  AlertError,
  AlertProgress,
  AlertSuccess,
} from '../../components/SweetAlerts/Alerts';
import excelIcon from '../../assets/images/iconos/icons8-microsoft-excel.svg';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import { FetchTokenized } from '../../services/Fetch';
import { logout } from '../../redux/auth/Action';
import excel from '../../assets/files/Plantilla para el cargue de asistencias.xlsx';

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
  const [errorsValidate, setErrorsValidate] = React.useState([]);
  const [validate, setValidate] = React.useState(false);
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

  const handleChange = (e) => {
    if (e.target.files[0]) {
      if (
        e.target.files[0].type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        setFileError(false);
        setFiles([...files, e.target.files[0]]);
        document.querySelector('#file').value = '';
      } else {
        setFileError(true);
      }
    }
  };

  const handlePreview = async () => {
    handleNext();

    const excelEpoc = new Date(1900, 0, -1).getTime();
    const msDay = 86400000;

    for (let i = 0; i < files.length; i++) {
      AlertCharging();
      // eslint-disable-next-line no-await-in-loop
      const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(files[i]);
        setFilesName((filesName) => [...filesName, files[i].name]);

        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          const wb = XLSX.read(bufferArray, { type: 'buffer' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);

          const jDatos = [];
          for (let i = 0; i < data.length; i++) {
            const dato = data[i];
            let date = null;
            if (dato.fecha) {
              // const date = new Date(dato.fecha).todateLocaleDateString();
              const dateConvert = new Date(excelEpoc + dato.fecha * msDay);
              const dateParse = Date.parse(dateConvert);
              const finaldate = new Date(dateParse);

              const year = finaldate.getUTCFullYear();
              let month = finaldate.getUTCMonth() + 1;
              let day = finaldate.getUTCDate();

              if (month < 10) {
                month = `0${month}`;
              }
              if (day < 10) {
                day = `0${day}`;
              }

              date = `${year}-${month}-${day}`;
            }

            jDatos.push({
              ...dato,
              fecha: date,
            });
          }

          resolve(jDatos);
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
    setValidate(false);
    for (let i = 0; i < dataFiles.length; i++) {
      const file = dataFiles[i];
      const error = [];
      AlertProgress(file.length, 0);
      for (let j = 0; j < file.length; j++) {
        const f = {
          ies: file[j].IES && file[j].IES,
          ied: file[j].IED && file[j].IED,
          programa_academico: file[j]['Programa académico'] && file[j]['Programa académico'],
          grupo: file[j].Grupo && file[j].Grupo,
          identificacion: file[j].Identificación && file[j].Identificación.toString(),
          asistencia: file[j].asistencencia && file[j].asistencencia,
          date: file[j].fecha && new Date(file[j].fecha),
        };
        const res = await FetchTokenized('student/records-add-excel', token, f, 'POST');
        const body = await res.json();
        if (body.statusCode === 401) {
          dispatch(logout());
        }
        if (body.statusCode === 400) {
          error.push(body);
        }
        if (body.statusCode === 410) {
          error.push({ ...body, datatemp: [f] });
        }
        Swal.update({ html: `${j + 1} - ${file.length}` });
      }
      setErrors((errors) => [...errors, error]);
      Swal.close();
    }
    handleNext();
  };

  const handleValidate = async () => {
    AlertCharging();
    for (let i = 0; i < dataFiles.length; i++) {
      const file = dataFiles[i];
      const data = [];
      for (let j = 0; j < file.length; j++) {
        const f = {
          ies: file[j].IES && file[j].IES,
          ied: file[j].IED && file[j].IED,
          programa_academico: file[j]['Programa académico'] && file[j]['Programa académico'],
          grupo: file[j].Grupo && file[j].Grupo,
          identificacion: file[j].Identificación && file[j].Identificación.toString(),
          asistencia: file[j].asistencencia && file[j].asistencencia,
          date: file[j].fecha && new Date(file[j].fecha),
        };
        data.push(f);
      }
      const res = await FetchTokenized('student/records-validator-excel', token, data, 'POST');
      const body = await res.json();
      Swal.close();
      if (body.statusCode === 200) {
        AlertSuccess('Excel listo para importar');
        setValidate(true);
      }
      if (body.statusCode === 410) {
        AlertError('Campos vacios, o estructura del excel invalida');
      }
      if (body.statusCode === 400) {
        if (body.msg === 'Excel denied') {
          setErrorsValidate((errorsValidate) => [...errorsValidate, body.datatemp]);
          handleNext();
        } else {
          AlertError(body.msg);
        }
      }
    }
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
    setErrorsValidate([]);
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
      title: 'Importacion de asistencias',
    },
  ];

  return (
    <PageContainer title="SPID | Importacion">
      <Breadcrumb title="Importar asistencias (Excel)" items={BCrumb} />
      <Card>
        <CardContent>
          <Typography variant="h3">Plantilla de excel para importar asistencias</Typography>
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
            - No colocar informacion que no se encuentre dentro de las opciones de seleccion
            predeterminadas en el excel
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
                    error.length === 0
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
                    <b>({error.length}) Error(es) encontrado(s)</b>
                    <Box>
                      {error.map((err) =>
                        err.statusCode === 410 ? (
                          <ListItem>
                            {err.datatemp[0].identificacion}
                            <Typography marginLeft="auto">
                              Contiene campos vacios o invalidos
                            </Typography>
                          </ListItem>
                        ) : (
                          err.datatemp && (
                            <ListItem>
                              {err.datatemp[0].identificacion}
                              <Typography marginLeft="auto">
                                {err.msg && err.msg === 'invalid information'
                                  ? 'Informacion invalida'
                                  : err.msg === 'the student does not exit'
                                  ? 'El estudiante no existe'
                                  : err.msg === 'asistencia erronea'
                                  ? 'Asistencia duplicada'
                                  : Object.entries(err.msg).length === 0 && 'Error de peticion'}
                              </Typography>
                            </ListItem>
                          )
                        ),
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
              {errorsValidate.map((error, i) => (
                <Box
                  sx={
                    error.length === 0
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
                    <b>({error.length}) Error(es) encontrado(s)</b>
                    <Box>
                      {error.map(
                        (err) =>
                          err.typeError && (
                            <ListItem>
                              {err.identificacion}
                              <Typography marginLeft="auto">
                                {err.typeError && err.typeError === 'invalid information'
                                  ? 'Informacion invalida'
                                  : err.typeError === 'the student does not exit'
                                  ? 'El estudiante no existe'
                                  : null}
                              </Typography>
                            </ListItem>
                          ),
                      )}
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

                {activeStep === steps.length - 1 && !validate && (
                  <Button onClick={handleValidate} variant="contained" color="primary">
                    Validar excel
                  </Button>
                )}
                {activeStep === steps.length - 1 && validate && (
                  <Button
                    onClick={activeStep === steps.length - 1 ? handleImport : handlePreview}
                    variant="contained"
                    color={activeStep === steps.length - 1 ? 'success' : 'primary'}
                    disabled={files.length === 0}
                  >
                    {activeStep === steps.length - 1 ? 'Importar' : 'Siguiente'}
                  </Button>
                )}
                {activeStep === 0 && (
                  <Button
                    onClick={activeStep === steps.length - 1 ? handleImport : handlePreview}
                    variant="contained"
                    color={activeStep === steps.length - 1 ? 'success' : 'primary'}
                    disabled={files.length === 0}
                  >
                    {activeStep === steps.length - 1 ? 'Importar' : 'Siguiente'}
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>
      </Card>
    </PageContainer>
  );
};

export default Import;

/* eslint-disable no-unused-vars */
/* eslint-disable no-unneeded-ternary */
import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Button,
  MenuItem,
  Box,
  FormControl,
  OutlinedInput,
  Link,
} from '@mui/material';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { FetchTokenized } from '../../services/Fetch';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import { logout } from '../../redux/auth/Action';
import { AlertCharging, AlertError, AlertSuccess } from '../../components/SweetAlerts/Alerts';
import url from '../../assets/global/urlFetch';

const BCrumb = [
  {
    title: 'Reportes',
  },
  {
    title: 'Reporte Mensual',
  },
];

const initSelect = [
  {
    value: undefined,
    label: 'Todos',
  },
];

const MonthlyReport = () => {
  const { token } = useSelector((state) => state.auth.user);
  const { ies: IED } = useSelector((state) => state.auth.user.user);
  const [dataSelects, setDataSelects] = React.useState({
    ies: IED,
  });
  const [institutions, setInstitutions] = React.useState(initSelect);
  const [programs, setPrograms] = React.useState(initSelect);
  const [groups, setGroups] = React.useState(initSelect);
  const [fileName, setFileName] = React.useState();
  const [dowmload, setDowmload] = React.useState(false);
  const dispatch = useDispatch();

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
    AlertCharging();
    const data = {
      ies: dataSelects.ies,
      ied: dataSelects.institution,
      programa_academico: dataSelects.program,
      grupo: dataSelects.group,
      time: dataSelects.time,
    };
    const res = await FetchTokenized('student/list-RecordsMonthly', token, data, 'POST');
    const body = await res.json();
    console.log(body.statusCode);
    Swal.close();
    if (body.statusCode === 200) {
      AlertSuccess('Reporte generado correctamente');
      setFileName(body.fileName);
      setDowmload(true);
    }
    if (body.statusCode === 400) {
      AlertError('Error al generar el reporte');
    }
    if (body.statusCode === 401) {
      AlertError('Token invalido');
      dispatch(logout());
    }
  };

  const handleChange = (e) => {
    setDataSelects({ ...dataSelects, [e.target.name]: e.target.value });
  };

  return (
    <PageContainer title="SPID | Lista de asistencias">
      {/* breadcrumb */}
      <Breadcrumb title="Reporte Mensual de Inasistencias" items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container spacing={0}>
        {/* ------------------------- row 1 ------------------------- */}
        <Grid item xs={12} lg={12}>
          <Card>
            <CardContent>
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
                <FormControl fullWidth>
                  <CustomFormLabel htmlFor="time">Mes</CustomFormLabel>
                  <OutlinedInput
                    type="month"
                    id="time"
                    name="time"
                    fullWidth
                    size="small"
                    onChange={handleChange}
                    required
                  />
                </FormControl>
                <Box sx={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
                  <Button
                    sx={{
                      marginRight: '5px',
                    }}
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={dataSelects.group && dataSelects.time ? false : true}
                  >
                    Generar Reporte
                  </Button>
                  <Button
                    href={`${url}user/dowmload-RecordsMonthly/${fileName}`}
                    variant="contained"
                    color="primary"
                    disabled={!dowmload}
                    onClick={() => setDowmload(false)}
                  >
                    Descargar Excel
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
};
export default MonthlyReport;

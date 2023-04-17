/* eslint-disable react/style-prop-object */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { Box, Button, Dialog, DialogContent, ListItem, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import { AlertError, AlertSuccess } from '../../components/SweetAlerts/Alerts';
import { FetchTokenized } from '../../services/Fetch';

const ModalCleanData = ({ open, handleClose, data }) => {
  const [selected, setSelected] = useState(0);
  const { token } = useSelector((state) => state.auth.user);

  const handleSubmit = async () => {
    if (selected === 1) {
      const documents = []
      data.forEach(element => {
        documents.push(element.Identificación)
      });
      const res = await FetchTokenized('student/delete-notNewStudent', token, documents, 'POST').catch(
        (err) => AlertError(err),
      );
      const body = await res.json();
      if (body.statuscode === 200) {
        AlertSuccess('Depuracion exitosa');
      }
    }
    if (selected === 2) {
      const res = await FetchTokenized('student/delete-deserte', token, {}, 'POST').catch((err) =>
        AlertError(err),
      );
      const body = await res.json();
      if (body.statuscode === 200) {
        AlertSuccess('Depuracion exitosa');
      }
    }
    setSelected(0);
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        onBackdropClick
      >
        <DialogContent>
          <Box sx={{ textAlign: 'center', marginBottom: '30px' }}>
            <Typography variant="h2" color="primary">
              EL CARGUE DE SU DATA HA SIDO EXITOSO
            </Typography>
            <Typography>
              Si quiere hacer una depuracion de estudiantes, elija una de las siguientes opciones
            </Typography>
          </Box>
          <Box>
            <Tooltip
              arrow
              title="Esta opcion eliminara permanentemente a los estudiantes que NO se encuentren en el listado que se acaba de subir, independientemente de si estan en desertor o matriculado."
            >
              <ListItem
                button
                component="li"
                selected={selected === 1}
                onClick={() => setSelected(1)}
                sx={{
                  mb: 1,
                  cursor: 'pointer',
                  ...(selected === 1 && {
                    color: 'white',
                    backgroundColor: (theme) => `${theme.palette.primary.main}!important`,
                  }),
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckIcon />
                  <Typography sx={{ marginLeft: '10px' }}>
                    Eliminar todos los estudiantes{' '}
                    <span style={{ fontWeight: 'bold' }}>que NO pertenezcan a esta lista.</span>
                  </Typography>
                </Box>
              </ListItem>
            </Tooltip>
            <Tooltip
              arrow
              title="Esta opcion eliminara permanentemente a los estudiantes que se encuentren como desertores, independientemente de si estan o no en el listado que se acab de subir."
            >
              <ListItem
                button
                component="li"
                selected={selected === 2}
                onClick={() => setSelected(2)}
                sx={{
                  mb: 1,
                  cursor: 'pointer',
                  ...(selected === 2 && {
                    color: 'white',
                    backgroundColor: (theme) => `${theme.palette.primary.main}!important`,
                  }),
                }}
              >
                <CheckIcon />
                <Typography sx={{ marginLeft: '10px' }}>
                  Eliminar todos los estudiantes{' '}
                  <span style={{ fontWeight: 'bold' }}>que su estado sea "Desertor".</span>
                </Typography>
              </ListItem>
            </Tooltip>
            <Tooltip
              arrow
              title="Esta opcion no realizara ningun cambio en la base de datos de los estudiantes"
            >
              <ListItem
                button
                component="li"
                selected={selected === 3}
                onClick={() => setSelected(3)}
                sx={{
                  mb: 1,
                  cursor: 'pointer',
                  ...(selected === 3 && {
                    color: 'white',
                    backgroundColor: (theme) => `${theme.palette.primary.main}!important`,
                  }),
                }}
              >
                <CheckIcon />
                <Typography sx={{ marginLeft: '10px' }}>
                  No eliminar estudiantes,{' '}
                  <span style={{ fontWeight: 'bold' }}>continuar sin depurar.</span>
                </Typography>
              </ListItem>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'right' }}>
            <Button
              variant="contained"
              color="secondary"
              disabled={selected === 0}
              onClick={handleSubmit}
            >
              Continuar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModalCleanData;

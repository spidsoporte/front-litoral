/* eslint-disable no-restricted-globals */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable prefer-arrow-callback */
import * as React from 'react';
import FeatherIcon from 'feather-icons-react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { FormControl, InputAdornment, OutlinedInput } from '@mui/material';
// iconos
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import { AlertCharging, AlertError, AlertSuccess } from '../SweetAlerts/Alerts';
import { FetchTokenized } from '../../services/Fetch';
import AttendanceResults from '../dashboard/AttendaceResults';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalViewResults({ open, handleClose }) {

  return (
    <div>
      <Dialog
        padding={0}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <AttendanceResults margin='0px' />
        <DialogActions sx={{ margin: '5px' }}>
          <Button onClick={handleClose} color="danger">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

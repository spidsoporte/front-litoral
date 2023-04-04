import Swal from 'sweetalert2';

export const AlertError = (message, icon, title) => {
  const alerta = Swal.fire({
    customClass: {
      container: 'z-index',
    },
    icon: icon || 'error',
    title: title || 'ERROR',
    text: message,
  });
  return alerta;
};

export const AlertMessage = (message, icon) => {
  const alerta = Swal.fire({
    customClass: {
      container: 'z-index',
    },
    icon: icon || 'success',
    text: message,
  });
  return alerta;
};

export const AlertSuccess = (message, time) => {
  const alerta = Swal.fire({
    customClass: {
      container: 'z-index',
    },
    position: 'center',
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: time || 2000,
  });
  return alerta;
};

export const AlertCharging = (message) => {
  const alerta = Swal.fire({
    customClass: {
      container: 'z-index',
    },
    title: 'Cargando',
    html: message || 'Por favor espera un momento...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  return alerta;
};

export const AlertProgress = () => {
  const alerta = Swal.fire({
    title: 'Importando la Data!',
    html: '0 - 0',
    allowOutsideClick: false,
    showConfirmButton: false,
  });

  return alerta;
};

export const AlertSession = (handle) => {
  let timerInterval;
  console.log(handle);
  const alerta = Swal.fire({
    customClass: {
      container: 'z-index',
    },
    title: 'Alerta de inactividad!',
    html: 'Se cerrará sesion en <b></b> segundos.',
    timer: 60000,
    timerProgressBar: true,
    allowOutsideClick: false,
    didOpen: () => {
      const b = Swal.getHtmlContainer().querySelector('b');
      timerInterval = setInterval(() => {
        const time = (Swal.getTimerLeft() / 1000).toFixed(0);
        // eslint-disable-next-line prefer-destructuring
        b.textContent = time;
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('I was closed by the timer');
    }
    if (result.isConfirmed) {
      handle();
    }
  });

  return alerta;
};

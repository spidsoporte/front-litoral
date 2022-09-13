const Menuitems = [
  {
    title: 'Inicio',
    icon: 'pie-chart',
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'Usuarios',
    icon: 'mdi mdi-dots-horizontal',
    permissions: ['ADMINISTRADOR', 'COORDINADOR'],
  },
  {
    title: 'Crear Usuario',
    icon: 'user-plus',
    href: '/users/create',
    permissions: ['ADMINISTRADOR', 'COORDINADOR'],
  },
  {
    title: 'Gestionar Usuarios',
    icon: 'user',
    href: '/users',
    permissions: ['ADMINISTRADOR', 'COORDINADOR'],
  },
  {
    navlabel: true,
    subheader: 'Estudiantes',
    icon: 'mdi mdi-dots-horizontal',
    permissions: ['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO'],
  },
  {
    title: 'Registrar Estudiante',
    icon: 'user-plus',
    href: '/students/register',
    permissions: ['ADMINISTRADOR', 'PSICOLOGO', 'COORDINADOR'],
  },
  {
    title: 'Gestionar estudiantes',
    icon: 'users',
    href: '/students',
    permissions: ['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR'],
  },
  {
    title: 'Registro de Asistencia',
    icon: 'check-square',
    href: '/students/attendance',
    permissions: ['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR'],
  },
  {
    title: 'Seguimiento de inasistencias',
    icon: 'user-x',
    href: '/students/non-attendants',
    permissions: ['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO'],
  },
  {
    title: 'Calendario de Tareas',
    icon: 'calendar',
    href: '/users/tasks',
    permissions: ['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO'],
  },
  {
    navlabel: true,
    subheader: 'Reportes',
    icon: 'mdi mdi-dots-horizontal',
    permissions: ['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO'],
  },
  {
    title: 'Reporte Mensual',
    icon: 'file-text',
    href: '/report',
    permissions: ['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO'],
  },
  {
    title: 'Reporte de Deserción',
    icon: 'file-text',
    href: '/desertions',
    permissions: ['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO'],
  },
  {
    title: 'Importaciones',
    icon: 'upload',
    href: '/tables',
    collapse: true,
    permissions: ['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO'],
    children: [
      {
        title: 'Importacion de estudiantes',
        icon: 'upload',
        href: '/students/import',
        permissions: ['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO'],
      },
      {
        title: 'Importacion de asistencias',
        icon: 'upload',
        href: '/students/import/attendance',
        permissions: ['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO'],
      },
    ],
  },
];

export default Menuitems;

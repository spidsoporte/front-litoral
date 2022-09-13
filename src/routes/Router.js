import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full-layout/loadable/Loadable';
import { PrivateRoute } from './protectedRoutes/PrivateRoute';
import { PublicRoute } from './protectedRoutes/PublicRoute';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full-layout/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank-layout/BlankLayout')));
/* ***End Layouts**** */

const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const FailedToFetch = Loadable(lazy(() => import('../views/dashboard/FailedToFetch')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')));
const Users = Loadable(lazy(() => import('../views/users/users')));
const CreateUsers = Loadable(lazy(() => import('../views/users/createUsers')));
const TasksCalendar = Loadable(lazy(() => import('../views/users/calendar/tasksCalendar')));
const Auth = Loadable(lazy(() => import('../views/authentication/Auth')));
const Login = Loadable(lazy(() => import('../views/authentication/login')));
const ResetPassword = Loadable(lazy(() => import('../views/authentication/ResetPassword')));
const NewPassword = Loadable(lazy(() => import('../views/authentication/NewPassword')));
const Attendance = Loadable(lazy(() => import('../views/students/Attendance')));
const NonAttendants = Loadable(lazy(() => import('../views/students/NonAttendants')));
const Students = Loadable(lazy(() => import('../views/students/students')));
const RegisterStudent = Loadable(lazy(() => import('../views/students/RegisterStudent')));
const MonthlyReport = Loadable(lazy(() => import('../views/reports/MonthlyReport')));
const DesertionReport = Loadable(lazy(() => import('../views/reports/DesertionReport')));
const ImportStudents = Loadable(lazy(() => import('../views/imports/ImportStudents')));
const ImportAttendance = Loadable(lazy(() => import('../views/imports/ImportAttendance')));

/* ****Routes***** */
const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/auth" /> },
      {
        path: '/dashboard',
        exact: true,
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: '/users',
        exact: true,
        element: (
          <PrivateRoute permissions={['ADMINISTRADOR', 'COORDINADOR']}>
            <Users />
          </PrivateRoute>
        ),
      },
      {
        path: '/users/create',
        exact: true,
        element: (
          <PrivateRoute permissions={['ADMINISTRADOR', 'COORDINADOR']}>
            <CreateUsers />
          </PrivateRoute>
        ),
      },
      {
        path: '/users/tasks',
        exact: true,
        element: (
          <PrivateRoute permissions={['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO']}>
            <TasksCalendar />
          </PrivateRoute>
        ),
      },
      {
        path: '/students',
        exact: true,
        element: (
          <PrivateRoute permissions={['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO']}>
            <Students />
          </PrivateRoute>
        ),
      },
      {
        path: '/students/Register',
        exact: true,
        element: (
          <PrivateRoute permissions={['ADMINISTRADOR', 'PSICOLOGO', 'COORDINADOR']}>
            <RegisterStudent />
          </PrivateRoute>
        ),
      },
      {
        path: '/students/attendance',
        exact: true,
        element: (
          <PrivateRoute permissions={['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR']}>
            <Attendance />
          </PrivateRoute>
        ),
      },
      {
        path: '/students/non-attendants',
        exact: true,
        element: (
          <PrivateRoute permissions={['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO']}>
            <NonAttendants />
          </PrivateRoute>
        ),
      },
      {
        path: '/students/import',
        exact: true,
        element: (
          <PrivateRoute permissions={['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO']}>
            <ImportStudents />
          </PrivateRoute>
        ),
      },
      {
        path: '/students/import/attendance',
        exact: true,
        element: (
          <PrivateRoute permissions={['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO']}>
            <ImportAttendance />
          </PrivateRoute>
        ),
      },
      {
        path: '/report',
        exact: true,
        element: (
          <PrivateRoute permissions={['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO']}>
            <MonthlyReport />
          </PrivateRoute>
        ),
      },
      {
        path: '/desertions',
        exact: true,
        element: (
          <PrivateRoute permissions={['ADMINISTRADOR', 'DOCENTE', 'PSICOLOGO', 'COORDINADOR', 'EXTERNO']}>
            <DesertionReport />
          </PrivateRoute>
        ),
      },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      {
        path: '/',
        exact: true,
        element: (
          <PublicRoute>
            <Auth />
          </PublicRoute>
        ),
      },
      {
        path: '/login',
        exact: true,
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: '/reset-password',
        exact: true,
        element: (
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        ),
      },
      {
        path: '/new-password/:token',
        exact: true,
        element: (
          <PublicRoute>
            <NewPassword />
          </PublicRoute>
        ),
      },
      { path: '404', element: <Error /> },
      { path: '500', element: <FailedToFetch /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;

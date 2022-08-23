import { DATA_USER, LOGGED, LOGOUT } from '../constants';

export const setDataUser = (payload) => ({
  type: DATA_USER,
  payload,
});

export const setLogged = (payload) => ({
  type: LOGGED,
  payload,
});

export const logout = (payload) => ({
  type: LOGOUT,
  payload,
});
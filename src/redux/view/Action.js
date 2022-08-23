import { IES, CLEAN_IES } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const setIES = (payload) => ({
  type: IES,
  payload,
});

export const cleanIES = (payload) => ({
  type: CLEAN_IES,
  payload,
});

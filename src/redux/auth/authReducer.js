import { DATA_USER, LOGGED, LOGOUT } from '../constants';

// eslint-disable-next-line
const INIT_STATE = {
  user: {
    user: {
      rol: '',
    },
  },
  isLogged: false,
};

const AuthReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case DATA_USER:
      return {
        ...state,
        user: action.payload,
      };
    case LOGGED:
      return {
        ...state,
        isLogged: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        isLogged: false,
        user: {
          user: {
            rol: '',
          },
        },
      };
    default:
      return state;
  }
};

export default AuthReducer;

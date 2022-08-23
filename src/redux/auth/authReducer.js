import { DATA_USER, LOGGED, LOGOUT } from '../constants';

// eslint-disable-next-line
const INIT_STATE = {
  user: {
    user: {
      rol: '',
    },
  },
  isLogged: false,
  date: ''
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
        date: new Date()
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
        date: ''
      };
    default:
      return state;
  }
};

export default AuthReducer;

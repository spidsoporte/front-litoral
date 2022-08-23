import { IES, CLEAN_IES } from '../constants';

// eslint-disable-next-line
const INIT_STATE = {
  ies: "",
};

const ViewReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case IES:
      return {
        ...state,
        ies: action.payload,
      };
    case CLEAN_IES:
      return {
        ...state,
        ies: '',
      };
    default:
      return state;
  }
};

export default ViewReducer;

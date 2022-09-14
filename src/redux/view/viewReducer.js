import { IES } from '../constants';

// eslint-disable-next-line
const INIT_STATE = {
  ies: "Corporacion Educativa Del Litoral",
};

const ViewReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case IES:
      return {
        ...state,
        ies: action.payload,
      };
    default:
      return state;
  }
};

export default ViewReducer;

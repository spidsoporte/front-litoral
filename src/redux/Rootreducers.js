import { combineReducers } from 'redux';
import CustomizerReducer from './customizer/CustomizerReducer';
import AuthReducer from './auth/authReducer';
import ViewReducer from './view/viewReducer';

const RootReducers = combineReducers({
  custom: CustomizerReducer,
  auth: AuthReducer,
  view: ViewReducer,
}); 

export default RootReducers;

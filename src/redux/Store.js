import { createStore, applyMiddleware } from 'redux';
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import RootReducers from './Rootreducers';

const persistConfig = {
  key: "persist-store",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, RootReducers);

// eslint-disable-next-line import/prefer-default-export
const Store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk)),
);

export default Store
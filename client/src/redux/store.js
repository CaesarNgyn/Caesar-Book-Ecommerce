import { combineReducers, configureStore } from '@reduxjs/toolkit';
import accountReducer from '../redux/account/accountSlice';
import orderReducer from '../redux/order/orderSlice';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootPersistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['account'], //account reducer wont be persisted
  // whitelist: ['isLoggedIn']
}

//nested persist
const accountPersisConfig = {
  key: 'account',
  version: 1,
  storage,
  whitelist: ['isLoggedIn']
}


const rootReducer = combineReducers({
  account: persistReducer(accountPersisConfig, accountReducer),
  order: orderReducer
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});
const persistor = persistStore(store);
export { store, persistor };

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID
const initialOptions = {
  "client-id": CLIENT_ID,
  currency: "USD",
  intent: "capture",
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <Provider store={store}>
      <PayPalScriptProvider options={initialOptions}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </PayPalScriptProvider>
    </Provider>

  </React.StrictMode>
)

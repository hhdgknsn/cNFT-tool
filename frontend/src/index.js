import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';  // Redux integration
import store from './store';  // Corrected path for store
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
import { configureStore } from '@reduxjs/toolkit';
import campaignReducer from './reducers/campaignReducer';  // Make sure this path is correct

const store = configureStore({
  reducer: {
    campaign: campaignReducer,
  },
});

export default store;
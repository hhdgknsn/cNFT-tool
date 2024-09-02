// src/reducers/campaignReducer.js
import { createSlice } from '@reduxjs/toolkit';

// Define the initial state for the campaigns
const initialState = {
  campaigns: [],
  loading: false,
  error: null,
};

// Create a Redux slice for campaigns
const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    fetchCampaignsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCampaignsSuccess: (state, action) => {
      state.loading = false;
      state.campaigns = action.payload;
    },
    fetchCampaignsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addCampaign: (state, action) => {
      state.campaigns.push(action.payload);
    },
  },
});

// Export actions and reducer
export const {
  fetchCampaignsRequest,
  fetchCampaignsSuccess,
  fetchCampaignsFailure,
  addCampaign,
} = campaignSlice.actions;

export default campaignSlice.reducer;

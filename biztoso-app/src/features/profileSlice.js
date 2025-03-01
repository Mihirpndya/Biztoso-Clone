import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profiles: [], // Store multiple profiles
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    addProfile: (state, action) => {
      state.profiles.push({ id: Date.now(), ...action.payload }); // Assign unique ID
    },
    editProfile: (state, action) => {
      const index = state.profiles.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.profiles[index] = action.payload; // Update profile
      }
    },
  },
});

export const { addProfile, editProfile } = profileSlice.actions;
export default profileSlice.reducer;

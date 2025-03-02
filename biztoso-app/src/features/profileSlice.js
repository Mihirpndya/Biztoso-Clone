import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  profiles: [],
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    addProfile: (state, action) => {
      if (state.profiles.length > 0) {
        return; // ✅ Prevent multiple profiles
      }
      state.profiles.push({ id: Date.now(), ...action.payload });
    },
    editProfile: (state, action) => {
      const index = state.profiles.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.profiles[index] = action.payload;
      }
    },
  },
});

export const { addProfile, editProfile } = profileSlice.actions;
export default profileSlice.reducer;

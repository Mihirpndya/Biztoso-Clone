import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	profiles: [], // ✅ Change from a single profile to an array of profiles
};

const profileSlice = createSlice({
	name: "profile",
	initialState,
	reducers: {
		addProfile: (state, action) => {
			state.profiles.push(action.payload); // ✅ Append new profile instead of replacing
		},
	},
});

export const { addProfile } = profileSlice.actions;
export default profileSlice.reducer;

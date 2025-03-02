import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supabase from "../utils/supabase";

// Async Thunks for Authentication
export const signInWithGoogle = async () => {
	const { error } = await supabase.auth.signInWithOAuth({
		provider: "google",
		options: {
			redirectTo: `${window.location.origin}/profile`, // ✅ Ensure Redirect
		},
	});

	if (error) {
		console.error("Login failed:", error.message);
	}
};

export const signOutUser = createAsyncThunk("auth/signOutUser", async () => {
	await supabase.auth.signOut();
});

export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
	const { data } = await supabase.auth.getUser();
	return data?.user;
});

//  Auth Slice
const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.user = action.payload;
			})
			.addCase(signOutUser.fulfilled, (state) => {
				state.user = null;
			});
	},
});

export default authSlice.reducer;

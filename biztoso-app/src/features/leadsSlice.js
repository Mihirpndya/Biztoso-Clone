import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching leads
export const fetchLeads = createAsyncThunk("leads/fetchLeads", async () => {
	const response = await fetch(
		"https://67c42383c4649b9551b2bd7e.mockapi.io/api/v1/leadsGenerator"
	);
	if (!response.ok) throw new Error("Failed to fetch leads");
	return await response.json();
});

const leadsSlice = createSlice({
	name: "leads",
	initialState: {
		leads: [],
		status: "idle",
		error: null,
	},
	reducers: {
		toggleLeadStatus: (state, action) => {
			const lead = state.leads.find((lead) => lead.id === action.payload);
			if (lead) lead.status = !lead.status;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchLeads.pending, (state) => {
				state.status = "loading";
			})
			.addCase(fetchLeads.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.leads = action.payload;
			})
			.addCase(fetchLeads.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export const { toggleLeadStatus } = leadsSlice.actions;
export default leadsSlice.reducer;

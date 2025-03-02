import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./features/profileSlice";
import chatReducer from "./features/chatSlice";
import authReducer from "./features/authSlice"; // ✅ Add auth reducer

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    chat: chatReducer,
    auth: authReducer, // Add auth
  },
});

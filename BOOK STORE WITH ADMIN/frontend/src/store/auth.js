import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: { isLoggedIn: false, role: "user" },
    reducers: {
        login(state) {          // ← Login → login (lowercase)
            state.isLoggedIn = true;
        },
        logout(state) {
            state.isLoggedIn = false;
        },
        changeRole(state, action) {
            state.role = action.payload;
        },
    },
});

export const authAction = authSlice.actions;
export default authSlice.reducer; 
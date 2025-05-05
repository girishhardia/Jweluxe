import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    // name: "cart",
    name: "user",
    "initialState": {
        currentUser: null,
        isFetching: false,
        error: false,
        loginState: false
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.loginState = true;
            state.currentUser = action.payload;
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        signOut: (state) => {
            state.currentUser = null;
            state.loginState = false;
        }
    }
});
export const { loginStart, loginSuccess, loginFailure, signOut } = userSlice.actions;
export default userSlice.reducer;

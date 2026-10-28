import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    loggedIn: false,
    userLoggedInCurrently: {},
    loggingInState: true,
    darkMode: true,
};

export const socialSlice = createSlice({
    name: "socialState",
    initialState,
    reducers: {
        setLoggedIn: (state, action) => {
            state.loggedIn = action.payload;
        },
        setWhoSignedUp: (state, action) => {
            const personSigningUp = action.payload;
            // remeber who is signing up
            // ^add them to our users
            state.loggedIn = true;
            // remember we have SOMEONE logged in
            state.userLoggedInCurrently = action.payload;
            //remember whoo exactly is logged in, from this sign up
        },
        setLogOut: (state) => {
            state.loggedIn = false;
            state.userLoggedInCurrently = {};
        },
        logInOffMemory: (state, action) => {
            state.userLoggedInCurrently = action.payload;
            state.loggedIn = true;
        },
        setLoggingInState: (state, action) => {
            state.loggingInState = action.payload;
        },
        signSomeoneIn: (state, action) => {
            state.userLoggedInCurrently = action.payload;
            state.loggedIn = true;
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        setDarkMode: (state, action) => {
            state.darkMode = action.payload;
        },
    },
});

export const {
    loggedIn,
    userLoggedInCurrently,
    ourUsers,
    loggingInState,
    setLoggedIn,
    setWhoSignedUp,
    setLogOut,
    logInOffMemory,
    setLoggingInState,
    signSomeoneIn,
    onlineUsers,
    setOnlineUsers,
    setDarkMode,
} = socialSlice.actions;
export default socialSlice.reducer;

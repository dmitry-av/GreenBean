import { createSlice, PayloadAction } from "@reduxjs/toolkit";
//import { AccountResponse } from "../../types";
import { UserResponse } from "../../models/user";


type State = {
    token: string | null;
    refreshToken: string | null;
    account: UserResponse | null;
    verifyMailSent: boolean;
};

const initialState: State = { token: null, refreshToken: null, account: null, verifyMailSent: false };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthTokens(
            state: State,
            action: PayloadAction<{ token: string; refreshToken: string; }>
        ) {
            state.refreshToken = action.payload.refreshToken;
            state.token = action.payload.token;
        },
        setAccount(state: State, action: PayloadAction<any>) {
            state.account = action.payload;
        },
        setLogout(state: State) {
            state.account = null;
            state.refreshToken = null;
            state.token = null;
        },
        setIsMailSent(state: State, action: PayloadAction<boolean>) {
            state.verifyMailSent = action.payload;
        },
    }
});

export default authSlice;
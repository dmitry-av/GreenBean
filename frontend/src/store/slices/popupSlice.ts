import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type State = {
    isPopupOpen: boolean;
    isConfirmPopup: boolean;
};

const initialState: State = { isPopupOpen: false, isConfirmPopup: false };

const popupSlice = createSlice({
    name: "popup",
    initialState,
    reducers: {
        setIsPopup(state: State, action: PayloadAction<boolean>) {
            state.isPopupOpen = action.payload;
        },
        setConfirmPopup(state: State, action: PayloadAction<boolean>) {
            state.isConfirmPopup = action.payload;
        },
    }
});

export default popupSlice;

export const { setIsPopup, setConfirmPopup } = popupSlice.actions;
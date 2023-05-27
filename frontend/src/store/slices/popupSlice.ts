import { createSlice, PayloadAction } from "@reduxjs/toolkit";


type State = {
    isPopupOpen: boolean;
};

const initialState: State = { isPopupOpen: false };

const popupSlice = createSlice({
    name: "popup",
    initialState,
    reducers: {
        setIsPopup(state: State, action: PayloadAction<boolean>) {
            state.isPopupOpen = action.payload;
        },

    }
});

export default popupSlice;

export const { setIsPopup } = popupSlice.actions;
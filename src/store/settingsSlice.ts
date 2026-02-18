import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
    nativeLanguage: string;
    targetLanguage: string;
}

const initialState: SettingsState = {
    nativeLanguage: 'en',
    targetLanguage: 'et',
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setNativeLanguage: (state, action: PayloadAction<string>) => {
            state.nativeLanguage = action.payload;
        },
        setTargetLanguage: (state, action: PayloadAction<string>) => {
            state.targetLanguage = action.payload;
        },
    },
});

export const { setNativeLanguage, setTargetLanguage } = settingsSlice.actions;
export default settingsSlice.reducer;

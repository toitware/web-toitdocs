import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSDK = createAsyncThunk("sdk/fetch", async (version) => {
    const response = await fetch("./sdk/"+version+".json");
    return response.json()
})

const initialState = {
    object: null,
    version: null,
    status: 'idle',
    error: null,
}

export const sdk = createSlice({
    name: 'sdk',
    initialState,
    reducers: {},
    extraReducers: {
        [fetchSDK.pending]: (state, action) => {
            state.version = action.meta.arg;
            state.status = 'loading';
            state.object = null;
            state.error = null;
        },
        [fetchSDK.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.object = action.payload;
        },
        [fetchSDK.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    },
});

export const selector = state => state.sdk

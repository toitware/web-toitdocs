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

export const TYPE_SECTION = "section";
export const TYPE_STATEMENT_CODE_SECTION = "statement_code_section";
export const TYPE_STATEMENT_ITEMIZED = "statement_itemized";
export const TYPE_STATEMENT_ITEM = "statement_item";
export const TYPE_STATEMENT_PARAGRAPH = "statement_paragraph";
export const TYPE_STATEMENT_CODE = "statement_code";
export const TYPE_STATEMENT_TEXT = "statement_text";
export const TYPE_TOITDOCREF = "toitdocref";
export const TYPE_FUNCTION = "function";
export const TYPE_PARAMETER = "parameter";
export const TYPE_FIELD = "field";
export const TYPE_CLASS = "class";
export const TYPE_MODULE = "module";
export const TYPE_GLOBAL = "global";
export const TYPE_LIBRARY = "library";

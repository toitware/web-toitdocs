import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { modelFrom } from "../generator/convert";
import { ToitObject } from "../generator/doc";
import { Libraries } from "../model/model";
import { flatten, SearchableModel } from "../model/search";
import { baseURL } from "../App";

export interface RootState {
  doc: DocState;
}

export const rootPath = "lib";
export const docPath = process.env.PUBLIC_URL + "/sdk/";

export const fetchDoc = createAsyncThunk(
  "docdata/fetch",
  async (version: string) => {
    const response = await fetch(docPath + version + ".json");
    return (await response.json()) as ToitObject;
  }
);

export interface DocState {
  sdkVersion?: string;
  version?: string;
  libraries?: Libraries;
  searchableModel?: SearchableModel;
  error?: string;
}

const initialState: DocState = {
  sdkVersion: undefined,
  libraries: undefined,
  version: undefined,
  searchableModel: undefined,
  error: undefined,
};

export const doc = createSlice({
  name: "doc",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoc.pending, (state, action) => {
        state = initialState;
      })
      .addCase(fetchDoc.fulfilled, (state, action) => {
        state.sdkVersion = action.payload.sdk_version;
        state.libraries = modelFrom(action.payload.libraries[rootPath]);
        state.searchableModel = flatten(state.libraries);
      })
      .addCase(fetchDoc.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

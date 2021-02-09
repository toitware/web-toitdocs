import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { modelFrom } from "../generator/convert";
import { ToitObject } from "../generator/sdk";
import { Modules } from "../model/model";
import { flatten, SearchableModel } from "../model/search";

export interface RootState {
  sdk: SdkState;
}

export const fetchSDK = createAsyncThunk(
  "sdk/fetch",
  async (version: string) => {
    const response = await fetch("/sdk/" + version + ".json");
    return (await response.json()) as ToitObject;
  }
);

export interface SdkState {
  sdkVersion: string | undefined;
  modules: Modules | undefined;
  searchableModel: SearchableModel | undefined;
  error: string | undefined;
}

const initialState: SdkState = {
  sdkVersion: undefined,
  modules: undefined,
  searchableModel: undefined,
  error: undefined,
};

export const sdk = createSlice({
  name: "sdk",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSDK.pending, (state, action) => {
        state = initialState;
      })
      .addCase(fetchSDK.fulfilled, (state, action) => {
        state.sdkVersion = action.payload.sdk_version;
        state.modules = modelFrom(action.payload.libraries["lib"]);
        state.searchableModel = flatten(state.modules);
      })
      .addCase(fetchSDK.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const rootLibrary = "lib";

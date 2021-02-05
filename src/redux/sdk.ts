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
  object: ToitObject | undefined;
  modules: Modules | undefined;
  searchableModel: SearchableModel | undefined;
  version: string | undefined;
  status: string;
  error: string | undefined;
}

const initialState: SdkState = {
  object: undefined,
  modules: undefined,
  searchableModel: undefined,
  version: undefined,
  status: "idle",
  error: undefined,
};

export const sdk = createSlice({
  name: "sdk",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSDK.pending, (state, action) => {
        state.version = (action.meta.arg as unknown) as string;
        state.status = "loading";
        state.object = undefined;
        state.searchableModel = undefined;
        state.error = undefined;
      })
      .addCase(fetchSDK.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.object = action.payload;
        state.modules = modelFrom(action.payload.libraries["lib"]);
        state.searchableModel = flatten(state.modules);
      })
      .addCase(fetchSDK.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const rootLibrary = "lib";

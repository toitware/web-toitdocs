import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { flattenDataStructure } from "./components/fuse";

export const fetchSDK = createAsyncThunk("sdk/fetch", async (version) => {
  const response = await fetch("./sdk/" + version + ".json");
  return response.json();
});

const initialState = {
  object: null,
  searchObject: null,
  version: null,
  status: "idle",
  error: null,
};

export const sdk = createSlice({
  name: "sdk",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchSDK.pending]: (state, action) => {
      state.version = action.meta.arg;
      state.status = "loading";
      state.object = null;
      state.searchObject = null;
      state.error = null;
    },
    [fetchSDK.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.object = action.payload;
      state.searchObject = flattenDataStructure(state.object);
    },
    [fetchSDK.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
  },
});

export const selector = (state) => state.sdk;

export const OBJECT_TYPE_SECTION = "section";
export const OBJECT_TYPE_STATEMENT_CODE_SECTION = "statement_code_section";
export const OBJECT_TYPE_STATEMENT_ITEMIZED = "statement_itemized";
export const OBJECT_TYPE_STATEMENT_ITEM = "statement_item";
export const OBJECT_TYPE_STATEMENT_PARAGRAPH = "statement_paragraph";
export const OBJECT_TYPE_STATEMENT_CODE = "statement_code";
export const OBJECT_TYPE_STATEMENT_TEXT = "statement_text";
export const OBJECT_TYPE_TOITDOCREF = "toitdocref";
export const OBJECT_TYPE_FUNCTION = "function";
export const OBJECT_TYPE_PARAMETER = "parameter";
export const OBJECT_TYPE_FIELD = "field";
export const OBJECT_TYPE_CLASS = "class";
export const OBJECT_TYPE_MODULE = "module";
export const OBJECT_TYPE_GLOBAL = "global";
export const OBJECT_TYPE_LIBRARY = "library";

export const rootLibrary = "lib";

export function getLibrary(libraries, libraryName) {
  try {
    let library = libraries[rootLibrary];
    if (libraryName) {
      const segments = libraryNameToSegments(libraryName);
      segments.forEach((name) => (library = library.libraries[name]));
    }
    return library;
  } catch (e) {
    console.log("failed to find library: ", libraryName, e);
    return null;
  }
}

export function librarySegmentsToName(segments) {
  segments = [].concat(segments);
  if (segments.length > 0 && segments[0] === rootLibrary) {
    segments.shift();
  }
  return segments.join(".");
}

export function librarySegmentsToURI(segments) {
  return segments.join(".");
}

export function libraryNameToSegments(name) {
  const segments = name.split(".");
  if (segments.length > 0 && rootLibrary === segments[0]) {
    segments.shift();
  }
  return segments;
}

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ViewMode,
  getMetaValue,
  packageName,
  setPackageName,
  setViewMode,
  viewMode,
} from "../App";
import { modelFrom } from "../generator/convert";
import { ToitObject } from "../generator/doc";
import { Libraries } from "../model/model";
import { SearchableModel, flatten } from "../model/search";

export interface RootState {
  doc: DocState;
}

export const fetchDoc = createAsyncThunk(
  "docdata/fetch",
  async (version: string) => {
    const docPath =
      process.env.PUBLIC_URL + getMetaValue("toitdoc-path", "/sdk/");
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
    let rootPath = getMetaValue("toitdoc-root-library", "lib");
    builder
      .addCase(fetchDoc.pending, (state, action) => {
        state = initialState;
      })
      .addCase(fetchDoc.fulfilled, (state, action) => {
        const sdkVersion = action.payload.sdk_version;
        const sdkPath = action.payload.sdk_path;
        const packagesPath = action.payload.packages_path;
        const packageNames = action.payload.package_names;
        state.sdkVersion = sdkVersion;
        // Instead of getting the root-path, package-name and view-mode through a header,
        // get/deduce it from the json file.
        const pkgName = action.payload.pkg_name;
        if (pkgName) {
          setPackageName(pkgName);
          setViewMode(ViewMode.Package);
          rootPath = "src";
        }
        state.libraries = modelFrom(
          action.payload.libraries[rootPath],
          viewMode,
          packageName,
          sdkPath,
          packagesPath,
          packageNames
        );
        state.searchableModel = flatten(state.libraries);
      })
      .addCase(fetchDoc.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

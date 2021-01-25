import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { flattenDataStructure, SearchableToitObject } from "../components/fuse";
import {
  ToitClass,
  ToitLibraries,
  ToitLibrary,
  ToitModule,
  ToitObject,
} from "../generator/sdk";

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
  searchObject: SearchableToitObject | undefined;
  version: string | undefined;
  status: string;
  error: string | undefined;
}

const initialState: SdkState = {
  object: undefined,
  searchObject: undefined,
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
        state.searchObject = undefined;
        state.error = undefined;
      })
      .addCase(fetchSDK.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.object = action.payload;
        state.searchObject = flattenDataStructure(state.object);
      })
      .addCase(fetchSDK.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const rootLibrary = "lib";

export function libraryNameToSegments(name: string): string[] {
  const segments = name.split(".");
  if (segments.length > 0 && rootLibrary === segments[0]) {
    segments.shift();
  }
  return segments;
}

export function librarySegmentsToName(segments: string[]): string {
  segments = segments.concat([]);
  if (segments.length > 0 && segments[0] === rootLibrary) {
    segments.shift();
  }
  return segments.join(".");
}

export function librarySegmentsToURI(segments: string[]): string {
  return segments.join(".");
}

export function getLibrary(
  libraries: ToitLibraries,
  libraryName: string
): ToitLibrary | undefined {
  try {
    let library = libraries[rootLibrary];
    if (libraryName) {
      const segments = libraryNameToSegments(libraryName);
      segments.forEach((name) => {
        if (!library) {
          console.log("failed to find library: " + name);
          return undefined;
        }
        library = library.libraries[name];
      });
    }
    return library;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

export function getModule(
  libraries: ToitLibraries,
  libraryName: string,
  moduleName: string
): ToitModule | undefined {
  return getLibrary(libraries, libraryName)?.modules[moduleName];
}

export function getClass(
  libraries: ToitLibraries,
  libraryName: string,
  moduleName: string,
  className: string
): ToitClass | undefined {
  const module = getModule(libraries, libraryName, moduleName);
  return (
    module?.classes.find((c) => c.name === className) ||
    module?.export_classes.find((c) => c.name === className)
  );
}
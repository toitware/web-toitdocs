import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { flattenDataStructure, SearchableToitObject } from "./components/fuse";
import { ToitLibraries, ToitLibrary, ToitObject } from "./model/toitsdk";

export interface RootState {
  sdk: SdkState;
}

export const fetchSDK = createAsyncThunk(
  "sdk/fetch",
  async (version: string) => {
    const response = await fetch("./sdk/" + version + ".json");
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
export const OBJECT_TYPE_EXPRESSION = "expression";

export type ObjectTypeStatement =
  | typeof OBJECT_TYPE_STATEMENT_CODE_SECTION
  | typeof OBJECT_TYPE_STATEMENT_ITEMIZED
  | typeof OBJECT_TYPE_STATEMENT_PARAGRAPH;

export type ObjectTypeExpression =
  | typeof OBJECT_TYPE_STATEMENT_CODE
  | typeof OBJECT_TYPE_STATEMENT_CODE_SECTION
  | typeof OBJECT_TYPE_TOITDOCREF;

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
): ToitLibrary {
  try {
    let library = libraries[rootLibrary];
    if (libraryName) {
      const segments = libraryNameToSegments(libraryName);
      segments.forEach((name) => {
        if (!library) {
          throw new Error("failed to find library: " + name);
        }
        library = library.libraries[name];
      });
    }
    return library;
  } catch (e) {
    console.log(e);
    throw new Error("failed to find library: " + libraryName);
  }
}

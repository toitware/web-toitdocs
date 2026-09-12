// Copyright (C) 2024 Toitware ApS.
// Use of this source code is governed by an MIT-style license that can be
// found in the LICENSE file.

import React from "react";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import App from "./App";
import { doc, fetchDoc, RootState } from "./redux/doc";
import * as serviceWorker from "./serviceWorker";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";

const rootReducer = combineReducers({
  doc: doc.reducer,
});

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

const root = document.getElementById("root");
function mount(): void {
  render(<Provider store={store}><App /></Provider>, root, () => {
    document.querySelector("style[data-toitdoc-static]")?.remove();
  });
}

if (root?.hasChildNodes()) {
  // Keep the static documentation visible until the interactive model is ready.
  const dispatch = store.dispatch as ThunkDispatch<RootState, void, AnyAction>;
  void dispatch(fetchDoc()).then((action) => {
    if (fetchDoc.fulfilled.match(action)) mount();
  });
} else {
  mount();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

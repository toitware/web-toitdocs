import React from "react";
import thunkMiddleware from "redux-thunk";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { sdk } from "./sdk";
import "./assets/index.css";
import * as serviceWorker from "./serviceWorker";
import App from "./App";

const rootReducer = combineReducers({
  sdk: sdk.reducer,
});

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

const searchParams = new URLSearchParams(window.location.search);
let sdkVersion = "latest";
if (searchParams.has("version")) {
  sdkVersion = searchParams.get("version") || "Unknown version";
}

render(
  <Provider store={store}>
    <App sdkVersionFromParams={sdkVersion} />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

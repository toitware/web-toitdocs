import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import App from "./App";
import "./assets/index.css";
import { sdk } from "./redux/sdk";
import * as serviceWorker from "./serviceWorker";

const rootReducer = combineReducers({
  sdk: sdk.reducer,
});

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

const searchParams = new URLSearchParams(window.location.search);
let sdkVersion = "latest";
if (searchParams.has("sdk_version")) {
  sdkVersion = searchParams.get("sdk_version") || "Unknown version";
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

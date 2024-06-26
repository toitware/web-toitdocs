import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import App from "./App";
import { doc } from "./redux/doc";
import * as serviceWorker from "./serviceWorker";

const rootReducer = combineReducers({
  doc: doc.reducer,
});

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

const searchParams = new URLSearchParams(window.location.search);
let version = "latest";
if (searchParams.has("version")) {
  version = searchParams.get("version") || version;
}

render(
  <Provider store={store}>
    <App versionFromParams={version} />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

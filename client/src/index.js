import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
// import { applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import promiseMiddleware from "redux-promise";
import ReduxThunk from "redux-thunk";
import Reducer from "./_reducers";

import "antd/dist/antd.min.css";

import ReactGA from "react-ga";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";
serviceWorkerRegistration.register();

const store = configureStore({
  reducer: Reducer,
  middleware: [promiseMiddleware, ReduxThunk],
  devTools: true,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

reportWebVitals();

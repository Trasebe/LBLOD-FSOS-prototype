import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import "antd/dist/antd.css";

import AppContainer from "./views/App/AppContainer";

ReactDOM.render(
  <Router>
    <AppContainer />
  </Router>,
  document.getElementById("root")
);

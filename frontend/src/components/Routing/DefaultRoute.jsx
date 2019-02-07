import React from "react";
import { Route } from "react-router-dom";
import PropTypes from "prop-types";

const DefaultRoute = ({ component: Component, appState, ...rest }) => (
  <Route
    {...rest}
    render={props => <Component {...props} appState={appState} />}
  />
);

DefaultRoute.propTypes = {
  component: PropTypes.func.isRequired,
  appState: PropTypes.object
};

DefaultRoute.defaultProps = {
  appState: {}
};

export default DefaultRoute;

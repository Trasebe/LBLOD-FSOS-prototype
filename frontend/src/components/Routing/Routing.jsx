import React, { PureComponent } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// Routing
import DefaultRoute from "./DefaultRoute";
// import PrivateRoute from "./PrivateRoute";

// Pages
import { HomePage, PageNotFound } from "../../views";
import DecisionsPage from "../../views/Decisions/DecisionsPage";
import ValidationPage from "../../views/Validate/ValidationPage";
import TestingPage from "../../views/Testing/TestingPage";

class Routing extends PureComponent {
  render() {
    const { appState } = this.props;

    return (
      <Switch>
        <DefaultRoute exact path="/" component={HomePage} appState={appState} />
        <DefaultRoute
          path="/decisions"
          component={DecisionsPage}
          appState={appState}
        />
        <DefaultRoute
          path="/validate"
          component={ValidationPage}
          appState={appState}
        />
        <DefaultRoute
          path="/testing"
          component={TestingPage}
          appState={appState}
        />
        <Route component={PageNotFound} />
      </Switch>
    );
  }
}

Routing.propTypes = {
  appState: PropTypes.object
};

Routing.defaultProps = {
  appState: {}
};

export default withRouter(Routing);

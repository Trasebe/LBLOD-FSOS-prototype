// import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { Route } from "react-router-dom";
//
// class PrivateRoute extends React.Component {
//   render() {
//     const { component: Component, appState, ...rest } = this.props;
//     const shouldRedirect = true;
//
//     // if (!appState && shouldRedirect) {
//     //   return (
//     //     <React.Fragment>{window.location.replace("temp")}</React.Fragment>
//     //   );
//     // }
//
//     return (
//       <Route
//         {...rest}
//         render={props => <Component {...props} appState={appState} />}
//       />
//     );
//   }
// }
//
// PrivateRoute.propTypes = {
//   Component: PropTypes.object.isRequired,
//   appState: PropTypes.object.isRequired
// };
//
// export default PrivateRoute;

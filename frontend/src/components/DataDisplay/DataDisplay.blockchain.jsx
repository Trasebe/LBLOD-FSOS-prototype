import React from "react";
import PropTypes from "prop-types";

import "./DataDisplay.css";

const DataDisplay = ({ homescreen, asset, title, history }) => (
  <React.Fragment>
    {!(asset instanceof Array) ? (
      <React.Fragment>
        <h3>{title}</h3>
        No resource found
      </React.Fragment>
    ) : (
      <React.Fragment>
        <h3>{title}</h3>
        <table>
          <thead>
            <tr>
              <th>Resource hash</th>
              <th>Resource ID</th>
              <th>Resource type</th>
              <th>Publish status</th>
              <th>Sign status</th>
              <th>Timestamp</th>
              <th>Publisher</th>
              {/* <th>Version</th> */}
              <th>Signers</th>
            </tr>
          </thead>
          <tbody>
            {asset && !asset.msg
              ? asset.map((element, index) => (
                  <tr
                    key={`table-${index}`}
                    onClick={() => {
                      if (history) {
                        homescreen.setState({
                          id: element.id,
                          version: element.version
                        });
                      } else {
                        homescreen.setState({ id: element.id, version: "" });
                      }
                    }}
                  >
                    <td>{element.hash}</td>
                    <td>{element.id}</td>
                    <td>{element.subject}</td>
                    <td>{element.publishStatus}</td>
                    <td>{element.signStatus}</td>
                    <td>{element.timestamp}</td>
                    <td>{element.publisher.ID}</td>
                    {/* <td>{element.version}</td> */}
                    <td>
                      {element.authSignatures.map(user => (
                        <div>
                          <h4>{user.identifier}</h4>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </React.Fragment>
    )}
  </React.Fragment>
);

DataDisplay.propTypes = {
  homescreen: PropTypes.any, // eslint-disable-line
  asset: PropTypes.any, // eslint-disable-line
  title: PropTypes.string,
  history: PropTypes.bool
};

DataDisplay.defaultProps = {
  homescreen: null,
  asset: null,
  title: "",
  history: false
};

export default DataDisplay;

/*
                    <td>
                      {element.authSignatures.length === 0
                        ? "Empty"
                        : element.authSignatures}
                    </td>
                    <td>
                      {element.burnSignatures.length === 0
                        ? "Empty"
                        : element.burnSignatures}
                    </td>
                    */

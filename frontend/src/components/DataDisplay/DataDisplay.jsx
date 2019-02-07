import React from "react";
import PropTypes from "prop-types";

import { isEmpty } from "lodash";

import "./DataDisplay.css";

const DataDisplay = ({ asset, title }) => (
  <React.Fragment>
    {isEmpty(asset) ? (
      <React.Fragment>
        <h3>{title}</h3>
        No resources found
      </React.Fragment>
    ) : (
      <React.Fragment>
        <h3>{title}</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Content</th>
              <th>Hash</th>
              <th>Resource ID</th>
              <th>Resource Type</th>
              <th>Signatory</th>
              <th>timestamp</th>
              <th>Error</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {asset && !asset.msg
              ? asset.map((element, index) => (
                  <tr key={`table-${index}`}>
                    <td>{element.id}</td>
                    <td>{element.content.substring(0, 101)}...</td>
                    <td>{element.hash}</td>
                    <td>{element.resourceId}</td>
                    <td>{element.resourceType}</td>
                    <td>{element.signatory}</td>
                    <td>{element.timestamp}</td>
                    {element.hasError !== null ? (
                      <td>{element.hasError}</td>
                    ) : (
                      <td>No error</td>
                    )}
                    <td>{element.type}</td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </React.Fragment>
    )}
  </React.Fragment>
  // <div style={{ fontSize: "14px", textAlign: "left", margin: "auto" }}>
  //   <pre>{asset && JSON.stringify(asset, null, 2)}</pre>
  // </div>
);

DataDisplay.propTypes = {
  asset: PropTypes.any, // eslint-disable-line
  title: PropTypes.string
};

DataDisplay.defaultProps = {
  asset: null,
  title: ""
};

export default DataDisplay;

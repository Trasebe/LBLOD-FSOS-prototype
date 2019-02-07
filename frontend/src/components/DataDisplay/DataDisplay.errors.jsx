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
              <th>message</th>
              <th>Origin</th>
              <th>count</th>
            </tr>
          </thead>
          <tbody>
            {asset && !asset.msg
              ? asset.map((element, index) => (
                  <tr key={`table-${index}`}>
                    <td>{element.id}</td>
                    <td>{element.err}</td>
                    <td>{element.origin}</td>
                    <td>{element.count}</td>
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

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
              <th>signedResourceID</th>
              <th>hash</th>
              <th>result</th>
              <th>blockchainId</th>
              <th>hash</th>
            </tr>
          </thead>
          <tbody>
            {asset && !asset.msg
              ? asset.map((element, index) => (
                  <tr key={`table-${index}`}>
                    <td>{element.id}</td>
                    <td>{element.hash}</td>
                    <td>{element.result === true ? "OK" : "NOT OK"}</td>
                    <td>
                      {element.result === true || element.result === false
                        ? element.id
                        : ""}
                    </td>
                    <td>
                      {element.result === true || element.result === false
                        ? element.blockchainHash
                        : ""}
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
  asset: PropTypes.any, // eslint-disable-line
  title: PropTypes.string
};

DataDisplay.defaultProps = {
  asset: null,
  title: ""
};

export default DataDisplay;

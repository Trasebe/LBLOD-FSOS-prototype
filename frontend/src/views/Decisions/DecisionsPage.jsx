import React, { Component } from "react";
import { notification } from "antd";

import ChainService from "../../Services/ChainService";
import DataDisplay from "../../components/DataDisplay/DataDisplay.blockchain";

class DecisionsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      decisions: null,
      id: "",
      version: "",
      showHistory: false,
      history: []
    };

    this.chainService = new ChainService();
  }

  async componentDidMount() {
    await this.getAllDecisions();
  }

  getAllDecisions = async () => {
    const response = await this.chainService.getAll();
    this.setState({ decisions: response.result });
  };

  openNotification = (title, message) => {
    const args = {
      message: title,
      description: message,
      duration: 5
    };
    notification.open(args);
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { id, version } = this.state;
    let history;
    if (version === "") {
      history = await this.chainService.queryHistory(id);
    } else {
      history = await this.chainService.queryHistoryByVersion(id, version);
    }

    this.setState({ history: history.result, showHistory: true });
  };

  handleChangedId = event => {
    this.setState({ id: event.target.value });
  };

  handleChangedVersion = event => {
    this.setState({ version: event.target.value });
  };

  render() {
    const { decisions, showHistory, id, version, history } = this.state;

    return (
      <div>
        {decisions ? (
          <h4>
            {" "}
            amount published decisions on the blockchain:{" "}
            {decisions.length || 0}{" "}
          </h4>
        ) : null}
        <DataDisplay
          homescreen={this}
          asset={decisions}
          title="published resources on the blockchain"
        />
        <br />
        <br />
        <br />
        <h3>Query history of resource</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="id">
            ID:
            <input
              style={{ marginLeft: 10, marginRight: 10 }}
              type="text"
              value={id}
              onChange={this.handleChangedId}
            />
          </label>
          <label htmlFor="id">
            Version:
            <input
              style={{ marginLeft: 10, marginRight: 10 }}
              type="text"
              value={version}
              onChange={this.handleChangedVersion}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <br />
        {showHistory ? (
          <DataDisplay
            homescreen={this}
            asset={history}
            title="History"
            history={showHistory}
          />
        ) : null}
      </div>
    );
  }
}

export default DecisionsPage;

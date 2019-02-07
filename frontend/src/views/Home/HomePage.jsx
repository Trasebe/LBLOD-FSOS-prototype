/* eslint-disable react/sort-comp */
import React, { Component } from "react";
import uuid from "uuid/v4";

import ChainService from "../../Services/ChainService";
import AuthService from "../../Services/AuthService";
import SignService from "../../Services/SignService";
// import DataDisplay from "../../components/DataDisplay/DataDisplay";
// import DataDisplayErrors from "../../components/DataDisplay/DataDisplay.errors";

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: null,
      cert: null,
      unsignedProposal: null,
      unsignedTransaction: null,
      unsignedEvent: null,
      statusCode: null,
      reqId: null
    };

    this.chainService = new ChainService();
    this.authService = new AuthService();
  }

  generateCerts = async () => {
    const { key, cert } = await this.authService.generateCerts(
      `user${Math.random()}`
    );
    this.setState({ key, cert });
  };

  getUnsignedProposal = async () => {
    const { cert } = this.state;
    const reqId = uuid();
    const { unsignedProposal } = await this.chainService.getUnsignedProposal(
      cert,
      reqId
    );

    this.setState({ unsignedProposal: Buffer.from(unsignedProposal), reqId });
  };

  getUnsignedTransaction = async () => {
    const { unsignedProposal, key, reqId } = this.state;
    const signedProposal = SignService.signProposal(unsignedProposal, key);

    const {
      unsignedTransaction
    } = await this.chainService.getUnsignedTransaction(signedProposal, reqId);

    this.setState({ unsignedTransaction: Buffer.from(unsignedTransaction) });
  };

  sendTransaction = async () => {
    const { unsignedTransaction, key, cert, reqId } = this.state;
    const signedTransaction = SignService.signProposal(
      unsignedTransaction,
      key
    );

    const { unsignedEvent } = await this.chainService.sendTransaction(
      signedTransaction,
      cert,
      reqId
    );
    this.setState({ unsignedEvent: Buffer.from(unsignedEvent) });
  };

  signEventProposal = async () => {
    const { unsignedEvent, key, reqId } = this.state;
    const signedEvent = SignService.signProposal(unsignedEvent, key);

    const { statusCode } = await this.chainService.signEventProposal(
      signedEvent,
      reqId
    );
    this.setState({ statusCode });
  };

  render() {
    const {
      key,
      cert,
      unsignedProposal,
      unsignedTransaction,
      unsignedEvent,
      statusCode
    } = this.state;

    return (
      <div>
        <h1>Front side signing prototype</h1>
        <div style={{ marginTop: 30 }}>
          <button
            style={{ marginRight: 10 }}
            type="button"
            onClick={this.generateCerts}
          >
            GenerateCerts
          </button>
          <br />
          <br />
          <pre>{key && JSON.stringify(key, null, 2)}</pre>
          <pre>{cert && JSON.stringify(cert, null, 2)}</pre>
        </div>
        <div style={{ marginTop: 30 }}>
          <button
            style={{ marginRight: 10 }}
            type="button"
            onClick={this.getUnsignedProposal}
          >
            getUnsignedProposal
          </button>
          <br />
          <br />
          <pre>{unsignedProposal}</pre>
        </div>
        <div style={{ marginTop: 30 }}>
          <button
            style={{ marginRight: 10 }}
            type="button"
            onClick={this.getUnsignedTransaction}
          >
            getUnsignedTransaction
          </button>
          <br />
          <br />
          <pre>{unsignedTransaction}</pre>
        </div>
        <div style={{ marginTop: 30 }}>
          <button
            style={{ marginRight: 10 }}
            type="button"
            onClick={this.sendTransaction}
          >
            sendTransaction
          </button>
          <br />
          <br />
          <pre>{unsignedEvent}</pre>
        </div>
        <div style={{ marginTop: 30 }}>
          <button
            style={{ marginRight: 10 }}
            type="button"
            onClick={this.signEventProposal}
          >
            signEventProposal
          </button>
          <br />
          <br />
          <pre>{statusCode}</pre>
        </div>
      </div>
    );
  }
}

export default HomePage;

import httpStatus from "http-status";
import { isBuffer } from "lodash";

import network from "./network.service";
import logger from "../../config/Log";
import * as labels from "../../config/labels";
import config from "../../config/config";

export default class ChaincodeService {
  constructor() {
    this.fabricClient = null;
    this.channel = null;
    this.eventHub = null;
  }

  prepareRequest = (fcn, args, invocation = true) => {
    this.fabricClient = network.getFabricClient();
    this.channel = network.getChannel();

    const request = {
      chaincodeId: config.CHAINCODE_NAME,
      fcn,
      args
    };

    if (invocation) {
      const txId = this.fabricClient.newTransactionID();
      return Object.assign(request, { txId, chainId: config.CHANNEL_NAME });
    }

    return request;
  };

  query = async request => {
    const queryResult = await this.channel.queryByChaincode(request);

    for (const response of queryResult) {
      if (!isBuffer(response)) {
        throw new Error(
          `Error from query: ${response.message} `,
          httpStatus.NOT_FOUND,
          true
        );
      }
    }
    return JSON.parse(queryResult.toString());
  };

  invoke = async request => {
    const [
      proposalResponses,
      proposal
    ] = await this.channel.sendTransactionProposal(request);

    for (const response of proposalResponses) {
      if (response.response?.status !== 200) {
        throw new Error(response.message);
      }
    }

    const transaction = await this.channel.sendTransaction({
      proposalResponses,
      proposal
    });

    const eventResult = await this.processTxEvent(
      request.txId.getTransactionID(),
      transaction
    );

    return {
      ...eventResult,
      ...transaction
    };
  };

  processTxEvent = txId =>
    new Promise((resolve, reject) => {
      this.eventHub = network.getEventHub();
      this.eventHub.connect();
      this.eventHub.registerTxEvent(
        txId,
        (tx, statusCode) => {
          this.eventHub.unregisterTxEvent(txId);
          this.eventHub.disconnect();

          if (statusCode !== "VALID") {
            return reject(
              new Error(
                `Problem with the tranaction, event status ::${statusCode}`
              )
            );
          }

          logger.info({
            label: labels.TRANSACTION,
            message: `The transaction has been committed on peer ${
              this.eventHub._peer._endpoint.addr
            }`
          });

          resolve({
            statusCode,
            tx
          });
        },
        err => {
          this.eventHub.disconnect();
          return reject(
            new Error(`There was a problem with the eventhub ::${err}`)
          );
        }
      );
    });
}

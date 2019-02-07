import httpStatus from "http-status";
import { isEmpty } from "lodash";

import network from "../../services/network.service";

const currentBuffers = [];

const processTxEvent = (txId, { signedEvent = {} }) =>
  new Promise((resolve, reject) => {
    const channel = network.getChannel();
    const targets = channel.getPeers().map(peer => peer.getPeer());
    const eventHub = channel.newChannelEventHub(targets[0]);

    if (!isEmpty(signedEvent)) {
      eventHub.connect({
        signedEvent
      });
    } else {
      eventHub.connect();
    }

    eventHub.registerTxEvent(
      txId,
      (tx, statusCode) => {
        eventHub.unregisterTxEvent(txId);
        eventHub.disconnect();

        if (statusCode !== "VALID") {
          return reject(
            new Error(
              `Problem with the tranaction, event status ::${statusCode}`
            )
          );
        }

        resolve({
          statusCode,
          tx
        });
      },
      err => {
        eventHub.disconnect();
        return reject(
          new Error(`There was a problem with the eventhub ::${err}`)
        );
      }
    );
  });

const getUnsignedProposal = async (req, res) => {
  try {
    const { cert, reqId } = req.body;
    const channel = network.getChannel();

    const request = {
      channelId: channel._name,
      chaincodeId: "MyChainCode",
      fcn: "recordWatch",
      args: [
        JSON.stringify({
          id: `insert${Math.random()}`,
          brand: "kek",
          movement: "here",
          owner: "I"
        })
      ]
    };

    const unsignedProposal = await channel.generateUnsignedProposal(
      request,
      "Org1MSP",
      cert
    );

    currentBuffers[reqId] = {
      currentUnsignedProposal: unsignedProposal.proposal,
      currentTxId: unsignedProposal.txId
    };

    return res.status(httpStatus.OK).json({
      unsignedProposal: unsignedProposal.proposal.toBuffer()
    });
  } catch (e) {
    throw new Error(`getUnsignedProposal: ${e}`);
  }
};

const getUnsignedTransaction = async (req, res) => {
  try {
    const { signedProposal, reqId } = req.body;

    const newSig = Buffer.from(signedProposal.signature);
    const newProposal = Buffer.from(signedProposal.proposal_bytes);
    signedProposal.signature = newSig;
    signedProposal.proposal_bytes = newProposal;

    const channel = network.getChannel();

    const targets = channel.getPeers().map(peer => peer.getPeer());
    const sendSignedProposalReq = {
      signedProposal,
      targets
    };

    const proposalResponses = await channel.sendSignedProposal(
      sendSignedProposalReq
    );

    for (const response of proposalResponses) {
      if (response.response) {
        if (response.response.status !== 200) {
          throw new Error(response.message);
        }
      } else {
        throw new Error(response.message);
      }
    }

    const commitReq = {
      proposalResponses,
      proposal: currentBuffers[reqId].currentUnsignedProposal
    };

    const commitProposal = await channel.generateUnsignedTransaction(commitReq);

    const currentBuffer = currentBuffers[reqId];
    currentBuffer.currentCommitRequest = commitReq;

    return res
      .status(httpStatus.OK)
      .json({ unsignedTransaction: commitProposal.toBuffer() });
  } catch (e) {
    throw new Error(`getUnsignedTransaction: ${e}`);
  }
};

const sendTransaction = async (req, res) => {
  try {
    const { signedTransaction, cert, reqId } = req.body;

    const channel = network.getChannel();

    const newSig = Buffer.from(signedTransaction.signature);
    const newProposal = Buffer.from(signedTransaction.proposal_bytes);
    signedTransaction.signature = newSig;
    signedTransaction.proposal_bytes = newProposal;

    const response = await channel.sendSignedTransaction({
      signedProposal: signedTransaction,
      request: currentBuffers[reqId].currentCommitRequest
    });

    if (response.status !== "SUCCESS") {
      throw new Error("Something went wrong");
    }

    const targets = channel.getPeers().map(peer => peer.getPeer());
    const eventHub = channel.newChannelEventHub(targets[0]);
    const unsignedEvent = await eventHub.generateUnsignedRegistration({
      certificate: cert,
      mspId: "Org1MSP"
    });

    return res.status(httpStatus.OK).json({
      unsignedEvent
    });
  } catch (e) {
    throw new Error(`sendTransaction: ${e}`);
  }
};

const signEventProposal = async (req, res) => {
  try {
    const { signedEvent, reqId } = req.body;

    const newSig = Buffer.from(signedEvent.signature);
    const newProposal = Buffer.from(signedEvent.proposal_bytes);
    signedEvent.signature = newSig;
    signedEvent.proposal_bytes = newProposal;

    const signedEventObject = {
      signature: signedEvent.signature,
      payload: signedEvent.proposal_bytes
    };

    const { statusCode } = await processTxEvent(
      currentBuffers[reqId].currentTxId.getTransactionID(),
      {
        signedEvent: signedEventObject
      }
    );

    delete currentBuffers[reqId];

    return res.status(httpStatus.OK).json({
      statusCode
    });
  } catch (e) {
    throw new Error(`signEventProposal: ${e}`);
  }
};

export default {
  getUnsignedProposal,
  getUnsignedTransaction,
  sendTransaction,
  signEventProposal
};

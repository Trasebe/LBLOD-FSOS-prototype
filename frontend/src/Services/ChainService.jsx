import Connection, { setAuthToken } from "../__helpers__/Connection";

export default class ChainService {
  // "http://localhost:3000"
  constructor(baseUrl = "http://localhost:3000") {
    this.connection = new Connection(baseUrl);
  }

  setAuthToken = token => {
    setAuthToken(token);
  };

  getUnsignedProposal = (cert, reqId) =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`offline/getUnsignedProposal`, { cert, reqId })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  getUnsignedTransaction = (signedProposal, reqId) =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`offline/getUnsignedTransaction`, { signedProposal, reqId })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  sendTransaction = (signedTransaction, cert, reqId) =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`offline/sendTransaction`, { signedTransaction, cert, reqId })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  signEventProposal = (signedEvent, reqId) =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`offline/signEventProposal`, { signedEvent, reqId })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  /*
  ========================
    User management
  ========================
  */

  register = user =>
    new Promise((resolve, reject) => {
      this.connection
        .post("/auth/register", user)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });

  login = user =>
    new Promise((resolve, reject) => {
      this.connection
        .post("/auth/login", user)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
}

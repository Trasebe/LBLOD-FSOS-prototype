import Connection from "../__helpers__/Connection";

export default class AuthService {
  constructor(baseUrl = "http://localhost:3000") {
    this.connection = new Connection(baseUrl);
  }

  generateCerts = username =>
    new Promise((resolve, reject) => {
      this.connection
        .post(`auth/generateCerts`, { username })
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
}

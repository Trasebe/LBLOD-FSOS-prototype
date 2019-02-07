import axios from "axios";

let currentConnection = null;
let currentToken = null;

export default function Connection(baseURL, token = "", headers = null) {
  currentToken = token;
  currentConnection = axios.create({
    baseURL,
    timeout: 12000,
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
      // 'X-Access-Token': currentToken
    }
  });

  currentConnection.interceptors.response.use(
    response => response,
    error =>
      // Only send the response
      Promise.reject(error.response)
  );

  return currentConnection;
}

export function getConnection() {
  if (currentConnection) return currentConnection;
  throw new Error("Missing connection");
}

export function getToken() {
  if (currentConnection) return currentToken;
  throw new Error("Missing connection");
}

export function setAuthToken(token) {
  currentConnection.defaults.headers.common.Authorization = `Bearer ${token}`;
}

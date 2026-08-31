import axios from "axios";

const client = axios.create({
  baseURL: "http://TU_IP_LOCAL:3000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

export default client;

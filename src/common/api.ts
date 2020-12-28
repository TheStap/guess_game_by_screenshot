import axios from "axios";
import config from "../config";

const api = axios.create({
    baseURL: config.baseURL,
    params: { key: config.apiKey }
})

export default api;
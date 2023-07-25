import axios from "axios";

export default axios.create({
    baseURL: "https://test-ml-api.onrender.com/api",
    // baseURL: "http://192.168.43.74:5000/api",
})
import axios from "axios";

export default axios.create({
  baseURL: "https://farm-vision.onrender.com/api",
  // baseURL: "http://192.168.43.29:8888/api",
});

import { atom } from "recoil";
import getCookie from "../hooks/getCookie";

const authState = atom({
  key: "authState",
  default: JSON.parse(sessionStorage.getItem("userIn")) || null,
});

export default authState;

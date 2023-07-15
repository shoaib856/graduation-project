import { atom } from "recoil";

const authState = atom({
  key: "authState",
  default: JSON.parse(localStorage.getItem("userIn")) || null,
});

export default authState;

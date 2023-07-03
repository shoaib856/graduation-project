import { atom, useRecoilState, useRecoilValue } from "recoil";

const userData = atom({
  key: "userData",
  default: null,
});

export const handleUserData = () => useRecoilState(userData);
export const useUserData = () => useRecoilValue(userData);

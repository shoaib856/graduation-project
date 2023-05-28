import { atom, useRecoilState, useRecoilValue } from "recoil";

const userImg = atom({
  key: "userImg",
  default: null,
});

export const setUserImage = () => useRecoilState(userImg);
export const useUserImage = () => useRecoilValue(userImg);

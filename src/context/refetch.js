import { atom, useRecoilState, useRecoilValue } from "recoil";

const refetch = atom({
  key: "refetchState",
  default: false,
});

export const useRefetchState = () => useRecoilState(refetch);
export const refetchValue = () => useRecoilValue(refetch);

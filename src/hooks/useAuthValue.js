import { useRecoilValue } from "recoil";
import authState from "../context/auth";

const useAuthValue = () => useRecoilValue(authState);

export default useAuthValue;

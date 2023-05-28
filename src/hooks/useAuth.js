import { useRecoilState } from "recoil";
import authState from "../context/auth";

const useAuth = () => useRecoilState(authState);

export default useAuth;

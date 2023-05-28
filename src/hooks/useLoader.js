import { useRecoilState } from "recoil";
import load from "../context/loading";

const useLoader = () => useRecoilState(load);

export default useLoader;

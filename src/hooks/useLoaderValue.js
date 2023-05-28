import { useRecoilValue } from "recoil";
import load from "../context/loading";

const useLoaderValue = () => useRecoilValue(load);

export default useLoaderValue;

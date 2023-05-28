import { ThreeCircles } from "react-loader-spinner";

function Loader() {
  return (
    <div className=" loader">
      <ThreeCircles height="150" width="150" color="#34d399" visible={true} />
    </div>
  );
}

export default Loader;

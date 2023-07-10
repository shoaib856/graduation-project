import { useEffect, useState } from "react";

import { ButtonGroup, Dropdown, Form } from "react-bootstrap";
import Btn from "../components/button";

// import { showResult } from "../components/showResult";

import { toastMsg } from "../components/message-toast";
import axios from "axios";
import useAuthValue from "../hooks/useAuthValue.js";
import { Plus, PlusCircle } from "react-bootstrap-icons";
import { useFormik } from "formik";
import DisplayResults from "../components/DisplayResults";
import ShowImage from "../components/ShowImage";

function PlantDiseaseApp() {
  document.title = "Farm Vision | App";
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [resultImg, setResultImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuthValue();
  const [isHover, setIsHover] = useState(false);
  const formik = useFormik({
    initialValues: {
      image: null,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const diseaseDetectionModel = async () => {
    console.log("test...");
    await axios
      .post(
        "https://test-ml-api.onrender.com/api/imagesModel/diseaseDetection",
        { image, "x-auth-token": auth.token },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log("res");
        console.log(res.data);
        setResult(res.data);
        // setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="text-xl w-full text-left bg-white shadow-lg text-emerald-900">
      <h1 className="pl-2 pt-2 text-3xl md:text-xl font-bold border-b-2 border-emerald-500">
        Application
      </h1>
      {result && <DisplayResults result={result} />}
      <form className="p-7 w-fit mx-auto flex flex-col gap-5">
        <ShowImage width60={true} image={image} setImage={setImage} />
        <Dropdown as={ButtonGroup} className="flex justify-center">
          <button
            type="button"
            className="form-btn !rounded-r-none !flex-1"
            onClick={diseaseDetectionModel}
            disabled={loading}
          >
            {loading ? "Loading..." : "Detect Disease in Plant"}
          </button>
          <Dropdown.Toggle
            as={"button"}
            split
            type="button"
            className="form-btn !rounded-l-none"
            id="dropdown-split-basic"
          ></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              className="active:bg-slate-200 text-black"
              onClick={() => {}}
            >
              Action
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </form>
    </div>
  );
}

export default PlantDiseaseApp;

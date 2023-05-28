import { useEffect, useState } from "react";

import { ButtonGroup, Form } from "react-bootstrap";
import Btn from "../components/button";

// import { showResult } from "../components/showResult";

import axios from "axios";
import { toastMsg } from "../components/message-toast";

function PlantDiseaseApp() {
  const [img, setImg] = useState(null);
  const [result, setResult] = useState(null);
  const [resultImg, setResultImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const process = async (modelType) => {
    if (document.getElementById("image").files[0] === undefined);
      // errorMsg("Please, Choose Some Image");
    else {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", document.getElementById("image").files[0]);
      axios
        .post(`http://localhost:3001/${modelType}`, formData)
        .then((res) => {
          modelType == "modelv2" &&
            axios
              .get(
                "http://192.168.0.101:3001/modelv2image/" + res.data["image"],
                {
                  responseType: "blob",
                }
              )
              .then((blob) => setResultImg(blob.data))
              .catch((e) => toastMsg("error", e.toString()));
          setResult(res.data);
        })
        .catch((e) => toastMsg("error", e.toString()))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    // result !== null &&
    //   showResult(setResult, result, setResultImg, resultImg, img);
  }, []);

  return (
    <Form className="text-xl min-w-lg p-10 text-left bg-white rounded-lg shadow-lg text-emerald-900">
      <h1 className=" text-5xl font-bold mb-12">Identify Your Plant</h1>
      {img && (
        <div className="max-w-lg mb-12">
          <img
            className="mx-auto"
            src={URL.createObjectURL(img)}
            alt="not fount"
          />
        </div>
      )}
      <Form.Control
        type="file"
        className="!bg-emerald-800 text-white hover:bg-emerald-500 disabled:bg-black mb-12 focus:bg-emerald-500 focus:shadow-none focus:border-none"
        name="image"
        id="image"
        accept=".jpeg, .jpg"
        onChange={(e) => setImg(e.target.files[0])}
        disabled={loading}
      />
      <ButtonGroup className="flex justify-center">
        <Btn isLoading={loading} model={process} modelType={"modelv1"} />
        <Btn isLoading={loading} model={process} modelType={"modelv2"} />
      </ButtonGroup>
    </Form>
  );
}

export default PlantDiseaseApp;

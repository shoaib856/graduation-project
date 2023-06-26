import { useEffect, useState } from "react";

import { ButtonGroup, Form } from "react-bootstrap";
import Btn from "../components/button";

// import { showResult } from "../components/showResult";

import { toastMsg } from "../components/message-toast";
import axios from "axios";
import useAuthValue from "../hooks/useAuthValue.js";

function PlantDiseaseApp() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [resultImg, setResultImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuthValue();

  const diseaseDetectionModel = async () => {
    console.log("test...");
    await axios
      .post(
        "https://test-ml-api.onrender.com/api/imagesModel/diseaseDetection",
        image,
        {
          headers: {
            "x-auth-token": auth.token,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        console.log(res);
        // setResult(res.data);
        // setLoading(false);
      });
  };

  useEffect(() => {
    // result !== null &&
    //   showResult(setResult, result, setResultImg, resultImg, img);
  }, []);

  return (
    <Form className="text-xl min-w-lg p-10 text-left bg-white rounded-lg shadow-lg text-emerald-900">
      <h1 className=" text-5xl font-bold mb-12">Identify Your Plant</h1>
      {image && (
        <div className="max-w-lg mb-12">
          <img
            className="mx-auto"
            src={URL.createObjectURL(image)}
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
        onChange={(e) => setImage(e.target.files[0])}
        disabled={loading}
      />
      <ButtonGroup className="flex justify-center">
        <Btn
          isLoading={loading}
          model={diseaseDetectionModel}
          modelType={"modelv1"}
        />
        <Btn
          isLoading={loading}
          model={diseaseDetectionModel}
          modelType={"modelv2"}
        />
      </ButtonGroup>
    </Form>
  );
}

export default PlantDiseaseApp;

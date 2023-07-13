import React, { useEffect, useState } from "react";
import MarkMultiItems from "../components/MarkMultiItems";
import axios from "../api/axios";
import { Alert, Badge, Card, ListGroup } from "react-bootstrap";
import { useFormik } from "formik";
import useAuthValue from "../hooks/useAuthValue";
import { Link } from "react-router-dom";
import CustomizedAlert from "../components/CustomizedAlert";
import RefreshBtn from "../components/RefreshBtn";
import { loadStripe } from "@stripe/stripe-js";

import { Camera2, CameraVideoFill, TagFill } from "react-bootstrap-icons";

const Pricing = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [publishable_key, setPublishable_key] = useState(null);
  const [empty, setEmpty] = useState(false);

  const auth = useAuthValue();
  const formik = useFormik({
    initialValues: {
      features: [],
    },
    onSubmit: async (values) => {
      const stripe = await loadStripe(publishable_key);
      const headers = {
        "Content-Type": "application/json",
        "x-auth-token": auth.token,
      };

      await axios
        .post("/subscribe", values, { headers })
        .then((res) => {
          stripe.redirectToCheckout({
            sessionId: res.data.sessionId,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });
  const getFeatures = async () => {
    setLoading(true);
    await axios
      .get("/feature/getUnsubscribedFeatures", {
        headers: { "x-auth-token": auth.token },
      })
      .then((res) => {
        setLoading(false);
        setRefetch(false);
        setFeatures(res.data.data);
        setEmpty(res.data.data.length === 0);
      })
      .catch((err) => {
        setRefetch(false);
        setLoading(false);
        console.error(err);
      });
  };
  useEffect(() => {
    auth && getFeatures();
  }, [auth, refetch]);
  const getPublishableKey = () => {
    axios
      .get("/subscribe/getPublishabeKey", {
        headers: { "x-auth-token": auth.token },
      })
      .then((res) => {
        setPublishable_key(res.data.key);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    auth && getPublishableKey();
  }, [auth]);

  return (
    <div className="flex flex-col gap-16 self-start max-w-4xl w-full bg-white rounded-lg p-4">
      <div className="flex items-center justify-between border-b-2 border-emerald-600">
        <div className="flex flex-wrap">
          <h1 className="text-3xl">Pricing</h1>
          <sub className="self-end text-sm text-gray-500">
            (purchase features every month)
          </sub>
        </div>
        <RefreshBtn refetch={refetch} setRefetch={setRefetch} />
      </div>
      {loading ? (
        <CustomizedAlert msg={"Loading..."} variant={"info"} spinner />
      ) : empty ? (
        <Alert variant="warning" className="font-medium flex gap-2">
          You have subscribed to all features this month
          <Link to="/profile/payments" className="underline">
            Go to Payments
          </Link>
        </Alert>
      ) : (
        <div className="flex flex-wrap gap-2 justify-center">
          {features.map((feature) => {
            return (
              <label
                key={feature.id}
                className={`${
                  formik.values["features"].includes(feature.feature)
                    ? "!border-teal-600 shadow-lg"
                    : ""
                } relative max-w-[200px] sm:max-w-full w-full border bottom-0 hover:!bottom-2 hover:shadow-lg rounded !transition-all duration-1000 cursor-pointer flex flex-col items-center !p-4 gap-4`}
              >
                <div className="flex justify-center items-center text-5xl w-16 h-16 border !border-emerald-600 rounded p-1 ">
                  {feature.type === "video" ? (
                    <CameraVideoFill className="text-cyan-600" />
                  ) : feature.type === "image" ? (
                    <Camera2 className="text-indigo-600" />
                  ) : (
                    <TagFill className="text-emerald-600" />
                  )}
                </div>

                <input
                  type="checkbox"
                  className="hidden"
                  id={feature.feature}
                  name="features"
                  {...formik.getFieldProps("features")}
                  value={feature.feature}
                  checked={formik.values["features"].includes(feature.feature)}
                />
                <div className="flex flex-col items-center  gap-4">
                  <h2 className="text-teal-600 text-xl uppercase font-medium">
                    {feature.feature}
                  </h2>
                  <div className="absolute top-2 right-2">
                    <Badge className="!bg-emerald-400">${feature.price}</Badge>
                  </div>
                  <p className="first-letter:uppercase text-center">
                    {feature.describtion.split("\n").map((line, i) => {
                      return (
                        <span className="block break-words break-all" key={i}>
                          {line}
                        </span>
                      );
                    })}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      )}

      <button
        onClick={formik.handleSubmit}
        type="button"
        className="form-btn"
        disabled={formik.isSubmitting || !formik.values.features.length}
      >
        Buy
      </button>
    </div>
  );
};

export default Pricing;

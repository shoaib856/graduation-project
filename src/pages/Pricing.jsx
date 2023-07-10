import React, { useEffect, useState } from "react";
import MarkMultiItems from "../components/MarkMultiItems";
import axios from "../api/axios";
import { Alert, ListGroup } from "react-bootstrap";
import { useFormik } from "formik";
import useAuthValue from "../hooks/useAuthValue";
import { Link } from "react-router-dom";
import CustomizedAlert from "../components/CustomizedAlert";
import RefreshBtn from "../components/RefreshBtn";
import { loadStripe } from "@stripe/stripe-js";

const Pricing = () => {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [publishable_key, setPublishable_key] = useState(null);

  const auth = useAuthValue();
  const formikProps = useFormik({
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
          console.log(err);
        });
    },
  });
  const getFeatures = async () => {
    setLoading(true);
    await axios
      .get("/feature", { headers: { "x-auth-token": auth.token } })
      .then((res) => {
        setLoading(false);
        setFeatures(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
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
    <div className="flex flex-col gap-3 self-start max-w-4xl w-full bg-white rounded-lg p-4">
      <div className="flex items-center justify-between border-b-2 border-emerald-600">
        <legend>Features</legend>
        <RefreshBtn refetch={refetch} setRefetch={setRefetch} />
      </div>
      <ListGroup>
        {loading ? (
          <CustomizedAlert msg={"loading..."} spinner variant={"info"} />
        ) : features.length > 0 ? (
          features.map((feature) => {
            return (
              <MarkMultiItems
                key={feature.id}
                formikProps={formikProps.getFieldProps}
                itemDescription={feature.describtion}
                itemName={feature.feature}
                itemType={"features"}
                itemPrice={feature.price}
                formikValues={formikProps.values}
              />
            );
          })
        ) : (
          <Alert variant="warning" className="border-l-8 border-l-orange-500">
            No Features Till Now!
            <RefreshBtn setRefetch={setRefetch} refetch={refetch} />
          </Alert>
        )}
      </ListGroup>
      <button
        onClick={formikProps.handleSubmit}
        type="button"
        className="form-btn"
        disabled={
          formikProps.isSubmitting || !formikProps.values.features.length
        }
      >
        Buy
      </button>
    </div>
  );
};

export default Pricing;

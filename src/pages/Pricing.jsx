import React, { useEffect, useState } from "react";
import MarkMultiItems from "../components/MarkMultiItems";
import axios from "../api/axios";
import { Alert, ListGroup } from "react-bootstrap";
import { useFormik } from "formik";
import useAuthValue from "../hooks/useAuthValue";

const Pricing = () => {
  const [features, setFeatures] = useState([]);
  const auth = useAuthValue();
  const formikProps = useFormik({
    initialValues: {
      features: [],
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const getFeatures = async () => {
    await axios
      .get("/feature", { headers: { "x-auth-token": auth.token } })
      .then((res) => {
        setFeatures(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    auth && getFeatures();
  }, [auth]);

  return (
    <fieldset className="max-w-4xl w-full flex flex-col gap-3 bg-white rounded-lg p-4">
      <legend>Features</legend>
      <ListGroup>
        {features.length > 0 ? (
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
    </fieldset>
  );
};

export default Pricing;

import React, { useEffect, useState } from "react";
import { Alert, Badge, Container, Form } from "react-bootstrap";
import InputField from "./inputField";
import { useFormik } from "formik";
import axios from "../api/axios";
const AddItem = ({
  setItems,
  setEmpty,
  setError,
  setRefetch,
  refetch,
  type,
  initialValues,
  validationSchema,
  auth,
  error,
}) => {
  const [msg, setMsg] = useState("");
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      type === "feature"
        ? (values = { ...values, price: values.price.toString() })
        : null;
      try {
        await axios
          .post(`/${type}`, values, {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": auth.token,
            },
          })
          .then(() => {
            setRefetch(true);
            formik.resetForm();
            setMsg(`${type.at(0).toUpperCase() + type.slice(1)} added`);
          });
      } catch (err) {
        setMsg("Something went wrong, please try again later");
      }
    },
  });

  const getData = async () => {
    await axios
      .get(`/${type}`, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then((res) => {
        setItems(res.data.data);
        res.data.data.length === 0 ? setEmpty(true) : setEmpty(false);
        setRefetch(false);
      })
      .catch((err) => {
        setError(true);
        setMsg("Something went wrong, please try again later");
      });
  };

  useEffect(() => {
    getData();
  }, [auth, refetch]);
  useEffect(() => {
    if (msg) {
      setTimeout(() => {
        setMsg("");
      }, 3000);
    }
  }, [msg]);
  return (
    <>
      <Alert
        variant="light"
        className="!pl-3 text-2xl text-emerald-600 flex items-center justify-between"
      >
        <p>Add {type.at(0).toUpperCase() + type.slice(1)}</p>
        {msg ? (
          <Badge className="text-xs" bg={error ? "danger" : "success"}>
            {msg}
          </Badge>
        ) : null}
      </Alert>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-1 text-lg"
      >
        <InputField
          Label="Name"
          type="text"
          placeholder="Enter name"
          id={type}
          formikProps={formik.getFieldProps}
          errors={formik.errors}
          touched={formik.touched}
        />
        <Form.Group className="mb-2">
          <Container fluid className="flex justify-between items-center pb-1">
            <label htmlFor="describtion">Description</label>
            {formik.errors.describtion && formik.touched.describtion ? (
              <Badge bg="danger">{formik.errors.describtion}</Badge>
            ) : null}
          </Container>
          <Form.Control
            as="textarea"
            rows={3}
            className="form-field"
            placeholder="Enter describtion"
            id="describtion"
            {...formik.getFieldProps("describtion")}
          />
        </Form.Group>

        {type === "feature" ? (
          <InputField
            Label="Price"
            type="number"
            placeholder="Enter price"
            id="price"
            formikProps={formik.getFieldProps}
            errors={formik.errors}
            touched={formik.touched}
          />
        ) : null}

        <button
          type="submit"
          className="form-btn"
          disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
        >
          {formik.isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default AddItem;

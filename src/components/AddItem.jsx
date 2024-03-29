import React, { useEffect, useState } from "react";
import { Badge, Container, Form, Modal } from "react-bootstrap";
import InputField from "./inputField";
import { useFormik } from "formik";
import axios from "../api/axios";
import { XCircleFill } from "react-bootstrap-icons";
const AddItem = ({
  setRefetch,
  type,
  initialValues,
  validationSchema,
  auth,
  show,
  setShow,
  request = false,
}) => {
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(false);
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      type === "feature"
        ? (values = { ...values, price: values.price.toString() })
        : null;
      try {
        await axios
          .post(
            `/${request && type === "tag" ? type + "/addTagRequest" : type}`,
            values,
            {
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": auth.token,
              },
            }
          )
          .then(() => {
            setRefetch ? setRefetch(true) : "";
            setError(false);
            formik.resetForm();
            setMsg(
              `${type?.at(0).toUpperCase() + type?.slice(1)}${
                request ? " Request" : ""
              } added`
            );
            setShow(false);
          });
      } catch (err) {
        setError(true);
        console.log(err);
        setMsg(err.response.data.message);
      }
    },
  });

  const onHide = () => {
    setShow(false);
    formik.resetForm();
  };

  useEffect(() => {
    if (msg) {
      setTimeout(() => {
        setMsg("");
      }, 2000);
    }
  }, [msg]);

  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Modal.Title>
            {request ? "Request" : "Add"}{" "}
            {type?.at(0).toUpperCase() + type?.slice(1)}
          </Modal.Title>
          {msg ? (
            <Badge className="text-xs" bg={error ? "danger" : "success"}>
              {msg}
            </Badge>
          ) : null}
        </div>
        <XCircleFill className="close-btn" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <InputField
          Label="Name"
          type="text"
          placeholder="Enter name"
          id={type}
          formikProps={formik.getFieldProps}
          errors={formik.errors}
          touched={formik.touched}
        />
        {type === "feature" ? (
          <>
            <InputField
              Label="Price"
              type="number"
              placeholder="Enter price"
              id="price"
              formikProps={formik.getFieldProps}
              errors={formik.errors}
              touched={formik.touched}
            />
            <Form.Group className="mb-3" controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Select
                className="form-field"
                {...formik.getFieldProps("type")}
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
          </>
        ) : null}
        <InputField
          Label="Description"
          type="text"
          placeholder="Enter description"
          id="describtion"
          formikProps={formik.getFieldProps}
          errors={formik.errors}
          touched={formik.touched}
          as={"textarea"}
        />
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          onClick={formik.handleSubmit}
          className="form-btn w-full"
          disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
        >
          {formik.isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddItem;

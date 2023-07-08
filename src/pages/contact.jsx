import { Badge, Container, Form } from "react-bootstrap";
import InputField from "../components/inputField";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";

function Contact() {
  const auth = useAuthValue();
  const [successMsg, setSuccessMsg] = useState(null);
  const formik = useFormik({
    initialValues: {
      title: "",
      type: "error",
      describtion: "",
    },
    onSubmit: (values) => {
      axios
        .post(`/report`, values, {
          headers: {
            "x-auth-token": auth.token,
          },
        })
        .then(() => {
          setSuccessMsg("Done");
          formik.resetForm();
        })
        .catch((err) => {
          console.log(err);
          setSuccessMsg("Error");
        });
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Required")
        .min(5, "Too Short!")
        .max(30, "Too Long!"),
      describtion: Yup.string()
        .required("Required")
        .min(10, "Too Short!")
        .max(1000, "Too Long!"),
      type: Yup.string().required("Required"),
    }),
  });
  useEffect(() => {
    if (successMsg) {
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    }
  }, [successMsg]);

  return (
    <Container className="py-4">
      <div className="mb-3">
        <h1 className="flex items-center gap-2 text-4xl font-bold border-b-2 mb-2 pb-2 border-emerald-500">
          Contact Us
          <Badge
            bg={successMsg === "Done" ? "success" : "danger"}
            className="!text-sm"
          >
            {successMsg}
          </Badge>
        </h1>
        <div className="flex items-center gap-2 text-sm">
          <Badge className="!bg-emerald-500 text-white">Note</Badge>
          <p className="text-gray-500">
            If you have any questions or suggestions, please contact us using
            the form below.
          </p>
        </div>
      </div>
      <div className="max-w-2xl mx-auto p-3 rounded-lg bg-white flex flex-col gap-2">
        <InputField
          Label="Title"
          type={"text"}
          errors={formik.errors}
          formikProps={formik.getFieldProps}
          id={"title"}
          touched={formik.touched}
          placeholder="Name"
        />
        <Form.Group>
          <label htmlFor="type">Type</label>
          <select
            className="form-select form-field"
            aria-label="Default select example"
            id="type"
            {...formik.getFieldProps("type")}
          >
            <option value="error">Error</option>
            <option value="feedback">Feedback</option>
            <option value="suggestion">Suggestion</option>
            <option value="other">Other</option>
          </select>
          {formik.touched.type && formik.errors.type ? (
            <div className="text-red-500">{formik.errors.type}</div>
          ) : null}
        </Form.Group>

        <Form.Group>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="describtion">Message</label>
            {formik.touched.describtion && formik.errors.describtion ? (
              <Badge bg="danger">{formik.errors.describtion}</Badge>
            ) : null}
          </div>
          <textarea
            className="form-control form-field"
            id="describtion"
            rows="3"
            placeholder="Message"
            {...formik.getFieldProps("describtion")}
          ></textarea>
        </Form.Group>

        <button
          type="button"
          disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
          onClick={formik.handleSubmit}
          className="form-btn"
        >
          Submit
        </button>
      </div>
    </Container>
  );
}

export default Contact;

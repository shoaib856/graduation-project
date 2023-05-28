import React from "react";
import { useFormik } from "formik";
import axios from "../api/axios";
import { toastMsg } from "../components/message-toast";
import * as Yup from "yup";
import { Alert, Form, Button } from "react-bootstrap";
import useAuthValue from "../hooks/useAuthValue";
import { useParams } from "react-router-dom";
const EditPwd = () => {
  const auth = useAuthValue();
  const isAdmin = auth?.role === "admin" || auth?.role === "superAdmin";
  const params = useParams();
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: !(auth?.role === "admin" || auth?.role === "superAdmin")
        ? Yup.string().required("Required")
        : Yup.string(),
      password: Yup.string()
        .required("Required")
        .min(8, "Must be 8 characters or more"),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      try {
        await axios
          .put(`/password/${params?.id}`, values, {
            headers: {
              "x-auth-token": auth?.token,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            toastMsg("success", res.data.message);
            formik.resetForm();
          })
          .catch((err) => {
            toastMsg("error", "Something went wrong);");
            console.error(err);
          });
      } catch (err) {
        toastMsg("error", err.response.data.message);
      }
    },
  });
  return (
    <div className="w-full py-3 px-1 flex flex-col gap-4 items-center bg-white !rounded-xl shadow-xl">
      <h1 className="text-4xl w-full rounded-md text-emerald-600 pl-3">
        Change Password
      </h1>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-2 text-lg text-emerald-600 w-full"
      >
        {!isAdmin && (
          <Form.FloatingLabel
            Label="old Password *"
            className="flex flex-col gap-1"
          >
            <Form.Control
              {...formik.getFieldProps("oldPassword")}
              type="password"
              placeholder="oldPassword"
              autoComplete="new-password"
              className="form-field"
            />

            {formik.touched.oldPassword && formik.errors.oldPassword ? (
              <Alert
                variant="danger"
                className="m-0 px-1 py-2 border-l-8 !text-sm"
              >
                {formik.errors.oldPassword}
              </Alert>
            ) : null}
          </Form.FloatingLabel>
        )}
        <Form.FloatingLabel
          label="New Password *"
          className="flex flex-col gap-1"
        >
          <Form.Control
            {...formik.getFieldProps("password")}
            type="password"
            placeholder="password"
            autoComplete="new-password"
            className="form-field"
          />
          {formik.touched.password && formik.errors.password && (
            <Alert
              variant="danger"
              className="m-0 px-1 py-2 border-l-8 !text-sm"
            >
              {formik.errors.password}
            </Alert>
          )}
        </Form.FloatingLabel>
        <Form.FloatingLabel
          label="Confirm New Password *"
          className="flex flex-col gap-1"
        >
          <Form.Control
            id="confirmPassword"
            {...formik.getFieldProps("confirmPassword")}
            type="password"
            className="form-field"
            autoComplete="new-password"
            placeholder="Confirm Password"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <Alert
              variant="danger"
              className="m-0 px-1 py-2 border-l-8 !text-sm"
            >
              {formik.errors.confirmPassword}
            </Alert>
          )}
        </Form.FloatingLabel>
        <Button
          type="submit"
          variant="warning"
          className="bg-yellow-500 text-white "
          disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
        >
          {formik.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default EditPwd;

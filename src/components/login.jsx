import axios from "../api/axios";
import { Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toastMsg } from "./message-toast";
import InputField from "./inputField";

import { useState } from "react";
import useAuth from "../hooks/useAuth.js";
import setCookie from "../hooks/setCookie";
import { BoxArrowInRight, XCircleFill } from "react-bootstrap-icons";
import { useFormik } from "formik";
import * as Yup from "yup";

function Login({ show, onHide }) {
  const [auth, setAuth] = useAuth();

  const [abortController, setAbortController] = useState(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be 8 characters or more")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      const controller = new AbortController();
      setAbortController(controller);

      await axios
        .post("/login", values, {
          signal: controller.signal,
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          toastMsg("success", res?.data.message);
          setAuth({
            role: res?.data.role,
            token: res?.data.token,
            id: res?.data.user_id,
          });
          setCookie(
            "userIn",
            JSON.stringify({
              role: res?.data.role,
              token: res?.data.token,
              id: res?.data.user_id,
            })
          );
        })
        .catch((err) => {
          if (
            err.name === "AbortError" ||
            abortController?.signal.aborted ||
            err.name === "CanceledError"
          ) {
            console.log("Request canceled");
          } else {
            toastMsg("error", err.response.data.message.toString());
          }
        });
    },
  });

  const handleCancel = () => {
    abortController?.abort();
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="backdrop-blur bg-white/5"
    >
      <Modal.Header>
        <Modal.Title className="font-bold text-emerald-900">Login</Modal.Title>
        <XCircleFill onClick={handleCancel} className="close-btn" />
      </Modal.Header>
      <Modal.Body>
        <InputField
          Label="Email"
          errors={formik.errors}
          formikProps={formik.getFieldProps}
          id={"email"}
          placeholder={"example@email.com"}
          touched={formik.touched}
          type="email"
        />
        <InputField
          Label="Password"
          errors={formik.errors}
          formikProps={formik.getFieldProps}
          id={"password"}
          placeholder={"********"}
          touched={formik.touched}
          type="password"
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="flex items-center gap-4">
          <button
            variant="success"
            onClick={formik.handleSubmit}
            type="button"
            className="form-btn flex items-center gap-2"
            disabled={formik.isSubmitting}
          >
            <BoxArrowInRight />
            {formik.isSubmitting ? "Loading..." : "Login"}
          </button>
          <button
            className="text-red-400 hover:text-red-600"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
        <span className="mx-auto">
          Haven't you an account?{"  "}
          <Link
            to="/register"
            className="text-emerald-600 hover:text-emerald-400 underline underline-offset-2"
            onClick={onHide}
          >
            Register
          </Link>
        </span>
      </Modal.Footer>
    </Modal>
  );
}

export default Login;

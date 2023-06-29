import axios from "../api/axios";
import { Container, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { toastMsg } from "../components/message-toast";
import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";
import useLoader from "../hooks/useLoader";
import Login from "../components/login";
import GeneralInfo from "../components/generalInfo";
import { useFormik } from "formik";
import LocationInfo from "../components/locationInfo";
import SpecificInfo from "../components/specificInfo";
import setCookie from "../hooks/setCookie";
import * as Yup from "yup";
import Stepper from "../components/stepper";

function Register() {
  const location = useLocation();
  const registerLocation =
    location.pathname.split("/").slice(-1)[0] === "register";
  document.title = registerLocation
    ? "FarmVision | Register"
    : "Dashboard | Add User";
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [loader, setLoader] = useLoader();
  const [showLogin, setShowLogin] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [toBeSelectedFeatures, setToBeSelectedFeatures] = useState([]);
  const formik = useFormik({
    initialValues: {
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      country: "",
      city: "",
      state: "",
      streetName: "",
      postCode: "",
      role: "farmer",
      workField: "",
      usageTarget: "",
      features: [],
    },
    validationSchema: Yup.object({
      userName: Yup.string()
        .required("Required")
        .min(8, "Must be 8 characters or more")
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Username must be small case"),
      firstName: Yup.string()
        .required("Required")
        .max(15, "Must be 15 characters or less"),
      lastName: Yup.string()
        .required("Required")
        .max(20, "Must be 20 characters or less"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .required("Required")
        .min(8, "Password must be at least 8 characters"),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
      phoneNumber: Yup.string()
        .required("Required")
        .matches(/^[0-9]$/, "Phone number must be number")
        .min(11, "at least 11 number")
        .max(11, "at most 11 number"),
      country: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      streetName: Yup.string().required("Required"),
      postCode: Yup.string().required("Required"),
      workField: Yup.string().required("Required"),
      usageTarget: Yup.string().required("Required"),
    }),

    onSubmit: async (values) => {
      setLoader(true);
      await axios
        .post(registerLocation ? "" : "/admin" + "/user", values, {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": auth?.token,
          },
        })
        .then((res) => {
          toastMsg("success", res.data.message);
          if (registerLocation) {
            setAuth({
              role: res?.data.role,
              token: res?.data.token,
              id: res?.data.user_id,
            });
            setCookie(
              "auth",
              JSON.stringify({
                role: res?.data.role,
                token: res?.data.token,
                id: res?.data.user_id,
              })
            );
          }
          navigate("../");
          setLoader(false);
        })
        .catch((e) => {
          setLoader(false);
          toastMsg("error", e.response.data.message);
        });
    },
  });

  const handleLoggedIn = () => {
    if (registerLocation) {
      navigate("/");
      toastMsg("info", "Logged in Already");
    }
  };
  const getFeatures = async () => {
    await axios
      .get("/feature", {})
      .then((res) =>
        setToBeSelectedFeatures([...toBeSelectedFeatures, ...res.data.data])
      );
  };
  useEffect(() => {
    auth && handleLoggedIn();
    getFeatures();
  }, []);
  const steps = [
    "General Information",
    "Location Information",
    "Specific Information",
  ];
  const fieldsInStep = [
    [
      "userName",
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
    ],
    ["phoneNumber", "country", "city", "state", "streetName", "postCode"],
    ["workField", "usageTarget", "features"],
  ];
  return (
    <div className="flex flex-col gap-2 text-emerald-600 max-w-3xl w-full p-4 bg-white rounded-xl shadow-xl">
      <Form onSubmit={formik.handleSubmit} autoComplete="off">
        <Stepper
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          fieldsInEachStep={fieldsInStep}
          errors={formik.errors}
          touched={formik.touched}
        />
        <Container className="p-0 mx-auto">
          {activeStep === 1 ? (
            <GeneralInfo
              errors={formik.errors}
              touched={formik.touched}
              formikProps={formik.getFieldProps}
            />
          ) : activeStep === 2 ? (
            <LocationInfo
              errors={formik.errors}
              touched={formik.touched}
              formikProps={formik.getFieldProps}
            />
          ) : (
            activeStep === 3 && (
              <SpecificInfo
                errors={formik.errors}
                touched={formik.touched}
                formikProps={formik.getFieldProps}
                features={toBeSelectedFeatures}
              />
            )
          )}
        </Container>
        <Form.Group className="flex justify-between pt-4">
          <button
            onClick={() => setActiveStep(activeStep - 1)}
            type="button"
            className="form-btn"
            disabled={activeStep === 1}
          >
            Back
          </button>

          {activeStep === 3 ? (
            <button
              type="submit"
              className="form-btn"
              disabled={
                formik.isSubmitting || !(formik.isValid && formik.dirty)
              }
            >
              {formik.isSubmitting ? "Submitting..." : "Submit"}
            </button>
          ) : (
            <button
              onClick={() => setActiveStep(activeStep + 1)}
              type="button"
              className="form-btn"
            >
              Next
            </button>
          )}
        </Form.Group>
      </Form>
      {registerLocation && (
        <footer className="text-black font-normal">
          <p>
            Have an account?
            <button
              onClick={() => setShowLogin(true)}
              className="text-emerald-600 hover:text-emerald-400 cursor-pointer underline"
            >
              Login
            </button>
            <Login show={showLogin} onHide={() => setShowLogin(false)} />
          </p>
        </footer>
      )}
    </div>
  );
}

export default Register;

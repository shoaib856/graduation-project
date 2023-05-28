import {
  Alert,
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Form,
  Image,
  Placeholder,
  Row,
} from "react-bootstrap";
import axios from "../api/axios";
import { useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { toastMsg } from "../components/message-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import removeCookie from "../hooks/removeCookie";
import { useUserImage } from "../context/userImg";
import { PencilSquare, PersonCircle, XCircleFill } from "react-bootstrap-icons";
import { useFormik } from "formik";
import { useImmer } from "use-immer";
import * as Yup from "yup";
import DefaultUserLogo from "../components/DefaultUserLogo";

function Profile() {
  const [auth, setAuth] = useAuth();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [error, setError] = useState(false);
  const userImg = useUserImage();
  const navigate = useNavigate();
  const location = useLocation();
  const profileLocation =
    location.pathname.split("/").slice(-2)[0] === "profile";
  document.title = profileLocation
    ? "FarmVision | Profile"
    : "Dashboard | User Details";
  const params = useParams();
  const [fieldsEnabled, setFieldsEnabled] = useImmer({
    firstName: false,
    lastName: false,
    userName: false,
    email: false,
    phoneNumber: false,
    country: false,
    city: false,
    state: false,
    streetName: false,
    postCode: false,
    role: false,
    workField: false,
    usageTarget: false,
    features: false,
  });
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const userNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const countryRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const streetNameRef = useRef(null);
  const postCodeRef = useRef(null);
  const roleRef = useRef(null);
  const workFieldRef = useRef(null);
  const usageTargetRef = useRef(null);
  const featuresRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      phoneNumber: "",
      country: "",
      city: "",
      state: "",
      streetName: "",
      postCode: "",
      role: "",
      workField: "",
      usageTarget: "",
      features: [],
    },
    onSubmit: async (values) => {
      const editedFields = Object.keys(values).reduce((acc, current) => {
        if (values[current] !== user[current]) {
          acc[current] = values[current];
        }
        return acc;
      }, {});
      if (Object.keys(editedFields).length === 0) {
        toastMsg("info", "No changes were made");
        return;
      }
      await axios
        .put(`/user/${profileLocation ? auth.id : params.id}`, editedFields, {
          headers: {
            "x-auth-token": auth.token,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          toastMsg("success", res.data.message);
          setRefetch(true);
          handleDisableAll();
        })
        .catch((err) => {
          toastMsg("error", err.response.data.message);
        });
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, "Must be 2 characters or more")
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      lastName: Yup.string()
        .min(2, "Must be 2 characters or more")
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      userName: Yup.string()
        .required("Required")
        .min(8, "Must be 8 characters or more")
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Username must be small case"),
      email: Yup.string().email("Invalid email address").required("Required"),
      phoneNumber: Yup.string()
        .matches(/^\+?[0-9]+$/, "Must be only digits")
        .required("Required"),
      country: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      state: Yup.string().required("Required"),
      streetName: Yup.string().required("Required"),
      postCode: Yup.string().required("Required"),
      role: Yup.string().required("Required"),
      workField: Yup.string().required("Required"),
      usageTarget: Yup.string().required("Required"),
    }),
  });
  const getData = async () => {
    try {
      setLoading(true);
      await axios
        .get(`user/${profileLocation ? auth?.id : params.id}`, {
          headers: { "x-auth-token": auth?.token },
        })
        .then((res) => {
          toastMsg("success", res.data.message);
          formik.setValues(res.data.data.user);
          setUser(res.data.data.user);
          setLoading(false);
          setRefetch(false);
        })
        .catch((err) => {
          setError(true);
          setLoading(false);
        });
    } catch (err) {
      setLoading(false);
      toastMsg("error", "You Must Login or Register first");
      navigate("../");
    }
  };
  const handleEnable = (field) => {
    field.disabled = false;
    field.focus();
    setFieldsEnabled((draft) => {
      draft[field.name] = true;
    });
  };
  const handleDisable = (field) => {
    field.disabled = true;
    setFieldsEnabled((draft) => {
      draft[field.name] = false;
    });
    formik.setFieldValue(field.name, user[field.name]);
  };
  const handleDisableAll = () => {
    setFieldsEnabled((draft) => {
      Object.keys(draft).forEach((field) => {
        draft[field] = false;
      });
    });

    handleDisable(firstNameRef.current);
    handleDisable(lastNameRef.current);
    handleDisable(userNameRef.current);
    handleDisable(emailRef.current);
    handleDisable(phoneNumberRef.current);
    handleDisable(countryRef.current);
    handleDisable(cityRef.current);
    handleDisable(stateRef.current);
    handleDisable(streetNameRef.current);
    handleDisable(postCodeRef.current);
    handleDisable(roleRef.current);
    handleDisable(workFieldRef.current);
    handleDisable(usageTargetRef.current);
  };
  const handleLogout = async () => {
    setLoading(true);
    await axios
      .post(
        "/logout",
        {},
        {
          headers: {
            "x-auth-token": auth.token,
          },
        }
      )
      .then((res) => {
        navigate({ pathname: "/graduation-project/" });
        toastMsg("success", res.data.message);
        setLoading(false);
        setAuth(null);
        removeCookie("userIn");
      })
      .catch((err) => {
        setLoading(false);
        toastMsg("error", err.response.data.message);
      });
  };

  useEffect(() => {
    getData();
  }, [auth, refetch]);

  return (
    <div className="w-full py-3 px-1 flex flex-col gap-4 items-center bg-white !rounded-xl shadow-xl">
      <h1 className="text-4xl w-full text-emerald-600 pl-3">Profile</h1>
      {error ? (
        <Alert variant="danger" className="w-full">
          Something went wrong
        </Alert>
      ) : !user || refetch ? (
        <Card className="w-full">
          <Card.Header className="flex justify-center w-full">
            <PersonCircle className="text-gray-300 text-8xl" />
          </Card.Header>
          <Card.Body>
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={12} />
              <Placeholder xs={12} />
              <Placeholder xs={12} />
              <Placeholder xs={12} />
            </Placeholder>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Container className="cover-img flex justify-center py-3" fluid>
            {userImg ? (
              <Image
                roundedCircle
                className="max-w-[150px] w-full h-[150px] relative z-[1]"
                src={URL.createObjectURL(userImg)}
                alt="profile-image"
              />
            ) : (
              <DefaultUserLogo
                dims={"w-32 h-32"}
                nameAbbreviation={
                  user.firstName[0].toUpperCase() +
                  user.lastName[0].toUpperCase()
                }
              />
            )}
          </Container>
          <div className="flex flex-col gap-4 !w-full px-2">
            <h1 className="text-6xl md:text-4xl text-center">
              {user?.firstName + " " + user?.lastName}
            </h1>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-1 text-lg text-emerald-600 p-1 bg-white rounded-xl shadow-xl font-semibold"
            >
              <Row className="flex gap-1 px-[12px]">
                <Form.FloatingLabel
                  label={"First Name"}
                  as={Col}
                  className="p-0"
                >
                  <Form.Control
                    {...formik.getFieldProps("firstName")}
                    autoComplete="nope"
                    ref={firstNameRef}
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    className="form-field disabled:bg-white !pr-8"
                    required
                    disabled
                  />
                  {!fieldsEnabled.firstName ? (
                    <PencilSquare
                      onClick={() => {
                        handleEnable(firstNameRef.current);
                      }}
                      className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                    />
                  ) : (
                    <XCircleFill
                      onClick={() => {
                        handleDisable(firstNameRef.current);
                      }}
                      className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                    />
                  )}
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <Alert
                      variant="danger"
                      className="mt-1 px-1 py-2 border-l-8 !text-sm"
                    >
                      {formik.errors.firstName}
                    </Alert>
                  ) : null}
                </Form.FloatingLabel>
                <Form.FloatingLabel
                  label={"Last Name"}
                  as={Col}
                  className="p-0"
                >
                  <Form.Control
                    {...formik.getFieldProps("lastName")}
                    name="lastName"
                    ref={lastNameRef}
                    placeholder="Last Name"
                    autoComplete="nope"
                    type="text"
                    className="form-field disabled:bg-white !pr-8"
                    required
                    disabled
                  />
                  {!fieldsEnabled.lastName ? (
                    <PencilSquare
                      onClick={() => {
                        handleEnable(lastNameRef.current);
                      }}
                      className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                    />
                  ) : (
                    <XCircleFill
                      onClick={() => {
                        handleDisable(lastNameRef.current);
                      }}
                      className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                    />
                  )}
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <Alert
                      variant="danger"
                      className="mt-1 px-1 py-2 border-l-8 !text-sm"
                    >
                      {formik.errors.lastName}
                    </Alert>
                  ) : null}
                </Form.FloatingLabel>
              </Row>
              <Form.FloatingLabel label={"Username"} className="p-0">
                <Form.Control
                  {...formik.getFieldProps("userName")}
                  autoComplete="nope"
                  name="userName"
                  ref={userNameRef}
                  type="text"
                  placeholder="Username"
                  className="form-field disabled:bg-white !pr-8"
                  required
                  disabled
                />
                {!fieldsEnabled.userName ? (
                  <PencilSquare
                    onClick={() => {
                      handleEnable(userNameRef.current);
                    }}
                    className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                  />
                ) : (
                  <XCircleFill
                    onClick={() => {
                      handleDisable(userNameRef.current);
                    }}
                    className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                  />
                )}
                {formik.touched.userName && formik.errors.userName ? (
                  <Alert
                    variant="danger"
                    className="mt-1 px-1 py-2 border-l-8 !text-sm"
                  >
                    {formik.errors.userName}
                  </Alert>
                ) : null}
              </Form.FloatingLabel>
              <Form.FloatingLabel label={"Email"} className="p-0">
                <Form.Control
                  {...formik.getFieldProps("email")}
                  autoComplete="nope"
                  name="email"
                  ref={emailRef}
                  type="email"
                  placeholder="Email"
                  className="form-field disabled:bg-white !pr-8"
                  required
                  disabled
                />
                {!fieldsEnabled.email ? (
                  <PencilSquare
                    onClick={() => {
                      handleEnable(emailRef.current);
                    }}
                    className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                  />
                ) : (
                  <XCircleFill
                    onClick={() => {
                      handleDisable(emailRef.current);
                    }}
                    className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                  />
                )}
                {formik.touched.email && formik.errors.email ? (
                  <Alert
                    variant="danger"
                    className="mt-1 px-1 py-2 border-l-8 !text-sm"
                  >
                    {formik.errors.email}
                  </Alert>
                ) : null}
              </Form.FloatingLabel>
              <Form.FloatingLabel label={"Phone Number"} className="p-0">
                <Form.Control
                  {...formik.getFieldProps("phoneNumber")}
                  autoComplete="nope"
                  name="phoneNumber"
                  ref={phoneNumberRef}
                  type="tel"
                  placeholder="Phone Number"
                  className="form-field disabled:bg-white !pr-8"
                  required
                  disabled
                />
                {!fieldsEnabled.phoneNumber ? (
                  <PencilSquare
                    onClick={() => {
                      handleEnable(phoneNumberRef.current);
                    }}
                    className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                  />
                ) : (
                  <XCircleFill
                    onClick={() => {
                      handleDisable(phoneNumberRef.current);
                    }}
                    className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                  />
                )}
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                  <Alert
                    variant="danger"
                    className="mt-1 px-1 py-2 border-l-8 !text-sm"
                  >
                    {formik.errors.phoneNumber}
                  </Alert>
                ) : null}
              </Form.FloatingLabel>
              <Row className="flex gap-1 px-[12px]">
                <Col className="p-0">
                  <Form.FloatingLabel label={"Country"}>
                    <Form.Control
                      {...formik.getFieldProps("country")}
                      autoComplete="nope"
                      name="country"
                      ref={countryRef}
                      type="text"
                      placeholder="Country"
                      className="form-field disabled:bg-white !pr-8"
                      required
                      disabled
                    />
                    {!fieldsEnabled.country ? (
                      <PencilSquare
                        onClick={() => {
                          handleEnable(countryRef.current);
                        }}
                        className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                      />
                    ) : (
                      <XCircleFill
                        onClick={() => {
                          handleDisable(countryRef.current);
                        }}
                        className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                      />
                    )}
                    {formik.touched.country && formik.errors.country ? (
                      <Alert
                        variant="danger"
                        className="mt-1 px-1 py-2 border-l-8 !text-sm"
                      >
                        {formik.errors.country}
                      </Alert>
                    ) : null}
                  </Form.FloatingLabel>
                </Col>
                <Col className="p-0">
                  <Form.FloatingLabel label={"City"}>
                    <Form.Control
                      {...formik.getFieldProps("city")}
                      autoComplete="nope"
                      name="city"
                      ref={cityRef}
                      type="text"
                      placeholder="City"
                      className="form-field disabled:bg-white !pr-8"
                      required
                      disabled
                    />
                    {!fieldsEnabled.city ? (
                      <PencilSquare
                        onClick={() => {
                          handleEnable(cityRef.current);
                        }}
                        className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                      />
                    ) : (
                      <XCircleFill
                        onClick={() => {
                          handleDisable(cityRef.current);
                        }}
                        className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                      />
                    )}
                    {formik.touched.city && formik.errors.city ? (
                      <Alert
                        variant="danger"
                        className="mt-1 px-1 py-2 border-l-8 !text-sm"
                      >
                        {formik.errors.city}
                      </Alert>
                    ) : null}
                  </Form.FloatingLabel>
                </Col>
              </Row>
              <Row className="flex gap-1 px-[12px]">
                <Col className="p-0">
                  <Form.FloatingLabel label={"State"}>
                    <Form.Control
                      {...formik.getFieldProps("state")}
                      autoComplete="nope"
                      name="state"
                      ref={stateRef}
                      type="text"
                      placeholder="State"
                      className="form-field disabled:bg-white !pr-8"
                      required
                      disabled
                    />
                    {!fieldsEnabled.state ? (
                      <PencilSquare
                        onClick={() => {
                          handleEnable(stateRef.current);
                        }}
                        className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                      />
                    ) : (
                      <XCircleFill
                        onClick={() => {
                          handleDisable(stateRef.current);
                        }}
                        className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                      />
                    )}
                    {formik.touched.state && formik.errors.state ? (
                      <Alert
                        variant="danger"
                        className="mt-1 px-1 py-2 border-l-8 !text-sm"
                      >
                        {formik.errors.state}
                      </Alert>
                    ) : null}
                  </Form.FloatingLabel>
                </Col>
                <Col className="p-0">
                  <Form.FloatingLabel label={"Street Name"} className="p-0">
                    <Form.Control
                      {...formik.getFieldProps("streetName")}
                      autoComplete="nope"
                      name="streetName"
                      ref={streetNameRef}
                      type="text"
                      placeholder="Street Name"
                      className="form-field disabled:bg-white !pr-8"
                      required
                      disabled
                    />
                    {!fieldsEnabled.streetName ? (
                      <PencilSquare
                        onClick={() => {
                          handleEnable(streetNameRef.current);
                        }}
                        className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                      />
                    ) : (
                      <XCircleFill
                        onClick={() => {
                          handleDisable(streetNameRef.current);
                        }}
                        className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                      />
                    )}
                    {formik.touched.streetName && formik.errors.streetName ? (
                      <Alert
                        variant="danger"
                        className="mt-1 px-1 py-2 border-l-8 !text-sm"
                      >
                        {formik.errors.streetName}
                      </Alert>
                    ) : null}
                  </Form.FloatingLabel>
                </Col>
              </Row>
              <Form.FloatingLabel label="Post Code" className="p-0">
                <Form.Control
                  {...formik.getFieldProps("postCode")}
                  autoComplete="nope"
                  name="postCode"
                  ref={postCodeRef}
                  type="text"
                  placeholder="Post Code"
                  className="form-field disabled:bg-white !pr-8"
                  required
                  disabled
                />
                {!fieldsEnabled.postCode ? (
                  <PencilSquare
                    onClick={() => {
                      handleEnable(postCodeRef.current);
                    }}
                    className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                  />
                ) : (
                  <XCircleFill
                    onClick={() => {
                      handleDisable(postCodeRef.current);
                    }}
                    className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                  />
                )}
                {formik.touched.postCode && formik.errors.postCode ? (
                  <Alert
                    variant="danger"
                    className="mt-1 px-1 py-2 border-l-8 !text-sm"
                  >
                    {formik.errors.postCode}
                  </Alert>
                ) : null}
              </Form.FloatingLabel>
              <Form.FloatingLabel label={"Role"}>
                <Form.Control
                  className="form-field disabled:bg-white"
                  name="role"
                  ref={roleRef}
                  {...formik.getFieldProps("role")}
                  disabled
                />
              </Form.FloatingLabel>
              <Form.FloatingLabel label={"Work Field"} className="p-0">
                <Form.Control
                  {...formik.getFieldProps("workField")}
                  autoComplete="nope"
                  name="workField"
                  ref={workFieldRef}
                  type="text"
                  placeholder="Work Field"
                  className="form-field disabled:bg-white !pr-8"
                  required
                  disabled
                />
                {!fieldsEnabled.workField ? (
                  <PencilSquare
                    onClick={() => {
                      handleEnable(workFieldRef.current);
                    }}
                    className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                  />
                ) : (
                  <XCircleFill
                    onClick={() => {
                      handleDisable(workFieldRef.current);
                    }}
                    className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                  />
                )}
                {formik.touched.workField && formik.errors.workField ? (
                  <Alert
                    variant="danger"
                    className="mt-1 px-1 py-2 border-l-8 !text-sm"
                  >
                    {formik.errors.workField}
                  </Alert>
                ) : null}
              </Form.FloatingLabel>
              <Form.FloatingLabel label="Usage Target" className="p-0">
                <Form.Control
                  {...formik.getFieldProps("usageTarget")}
                  autoComplete="nope"
                  name="usageTarget"
                  ref={usageTargetRef}
                  type="text"
                  placeholder="Usage Target"
                  className="form-field disabled:bg-white !pr-8"
                  required
                  disabled
                />
                {!fieldsEnabled.usageTarget ? (
                  <PencilSquare
                    onClick={() => {
                      handleEnable(usageTargetRef.current);
                    }}
                    className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                  />
                ) : (
                  <XCircleFill
                    onClick={() => {
                      handleDisable(usageTargetRef.current);
                    }}
                    className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                  />
                )}
                {formik.touched.usageTarget && formik.errors.usageTarget ? (
                  <Alert
                    variant="danger"
                    className="mt-1 px-1 py-2 border-l-8 !text-sm"
                  >
                    {formik.errors.usageTarget}
                  </Alert>
                ) : null}
              </Form.FloatingLabel>
              <ButtonGroup>
                <Button
                  variant="info"
                  type="submit"
                  className="bg-sky-500 text-white"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {formik.isSubmitting ? "Loading..." : "Save"}
                </Button>

                <Button
                  variant="danger"
                  className="bg-red-500"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </ButtonGroup>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;

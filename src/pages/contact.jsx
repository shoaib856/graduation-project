import {Badge, Container, Form, Modal} from "react-bootstrap";
import InputField from "../components/inputField";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useEffect, useState} from "react";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";
import Login from "../components/login.jsx";
import {Link} from "react-router-dom";

function Contact() {
    document.title = "Contact Us";
    const auth = useAuthValue();
    const [show, setShow] = useState(false);
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
                        "x-auth-token": auth?.token,
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
    useEffect(() => {
        (auth?.token === undefined) ? setShow(true)
            : setShow(false);
    }, [auth]);

    return (
        <Container className="py-4">
            <MustBeLoggedIn show={show} setShow={setShow}/>
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
                    disabled={auth?.token === undefined}
                />
                <Form.Group>
                    <label htmlFor="type">Type</label>
                    <select
                        disabled={auth?.token === undefined}
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

                <InputField
                    Label="Description"
                    as="textarea"
                    type={"text"}
                    errors={formik.errors}
                    formikProps={formik.getFieldProps}
                    id={"describtion"}
                    touched={formik.touched}
                    placeholder="Describtion"
                    disabled={auth?.token === undefined}
                />

                <button
                    type="button"
                    disabled={formik.isSubmitting || !(formik.isValid && formik.dirty) || auth?.token === undefined}
                    onClick={() => formik.handleSubmit()}
                    className="form-btn"
                >
                    Submit
                </button>
            </div>
        </Container>
    );
}

export default Contact;

const MustBeLoggedIn = ({show, setShow}) => {
    const [showLogin, setShowLogin] = useState(false);

    return (
        <Modal show={show}>
            <Modal.Body className={"text-center"}>
                <h1 className="text-2xl text-red-500 uppercase font-bold">You must be logged in</h1>
                <p className="text-gray-500">
                    You must be logged in to contact us. Please login or register.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="form-btn"
                    onClick={() => {
                        setShowLogin(true);
                    }}
                >
                    Login
                </button>
                <Link to="/register"
                    className="form-btn"
                    onClick={() => {
                        setShowLogin(false);
                    }}>
                    Register
                </Link>
            </Modal.Footer>
            <Login show={showLogin} onHide={() => setShowLogin(false)}/>

        </Modal>
    );
}

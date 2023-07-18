import {useFormik} from "formik";
import React, {useEffect, useState} from "react";
import {Alert, Form, ListGroup, Modal} from "react-bootstrap";
import {Link, XCircleFill} from "react-bootstrap-icons";
import axios from "../api/axios";
import MarkMultiItems from "./MarkMultiItems";
import {toastMsg} from "./message-toast";
import useAuthValue from "../hooks/useAuthValue";
import CustomizedAlert from "./CustomizedAlert";
import AddItem from "./AddItem";
import * as Yup from "yup";
import filesToBase64 from "../utils/fromImgToBase64.js";

const AddPost = ({
                     show, setShow, setRefetch, initialValues, edit, postID,
                 }) => {
    const auth = useAuthValue();
    const [tags, setTags] = useState([]);
    const [error, setError] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const [showRequest, setShowRequest] = useState(false);
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object({
        tag: Yup.string()
            .required("Required")
            .min(3, "Must be 3 characters or more"), describtion: Yup.string()
            .required("Required")
            .min(10, "Must be 10 characters or more"),
    });
    const initialValuesRequestedTag = {
        tag: "", describtion: "",
    };

    const formik = useFormik({
        initialValues, onSubmit: async (values) => {
            console.log(values);
            const handleAccept = (res) => {
                toastMsg("success", res.data.message);
                setShow(false);
                setRefetch(true);
                formik.resetForm();
            };
            const handleReject = (err) => {
                if (abortController?.signal.aborted) {
                    console.log("aborted");
                } else {
                    console.error(err);
                }
            };
            const controller = new AbortController();
            setAbortController(controller);
            if (edit) {
                await axios
                    .put(`/post/${postID}`, values, {
                        signal: controller.signal,
                        headers: {
                            "x-auth-token": auth.token,
                            "Content-Type": "application/json",
                        },
                    })
                    .then((res) => handleAccept(res))
                    .catch((err) => handleReject(err));
            } else {
                await axios
                    .post("/post", values, {
                        signal: controller.signal,
                        headers: {
                            "Content-Type": "application/json",
                            "x-auth-token": auth.token,
                        },
                    })
                    .then((res) => handleAccept(res))
                    .catch((err) => handleReject(err));
            }
        }, validationSchema: Yup.object({
            content: Yup.string()
                .required("Required")
                .min(10, "Must be 10 characters or more"),
        }),
    });
    const handleCancel = () => {
        abortController?.abort();
        setShow(false);
        formik.resetForm();
    };
    const getTags = async () => {
        setLoading(true);
        await axios
            .get("/tag", {headers: {"x-auth-token": auth.token}})
            .then((res) => {
                setTags(res.data.data);
                setLoading(false);
                setError(false);
            })
            .catch((err) => {
                setLoading(false);
                setError(true);
                console.error(err);
                // toastMsg("error", err.response.data.message);
            });
    };
    useEffect(() => {
        getTags();
    }, [show]);

    const handleChange = (e) => {
        const files = e.target.files;
        filesToBase64(files).then((result) => {
            formik.setFieldValue("images", result);
        }).catch((err) => {
            console.error(err);
        });
    };

    return (<Modal
        centered
        show={show}
        onHide={() => {
            setShow(false);
        }}
    >
        <Modal.Header className="flex justify-between items-center">
            <Modal.Title>{edit ? "Edit" : "Add"} Post</Modal.Title>
            <XCircleFill onClick={handleCancel} className="close-btn"/>
        </Modal.Header>
        <Modal.Body>
            <form>
                <div className="form-group">
                    <div className="flex items-center justify-between mb-1">
                        <Form.Text muted>
                            minimum characters 10, maximum characters 1000
                        </Form.Text>
                        <label
                            className="flex items-center gap-1 cursor-pointer py-1 px-2 text-lg bg-gray-200 rounded-md hover:bg-gray-300 text-emerald-600">
                            <Link/>
                            <span>{formik.values.images?.length}</span>
                            <input
                                type="file"
                                name="images"
                                id="images"
                                multiple
                                onChange={handleChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </label>
                    </div>
                    <textarea
                        className="form-control form-field"
                        id="content"
                        {...formik.getFieldProps("content")}
                        rows={3}
                        minLength={10}
                        maxLength={1000}
                        placeholder="Enter Post Content"
                    ></textarea>
                </div>

                <fieldset className="mt-1 border p-2 rounded">
                    <legend>Tags</legend>
                    <ListGroup className="h-32 overflow-y-scroll">
                        {error ? (<CustomizedAlert
                            variant={"danger"}
                            msg={"Error While Loading Tags"}
                            setRefetch={setRefetch}
                        />) : loading ? (<CustomizedAlert
                            variant="info"
                            msg={"Loading..."}
                            spinner={true}
                        />) : tags?.length > 0 ? (tags.map((tag) => (<MarkMultiItems
                            key={tag.id}
                            formikProps={formik.getFieldProps}
                            itemDescription={tag.describtion}
                            itemName={tag.tag}
                            itemType={"tags"}
                            formikValues={formik.values}
                        />))) : (<Alert
                            variant="warning"
                            className="border-l-8 border-l-orange-500"
                        >
                            No Tags Till Now!
                        </Alert>)}
                    </ListGroup>
                </fieldset>
            </form>
        </Modal.Body>
        <Modal.Footer className="flex justify-between items-center">
            <button
                disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
                onClick={() => formik.submitForm()}
                className="form-btn"
            >
                {formik.isSubmitting ? "Loading..." : (edit ? "Edit" : "Add") + " Post"}
            </button>
            <button
                onClick={handleCancel}
                className="text-red-300 hover:text-red-500"
            >
                Cancel
            </button>

            <div>
                Can't find your tag?{" "}
                <button
                    onClick={() => setShowRequest(true)}
                    className="underline text-blue-500 hover:text-blue-700"
                >
                    Request One
                </button>
                {showRequest && (<AddItem
                    auth={auth}
                    show={showRequest}
                    setShow={setShowRequest}
                    type={"tag"}
                    request={true}
                    initialValues={initialValuesRequestedTag}
                    validationSchema={validationSchema}
                />)}
            </div>
        </Modal.Footer>
    </Modal>);
};

export default AddPost;

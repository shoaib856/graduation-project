import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Alert, ListGroup, Modal } from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";
import axios from "../api/axios";
import MarkMultiItems from "./MarkMultiItems";
import { toastMsg } from "./message-toast";
import useAuthValue from "../hooks/useAuthValue";
import CustomizedAlert from "./CustomizedAlert";
import AddItem from "./AddItem";

const AddPost = ({ show, setShow, setRefetch }) => {
  const auth = useAuthValue();
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(false);
  const [abortController, setAbortController] = useState(null);

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      content: "",
      tags: [],
    },
    onSubmit: async (values) => {
      const controller = new AbortController();
      setAbortController(controller);
      await axios
        .post("/post", values, {
          signal: controller.signal,
          headers: {
            "x-auth-token": auth.token,
          },
        })
        .then((res) => {
          toastMsg("success", res.data.message);
          setShow(false);
          setRefetch(true);
          formik.resetForm();
        })
        .catch((err) => {
          if (
            err.name === "AbortError" ||
            abortController?.signal.aborted ||
            err.name === "CanceledError"
          ) {
            console.log("aborted");
          } else {
            console.log(err);
          }
          toastMsg("error", err.response.data.message);
        });
    },
  });
  const handleCancel = () => {
    abortController?.abort();
    setShow(false);
    formik.resetForm();
  };
  const getTags = async () => {
    setLoading(true);
    await axios
      .get("/tag", { headers: { "x-auth-token": auth.token } })
      .then((res) => {
        setTags(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        // toastMsg("error", err.response.data.message);
      });
  };
  useEffect(() => {
    getTags();
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
      }}
    >
      <Modal.Header className="flex justify-between items-center">
        <Modal.Title>Add Post</Modal.Title>
        <XCircleFill onClick={handleCancel} className="close-btn" />
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
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
              {error ? (
                <CustomizedAlert
                  variant={"danger"}
                  msg={"Error While Loading Tags"}
                  setRefetch={setRefetch}
                />
              ) : loading ? (
                <CustomizedAlert
                  variant="info"
                  msg={"Loading..."}
                  spinner={true}
                />
              ) : tags.length > 0 ? (
                tags.map((tag) => (
                  <MarkMultiItems
                    key={tag.id}
                    formikProps={formik.getFieldProps}
                    itemDescription={tag.describtion}
                    itemName={tag.tag}
                    itemType={"tags"}
                  />
                ))
              ) : (
                <Alert
                  variant="warning"
                  className="border-l-8 border-l-orange-500"
                >
                  No Tags Till Now!
                </Alert>
              )}
            </ListGroup>
          </fieldset>
        </form>
      </Modal.Body>
      <Modal.Footer className="flex justify-between items-center">
        <button
          disabled={formik.isSubmitting}
          onClick={() => formik.submitForm()}
          className="form-btn"
        >
          {formik.isSubmitting ? "Loading..." : "Add Post"}
        </button>
        <button
          onClick={handleCancel}
          className="text-red-300 hover:text-red-500"
        >
          Cancel
        </button>

        <span>
          Can't find your tag?{" "}
          <a href="/tags" className="text-blue-500 hover:text-blue-700">
            Request One
          </a>
        </span>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPost;

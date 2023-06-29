import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Alert, ListGroup, Modal } from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";
import axios from "../api/axios";
import MarkMultiItems from "./MarkMultiItems";
import { toastMsg } from "./message-toast";
import useAuthValue from "../hooks/useAuthValue";

const AddPost = ({ show, setShow, setRefetch }) => {
  const auth = useAuthValue();
  const [tags, setTags] = useState([]);
  const formik = useFormik({
    initialValues: {
      content: "",
      tags: [],
    },
    onSubmit: async (values) => {
      await axios
        .post("/post", values, {
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
          toastMsg("error", err.response.data.message);
        });
    },
  });
  const getTags = async () => {
    await axios
      .get("/tag", { headers: { "x-auth-token": auth.token } })
      .then((res) => {
        setTags(res.data.data);
      })
      .catch((err) => {
        toastMsg("error", err.response.data.message);
      });
  };
  useEffect(() => {
    getTags();
  }, []);

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
      }}
    >
      <Modal.Header className="flex justify-between items-center">
        <Modal.Title>Add Post</Modal.Title>
        <XCircleFill
          onClick={() => {
            setShow(false);
          }}
          className="close-btn"
        />
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <textarea
              className="form-control form-field"
              id="content"
              {...formik.getFieldProps("content")}
              rows={5}
              minLength={10}
              maxLength={1000}
              placeholder="Enter Post Content"
            />
          </div>
          <fieldset className="mt-1 border p-2 rounded">
            <legend>Tags</legend>
            <ListGroup className="h-32 overflow-y-scroll">
              {tags.length > 0 ? (
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
      <Modal.Footer>
        <button
          disabled={formik.isSubmitting}
          onClick={() => formik.submitForm()}
          className="form-btn"
        >
          {formik.isSubmitting ? "Loading..." : "Add Post"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPost;

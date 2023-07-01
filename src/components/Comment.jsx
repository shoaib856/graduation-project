import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Send, XCircleFill } from "react-bootstrap-icons";
import Post from "./Post";
import InputField from "./inputField";

const Comment = ({ show, setShow, post }) => {
  const handleCancel = () => {
    setShow(false);
  };
  const formik = useFormik({
    initialValues: {
      content: "",
    },
    onSubmit: async (values) => {
      console.log(values, "/comment/onpost/:id - post");
    },
  });

  return (
    <Modal show={show} onHide={handleCancel}>
      <Modal.Header>
        <XCircleFill className="close-btn" onClick={handleCancel} />
      </Modal.Header>
      <Modal.Body>
        <Post
          images={post.images}
          post={post.post}
          tags={post.tags}
          user={post.user}
          userDisLike={post.userDisLike}
          userLike={post.userLike}
          disableComment={true}
        />
      </Modal.Body>
      <Modal.Footer className="flex !flex-nowrap sm:!flex-wrap">
        <div className="w-full">
          <InputField
            Label={null}
            errors={formik.errors}
            formikProps={formik.getFieldProps}
            placeholder={"Write Your Comment"}
            touched={formik.touched}
            id={"content"}
            type={"text"}
          />
        </div>
        <div className="flex items-center justify-between gap-2 sm:w-full">
          <button
            type="button"
            className="text-red-300 hover:text-red-500 "
            onClick={handleCancel}
          >
            Close
          </button>
          <button
            type="button"
            className="form-btn"
            onClick={formik.handleSubmit}
          >
            <Send className="text-lg" />
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default Comment;

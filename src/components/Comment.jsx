import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";
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
  useEffect(() => {
    console.log(show);
  }, [show]);
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
      <Modal.Footer>
        <InputField
          Label={null}
          errors={formik.errors}
          formikProps={formik.getFieldProps}
          placeholder={"Write Your Comment"}
          touched={formik.touched}
          id={"content"}
          type={"text"}
        />
        <Button variant="secondary" onClick={handleCancel}>
          Close
        </Button>
        <Button variant="primary" onClick={formik.handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Comment;

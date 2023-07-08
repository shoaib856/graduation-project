import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Modal, Placeholder } from "react-bootstrap";
import { Send, XCircleFill } from "react-bootstrap-icons";
import Post from "./Post";
import useAuthValue from "../hooks/useAuthValue";
import axios from "../api/axios";
import ShowComment from "./ShowComment";
import WriteComment from "./WriteComment";

const Comment = ({
  show,
  setShow,
  postID,
  post,
  setNumberOfComments,
  numberOfComments,
}) => {
  const auth = useAuthValue();

  const [comments, setComments] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [showReply, setShowReply] = useState({ show: false, id: null });
  const [abortController, setAbortController] = useState(null);
  const handleCancel = () => {
    setShow(false);
    abortController?.abort();
  };
  const formikReply = useFormik({
    initialValues: {
      content: "",
    },
    onSubmit: async (values) => {
      const controller = new AbortController();
      setAbortController(controller);

      await axios
        .post("/comment/oncomment/" + showReply.id, values, {
          signal: controller.signal,
          headers: {
            "x-auth-token": auth.token,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          setRefetch(true);
          setNumberOfComments(numberOfComments + 1);
          formikReply.resetForm();
          setShowReply({ show: false, id: null });
        })
        .catch((err) => {
          if (
            err.name === "AbortError" ||
            abortController?.signal.aborted ||
            err.name === "CanceledError"
          ) {
            console.log("Request canceled");
          } else {
            console.log(err);
          }
        });
    },
  });
  const formikComment = useFormik({
    initialValues: {
      content: "",
    },
    onSubmit: async (values) => {
      const controller = new AbortController();
      setAbortController(controller);
      await axios
        .post("/comment/onpost/" + post.post.id, values, {
          signal: controller.signal,
          headers: {
            "x-auth-token": auth.token,
            "Content-Type": "application/json",
          },
        })
        .then(() => {
          setNumberOfComments(numberOfComments + 1);
          setRefetch(true);
          formikComment.resetForm();
        })
        .catch((err) => {
          if (
            err.name === "AbortError" ||
            abortController?.signal.aborted ||
            err.name === "CanceledError"
          ) {
            console.log("Request canceled");
          } else {
            console.error(err);
          }
        });
    },
  });
  const getComments = async () => {
    await axios
      .get("/comment/postcomments/" + postID, {
        headers: { "x-auth-token": auth.token },
      })
      .then((res) => {
        setComments(res.data.data);
        setRefetch(false);
      })
      .catch((err) => {
        setRefetch(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getComments();
  }, [auth, refetch]);

  return (
    <Modal centered show={show} onHide={handleCancel} className="max-h-screen">
      <Modal.Header>
        <Modal.Title>Comments</Modal.Title>
        <XCircleFill className="close-btn" onClick={handleCancel} />
      </Modal.Header>
      <Modal.Body className="max-h-80 overflow-y-scroll">
        {post ? (
          <Post
            images={post.images}
            post={post.post}
            tags={post.tags}
            user={post.user}
            userDisLike={post.userDisLike}
            userLike={post.userLike}
            disableBtns={true}
            numComments={numberOfComments}
          />
        ) : (
          <div className="p-4 bg-emerald-200 rounded">
            <Placeholder as="p" animation="glow">
              <Placeholder xs={4} />
            </Placeholder>
            <div className="border rounded !border-emerald-700 p-2">
              <Placeholder as="p" animation="glow">
                <Placeholder xs={10} />
                <Placeholder xs={5} />
                <Placeholder xs={8} />
                <Placeholder xs={12} />
              </Placeholder>
            </div>
          </div>
        )}

        <div className="mt-4">
          {comments ? (
            comments.length === 0 ? (
              <div className="text-center text-gray-500">
                No comments yet. Be the first to comment
              </div>
            ) : (
              comments.map((comment) =>
                comment.comment.CommentId ? null : (
                  <div className="mb-1">
                    <div key={comment.comment.CommentId || comment.comment.id}>
                      <ShowComment
                        setRefetch={setRefetch}
                        comment={comment}
                        setShowReply={setShowReply}
                        refetch={refetch}
                      />
                      {comments.map((reply) =>
                        reply.comment.CommentId === comment.comment.id ? (
                          <div className="flex items-center pl-4">
                            <div className="w-6 h-8 self-start rounded-bl-xl border-l-2 border-b-2"></div>
                            <ShowComment
                              comment={reply}
                              className={"flex-1"}
                              setShowReply={setShowReply}
                              setRefetch={setRefetch}
                              refetch={refetch}
                            />
                          </div>
                        ) : null
                      )}
                    </div>
                    {showReply.id === comment.comment.id && showReply.show && (
                      <WriteComment
                        formik={formikReply}
                        handleCancel={() => {
                          formikReply.resetForm();
                          setShowReply(false);
                        }}
                      />
                    )}
                  </div>
                )
              )
            )
          ) : (
            <div className="flex flex-col gap-1">
              <div className="border bg-emerald-100 py-1 px-2 rounded">
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={4} />
                  <Placeholder xs={9} />
                </Placeholder>
              </div>
              <div className="border bg-emerald-100 py-1 px-2 rounded">
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={4} />
                  <Placeholder xs={9} />
                </Placeholder>
              </div>
              <div className="border bg-emerald-100 py-1 px-2 rounded">
                <Placeholder as="p" animation="glow">
                  <Placeholder xs={4} />
                  <Placeholder xs={9} />
                </Placeholder>
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <WriteComment formik={formikComment} handleCancel={handleCancel} />
      </Modal.Footer>
    </Modal>
  );
};

export default Comment;

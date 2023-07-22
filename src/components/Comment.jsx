import {useFormik} from "formik";
import React, {useEffect, useState} from "react";
import {Carousel, Modal, Placeholder} from "react-bootstrap";
import {
    ChatFill,
    HandThumbsDown,
    HandThumbsDownFill,
    HandThumbsUp,
    HandThumbsUpFill,
    XCircleFill
} from "react-bootstrap-icons";
import useAuthValue from "../hooks/useAuthValue";
import axios from "../api/axios";
import ShowComment from "./ShowComment";
import WriteComment from "./WriteComment";
import base64toImg from "../utils/fromBase64ToImg.js";
import daysFromNow from "../utils/daysFromNow.js";

const Comment = ({
                     show,
                     setShow,
                     postID,
                     post,
                     setNumberOfComments,
                     numberOfComments,
                     liked,
                     disliked,
                     numDislikes,
                     numLikes,
                     handleDisLike,
                     handleLike
                 }) => {
    const auth = useAuthValue();

    const [comments, setComments] = useState(null);
    const [refetch, setRefetch] = useState(false);
    const [showReply, setShowReply] = useState({show: false, id: null});
    const [abortController, setAbortController] = useState(null);
    const [numOfComments, setNumOfComments] = useState(numberOfComments);
    const [loading, setLoading] = useState(false);
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
                    setNumOfComments(numOfComments + 1)
                    formikReply.resetForm();
                    setShowReply({show: false, id: null});
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
                headers: {"x-auth-token": auth.token},
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
        <Modal centered show={show} onHide={handleCancel}>
            <Modal.Body className={"relative p-0 !pl-2 max-h-[600px] overflow-y-scroll"}>
                <div className={"sticky flex items-center top-0 z-10 p-1 bg-white/40 backdrop-blur"}>
                    <span className={"text-lg font-bold"}>Comments</span>
                    <XCircleFill className="close-btn !ml-auto" onClick={handleCancel}/>
                </div>
                <div>
                    <div className="relative max-w-2xl w-full bg-white shadow-md mx-auto p-3 rounded-md mb-2">
                        <div
                            className="bg-black/5 p-2 rounded flex justify-between items-center mb-2 md:flex-col md:items-start md:gap-2">
                            <div className="flex flex-col items-start">
                                <h3 className="text-xl font-semibold">
                                    {[post.user?.firstName, post.user?.lastName].join(" ")}
                                </h3>
                                <button
                                    className="text-xs text-blue-400 hover:text-blue-600 underline transition-all disabled:text-gray-400 disabled:no-underline"
                                    disabled
                                >
                                    @{post.user?.userName}
                                </button>
                            </div>
                            <div className="flex gap-2 flex-col items-end md:items-start">
                                <div className="flex gap-2">
                                    {post.tags?.map((tag, i) => (
                                        <button
                                            key={i}
                                            className="form-btn !text-xs px-1 py-0.5 disabled:bg-emerald-100 "
                                            disabled
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                                {post.post.UserId === auth.id && (
                                    <div className="flex gap-2">

                                        <button
                                            disabled className="text-xs hover:text-blue-500"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            disabled
                                            className="text-xs hover:text-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="py-1 px-2">
                            <p className="break-words break-all">
                                {post?.post.content
                                    .trim()
                                    .split("\n")
                                    .map((line, i) => (
                                        <span className="block" key={i}>{line}</span>
                                    ))}
                            </p>
                            {post.images?.length > 0 && (
                                <Carousel
                                    className="border bg-black/20 p-0.5 !border-emerald-700 rounded mt-2 !max-w-full">
                                    {post.images?.map((image, i) => (
                                        <Carousel.Item key={i}>
                                            <img
                                                src={URL.createObjectURL(base64toImg(image))}
                                                alt="post"
                                                className="w-72 mx-auto"
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            )}
                        </div>
                        <span className="absolute bottom-2 right-2 text-xs text-gray-400">
                            {daysFromNow(post?.post.createdAt)}
                        </span>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={async ()=> {
                                    setLoading(true)
                                    await handleLike()
                                    setLoading(false)
                                }}
                                disabled={loading}
                                className="form-btn flex items-center gap-1"
                            >
                                {numLikes}
                                {liked ? <HandThumbsUpFill/> : <HandThumbsUp/>}
                            </button>
                            <button
                                onClick={async ()=> {
                                    setLoading(true)
                                    await handleDisLike()
                                    setLoading(false)
                                }}
                                disabled={loading}
                                className="form-btn flex items-center gap-1"
                            >
                                {numDislikes}
                                {disliked ? <HandThumbsDownFill/> : <HandThumbsDown/>}
                            </button>

                            <button
                                className="form-btn flex items-center gap-1"
                                disabled
                            >
                                {numberOfComments}
                                <ChatFill/>
                            </button>


                        </div>
                    </div>


                    <div className="mt-4 p-3">
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
                                                    setNumberOfComments={setNumberOfComments}
                                                />
                                                <div className={""}>
                                                    {comments.slice().reverse().map((reply) =>
                                                        reply.comment.CommentId === comment.comment.id ? (
                                                            <div className="flex items-center pl-4 for-last-element">
                                                                <div className={"-mt-1.5"}>
                                                                    <div
                                                                        className="align-last-sign w-6 h-10 self-start rounded-bl-xl border-l-2 border-b-2"></div>
                                                                    <div
                                                                        className={`-mt-0.5 h-9 self-start rounded-tl-xl border-l-2 ${showReply.show ? "!block" : ""} last-sign`}></div>
                                                                </div>
                                                                <ShowComment
                                                                    comment={reply}
                                                                    className={"flex-1"}
                                                                    setShowReply={setShowReply}
                                                                    setRefetch={setRefetch}
                                                                    refetch={refetch}
                                                                    setNumberOfComments={setNumberOfComments}
                                                                />
                                                            </div>
                                                        ) : null
                                                    )}
                                                </div>
                                            </div>
                                            {showReply.id === comment.comment.id && showReply.show && (
                                                <div className="flex items-center ml-4 mb-4">
                                                    <div
                                                        className="-mt-5 w-6 h-10 self-start rounded-bl-xl border-l-2 border-b-2"></div>
                                                    <WriteComment
                                                        formik={formikReply}
                                                        handleCancel={() => {
                                                            formikReply.resetForm();
                                                            setShowReply(false);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                                )
                            )
                        ) : (
                            <div className="flex flex-col gap-1">
                                <div className="border bg-emerald-100 py-1 px-2 rounded">
                                    <Placeholder as="p" animation="glow">
                                        <Placeholder xs={4}/>
                                        <Placeholder xs={9}/>
                                    </Placeholder>
                                </div>
                                <div className="border bg-emerald-100 py-1 px-2 rounded">
                                    <Placeholder as="p" animation="glow">
                                        <Placeholder xs={4}/>
                                        <Placeholder xs={9}/>
                                    </Placeholder>
                                </div>
                                <div className="border bg-emerald-100 py-1 px-2 rounded">
                                    <Placeholder as="p" animation="glow">
                                        <Placeholder xs={4}/>
                                        <Placeholder xs={9}/>
                                    </Placeholder>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={"border-t-2 p-3 bg-white sticky bottom-0"}>
                    <WriteComment formik={formikComment} handleCancel={handleCancel}/>
                </div>
            </Modal.Body>

        </Modal>
    );
};

export default Comment;

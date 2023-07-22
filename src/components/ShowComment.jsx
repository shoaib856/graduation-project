import {useEffect, useState} from "react";
import useAuthValue from "../hooks/useAuthValue";
import daysFromNow from "../utils/daysFromNow";
import axios from "../api/axios";
import WarningMessage from "./warningMessage";
import {toastMsg} from "./message-toast";
import {useFormik} from "formik";
import WriteComment from "./WriteComment";

const ShowComment = ({
                         comment,
                         setShowReply,
                         className,
                         setRefetch,
                         refetch,
                         setNumberOfComments
                     }) => {
    const auth = useAuthValue();
    const [liked, setLiked] = useState(comment.userLike);
    const [disliked, setDisliked] = useState(comment.userDisLike);
    const [numLikes, setNumLikes] = useState(comment.comment.numberOfLikes);
    const [numDislikes, setNumDislikes] = useState(
        comment.comment.numberOfDisLikes
    );
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const [abortControllerDel, setAbortControllerDel] = useState(null);
    const [loadingDel, setLoadingDel] = useState(false);

    const handleLike = async (id) => {
        setLoading(true);
        await axios
            .post(
                "/comment/like/" + id,
                {},
                {headers: {"x-auth-token": auth.token}}
            )
            .then(() => {
                setLiked(!liked);
                setNumLikes(liked ? numLikes - 1 : numLikes + 1);
                setNumDislikes(disliked ? numDislikes - 1 : numDislikes);
                setDisliked(false);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.error(err);
            });
    };
    const handleDisLike = async (id) => {
        setLoading(true);
        await axios
            .post(
                "/comment/dislike/" + id,
                {},
                {headers: {"x-auth-token": auth.token}}
            )
            .then(() => {
                setDisliked(!disliked);
                setNumDislikes(disliked ? numDislikes - 1 : numDislikes + 1);
                setNumLikes(liked ? numLikes - 1 : numLikes);
                setLiked(false);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                toastMsg("error", err.response.data.message);
            });
    };
    const formikEdit = useFormik({
        initialValues: {
            content: comment.comment.content,
        },
        onSubmit: (values) => {
            const controller = new AbortController();
            setAbortController(controller);
            axios
                .put("/comment/" + comment.comment.id, values, {
                    signal: controller.signal,
                    headers: {
                        "x-auth-token": auth.token,
                        "Content-Type": "application/json",
                    },
                })
                .then(() => {
                    toastMsg("success", "Comment updated");
                    setShowEdit(false);
                    setRefetch(true);

                    formikEdit.resetForm();
                })
                .catch((err) => {
                    if (err.name === "AbortError" || abortController?.signal.aborted)
                        return;
                    console.error(err);
                    toastMsg("error", err.response.data.message);
                });
        },
    });

    const handleCancel = () => {
        setShowEdit(false);
        abortController?.abort();
    };
    useEffect(() => {
        formikEdit.setValues({content: comment.comment.content});
    }, [refetch]);

    const handleDelete = () => {
        const controller = new AbortController();
        setAbortControllerDel(controller);
        setLoadingDel(true)
        axios
            .delete("/comment/" + comment.comment.id, {
                signal: controller.signal,
                headers: {"x-auth-token": auth.token},
            })
            .then(() => {
                toastMsg("success", "Comment deleted");
                setRefetch(true);
                setLoadingDel(false);
                setShowDelete(false);
                setNumberOfComments(numberOfComments - 1);

            })
            .catch((err) => {
                setLoadingDel(false);
                console.log(err);
            });
    }
    const handleCancelDel = () => {
        setShowDelete(false);
        abortControllerDel?.abort();
    }
    return (
        <div
            className={
                "bg-emerald-100 flex flex-col mb-1 rounded py-1 px-2 " + className
            }
        >
            {showEdit ? (
                <WriteComment formik={formikEdit} handleCancel={handleCancel}/>
            ) : (
                <>
                    <div className="flex md:flex-col md:items-start items-center justify-between">
                        <div>
              <span className="font-semibold">
                {[comment.user?.firstName, comment.user?.lastName].join(" ")}
              </span>
                        </div>
                        <div className="flex gap-2">
              <span className="text-xs text-gray-500">
                {daysFromNow(comment.comment.createdAt)}
              </span>
                            {comment.comment.UserId === auth.id && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowEdit(true)}
                                        className="text-xs hover:text-blue-500"
                                    >
                                        Edit
                                    </button>
                                    <WarningMessage
                                        process={handleDelete}
                                        show={showDelete}
                                        setShow={setShowDelete}
                                        loading={loadingDel}
                                        handleCancel={handleCancelDel}
                                    />
                                    <button
                                        onClick={() => setShowDelete(true)}
                                        className="text-xs hover:text-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between flex-col">
                        <p className="text-sm break-words break-all">
                            {comment.comment.content
                                .trim()
                                .split("\n")
                                .map((line, i) => (
                                    <>
                                        <span key={i}>{line}</span> <br/>
                                    </>
                                ))}
                        </p>
                        <div className="flex self-end gap-2">
                            <button
                                onClick={() => handleLike(comment.comment.id)}
                                className={`text-xs hover:text-blue-500 ${
                                    liked ? "text-blue-500" : "text-gray-500"
                                }`}
                                disabled={loading}
                            >
                                {numLikes} likes
                            </button>
                            <button
                                onClick={() => handleDisLike(comment.comment.id)}
                                className={`text-xs hover:text-red-500 ${
                                    disliked ? "text-red-500" : "text-gray-500"
                                }`}
                                disabled={loading}
                            >
                                {numDislikes} dislikes
                            </button>
                            <button
                                onClick={() => {
                                    setShowReply({
                                        show: true,
                                        id: comment.comment.CommentId || comment.comment.id,
                                    });
                                }}
                                className="text-xs text-gray-500 hover:text-green-500"
                            >
                                reply
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default ShowComment;

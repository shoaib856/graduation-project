import React, { useEffect, useState } from "react";
import {
  HandThumbsUp,
  HandThumbsUpFill,
  HandThumbsDown,
  HandThumbsDownFill,
  ChatFill,
} from "react-bootstrap-icons";
import useAuthValue from "../hooks/useAuthValue";
import axios from "../api/axios";
import Comment from "./Comment";
import daysFromNow from "../utils/daysFromNow";
import AddPost from "./AddPost";
import WarningMessage from "./warningMessage";
import { toastMsg } from "./message-toast";
import base64toImg from "../utils/fromBase64ToImg";
import { Carousel } from "react-bootstrap";

const Post = ({
  post,
  tags,
  images,
  user,
  userLike,
  userDisLike,
  setSearch = null,
  setSelectedUser = null,
  disableBtns = false,
  setRefetch,
  numComments = null,
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [liked, setLiked] = useState(userLike);
  const [numLikes, setNumLikes] = useState(post?.numberOfLikes);
  const [disliked, setDisliked] = useState(userDisLike);
  const [numDislikes, setNumDislikes] = useState(post?.numberOfDisLikes);
  const [showComments, setShowComments] = useState(false);
  const [loadingDel, setLoadingDel] = useState(false);
  const [numberOfComments, setNumberOfComments] = useState(
    numComments || post?.numberOfComments
  );
  const [loading, setLoading] = useState(false);
  const auth = useAuthValue();
  const [abortController, setAbortController] = useState(null);

  const handleLike = async () => {
    setLoading(true);
    await axios
      .post(
        "/post/like/" + post.id,
        {},
        { headers: { "x-auth-token": auth.token } }
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
        // toastMsg("error", err.response.data.message);
      });
  };
  const handleDisLike = async () => {
    setLoading(true);
    await axios
      .post(
        "/post/dislike/" + post?.id,
        {},
        { headers: { "x-auth-token": auth.token } }
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
        // toastMsg("error", err.response.data.message);
      });
  };
  const handleDelete = async () => {
    const controller = new AbortController();
    setAbortController(controller);
    setLoadingDel(true);
    await axios
      .delete("/post/" + post.id, {
        signal: controller.signal,
        headers: { "x-auth-token": auth.token },
      })
      .then(() => {
        toastMsg("success", "Post deleted");
        setRefetch(true);
        setLoadingDel(false);
      })
      .catch((err) => {
        if (abortController?.signal.aborted) {
          console.log("aborted");
        }
        setLoadingDel(false);
        console.error(err);
      });
  };
  const handleCancel = () => {
    abortController?.abort();
    setShowDelete(false);
  };

  return (
    <div className="relative max-w-2xl w-full bg-white shadow-md mx-auto p-3 rounded-md mb-2">
      <div className="bg-black/5 p-2 rounded flex justify-between items-center mb-2 md:flex-col md:items-start md:gap-2">
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-semibold">
            {[user?.firstName, user?.lastName].join(" ")}
          </h3>
          <button
            onClick={() => {
              setSelectedUser(user?.userName);
              setSearch("");
            }}
            className="text-xs text-blue-400 hover:text-blue-600 underline transition-all disabled:text-gray-400 disabled:no-underline"
            disabled={setSelectedUser === null}
          >
            @{user?.userName}
          </button>
        </div>
        <div className="flex gap-2 flex-col items-end md:items-start">
          <div className="flex gap-2">
            {tags?.map((tag, i) => (
              <button
                onClick={() => setSearch(tag)}
                key={i}
                className="form-btn !text-xs px-1 py-0.5 disabled:bg-emerald-100 "
                disabled={setSearch === null}
              >
                {tag}
              </button>
            ))}
          </div>
          {post.UserId === auth.id && (
            <div className="flex gap-2">
              <AddPost
                initialValues={{
                  content: post.content,
                  tags: tags,
                  images: images,
                }}
                show={showEdit}
                setShow={setShowEdit}
                edit={true}
                postID={post.id}
                setRefetch={setRefetch}
              />
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
                handleCancel={handleCancel}
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
      <div className="py-1 px-2">
        <p className="break-words break-all">
          {post?.content
            .trim()
            .split("\n")
            .map((line, i) => (
              <span className="block" key={i}>
                {line}
              </span>
            ))}
        </p>
        {images?.length > 0 && (
          <Carousel className="border bg-black/20 p-0.5 !border-emerald-700 rounded mt-2 !max-w-full">
            {images?.map((image, i) => (
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
        {daysFromNow(post?.createdAt)}
      </span>
      <div className="flex gap-2 mt-2">
        <button
          disabled={loading || disableBtns}
          onClick={handleLike}
          className="form-btn flex items-center gap-1"
        >
          {numLikes}
          {liked ? <HandThumbsUpFill /> : <HandThumbsUp />}
        </button>
        <button
          disabled={loading || disableBtns}
          onClick={handleDisLike}
          className="form-btn flex items-center gap-1"
        >
          {numDislikes}
          {disliked ? <HandThumbsDownFill /> : <HandThumbsDown />}
        </button>

        <button
          onClick={() => setShowComments(true)}
          className="form-btn flex items-center gap-1"
          disabled={disableBtns}
        >
          {numberOfComments}
          <ChatFill />
        </button>

        {showComments && (
          <Comment
            postID={post?.id}
            post={{ post, images, userDisLike, userLike, user, tags }}
            setShow={setShowComments}
            show={showComments}
            setNumberOfComments={setNumberOfComments}
            numberOfComments={numberOfComments}
          />
        )}
      </div>
    </div>
  );
};

export default Post;

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

const Post = ({
  post,
  tags,
  images,
  user,
  userLike,
  userDisLike,
  setSearch = null,
  setSelectedUser = null,
  disableComment = false,
}) => {
  const [liked, setLiked] = useState(userLike);
  const [numLikes, setNumLikes] = useState(post.numberOfLikes);
  const [disliked, setDisliked] = useState(userDisLike);
  const [numDislikes, setNumDislikes] = useState(post.numberOfDisLikes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useAuthValue();

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
        "/post/dislike/" + post.id,
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

  return (
    <div className="relative max-w-2xl w-full bg-emerald-200 mx-auto p-3 rounded-md mb-2">
      <div className="flex justify-between items-center mb-2 md:flex-col md:items-start md:gap-2">
        <div className="flex flex-col items-start">
          <h3 className="text-xl font-semibold">
            {[user.firstName, user.lastName].join(" ")}
          </h3>
          <button
            onClick={() => {
              setSelectedUser(user.userName);
              setSearch("");
            }}
            className="text-xs text-blue-400 hover:text-blue-600 underline transition-all disabled:text-gray-400 disabled:no-underline"
            disabled={setSelectedUser === null}
          >
            @{user.userName}
          </button>
        </div>
        <div className="flex gap-2">
          {tags.map((tag) => (
            <button
              onClick={() => setSearch(tag)}
              key={tag}
              className="form-btn !text-xs px-1 py-0.5 disabled:bg-emerald-100 "
              disabled={setSearch === null}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className="border !border-emerald-700 py-1 px-2 rounded">
        {post.content.split("\n").map((line, i) => {
          return (
            <p key={i} className="break-all break-words">
              {line}
            </p>
          );
        })}
      </div>
      <span className="absolute bottom-2 right-2 text-xs text-gray-400">
        {new Date(post.createdAt).toLocaleString("en-Us").split(",")[0]}
      </span>
      <div className="flex gap-2 mt-2">
        <button
          disabled={loading}
          onClick={handleLike}
          className="form-btn flex items-center gap-1"
        >
          {numLikes}
          {liked ? <HandThumbsUpFill /> : <HandThumbsUp />}
        </button>
        <button
          disabled={loading}
          onClick={handleDisLike}
          className="form-btn flex items-center gap-1"
        >
          {numDislikes}
          {disliked ? <HandThumbsDownFill /> : <HandThumbsDown />}
        </button>

        <button
          onClick={() => setShowComments(true)}
          className="form-btn flex items-center gap-1"
          disabled={disableComment}
        >
          {post.numberOfComments}
          <ChatFill />
        </button>

        {showComments && (
          <Comment
            post={{ post, tags, images, user, userLike, userDisLike }}
            setShow={setShowComments}
            show={showComments}
          />
        )}
      </div>
    </div>
  );
};

export default Post;

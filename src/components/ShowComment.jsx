import { useEffect, useState } from "react";
import useAuthValue from "../hooks/useAuthValue";
import daysFromNow from "../utils/daysFromNow";
import axios from "../api/axios";

const ShowComment = ({ comment, setShowReply, className }) => {
  const auth = useAuthValue();
  const [liked, setLiked] = useState(comment.userLike);
  const [disliked, setDisliked] = useState(comment.userDisLike);
  const [numLikes, setNumLikes] = useState(comment.comment.numberOfLikes);
  const [numDislikes, setNumDislikes] = useState(
    comment.comment.numberOfDisLikes
  );
  const [loading, setLoading] = useState(false);

  const handleLike = async (id) => {
    setLoading(true);
    await axios
      .post(
        "/comment/like/" + id,
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
        console.error(err);
      });
  };
  const handleDisLike = async (id) => {
    setLoading(true);
    await axios
      .post(
        "/comment/dislike/" + id,
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
        toastMsg("error", err.response.data.message);
      });
  };

  return (
    <div
      className={
        "bg-emerald-100 flex flex-col mb-1 rounded py-1 px-2 " + className
      }
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="font-semibold">
            {[comment.user?.firstName, comment.user?.lastName].join(" ")}
          </span>
        </div>
        <div>
          <span className="text-xs text-gray-500">
            {daysFromNow(comment.comment.createdAt)}
          </span>
        </div>
      </div>
      <div className="flex justify-between">
        <p className="text-sm break-words break-all">
          {comment.comment.content
            .trim()
            .split("\n")
            .map((line) => (
              <>
                {line} <br />
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
    </div>
  );
};
export default ShowComment;

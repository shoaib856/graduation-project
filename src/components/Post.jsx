import React, { useState } from "react";
import {
  HandThumbsUp,
  HandThumbsUpFill,
  HandThumbsDown,
  HandThumbsDownFill,
  ChatFill,
} from "react-bootstrap-icons";

const Post = ({ post, tags, images, user }) => {
  const [liked, setLiked] = useState(false);
  return (
    <div className="relative max-w-2xl w-full bg-emerald-200 mx-auto p-3 rounded-md mb-2">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">
          {[user.firstName, user.lastName].join(" ")}
        </h3>
        <div className="flex gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p>{post.content}</p>
      <span className="absolute bottom-2 right-2 text-xs text-gray-400">
        {new Date(post.createdAt).toLocaleString("en-Us").split(",")[0]}
      </span>
      <div className="flex gap-2 mt-2">
        <button className="form-btn flex items-center gap-1">
          {post.numberOfLikes}
          {liked ? <HandThumbsUpFill /> : <HandThumbsUp />}
        </button>
        <button className="form-btn flex items-center gap-1">
          {post.numberOfDisLikes}
          {liked ? <HandThumbsDownFill /> : <HandThumbsDown />}
        </button>
        <button className="form-btn flex items-center gap-1">
          {post.numberOfComments}
          <ChatFill />
        </button>
      </div>
    </div>
  );
};

export default Post;

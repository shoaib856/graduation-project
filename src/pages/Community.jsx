import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";
import { toastMsg } from "../components/message-toast";
import CustomizedAlert from "../components/CustomizedAlert";
import { Alert, Container } from "react-bootstrap";
import AddPost from "../components/AddPost";
import Post from "../components/Post";

const Community = () => {
  const auth = useAuthValue();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [show, setShow] = useState(false);
  const getData = async () => {
    setLoading(true);
    await axios
      .get("/post", {
        headers: {
          "x-auth-token": auth?.token,
        },
      })
      .then((res) => {
        setLoading(false);
        setPosts(res.data.data);
        setError(false);
        setRefetch(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
        setRefetch(false);
      });
  };
  useEffect(() => {
    getData();
  }, [auth, refetch]);
  return (
    <Container>
      <AddPost setRefetch={setRefetch} show={show} setShow={setShow} />
      <Alert
        variant="success"
        className="my-2 flex justify-between items-center sticky top-24 z-10"
      >
        <h2 className="text-xl font-bold">Community</h2>
        <button className="form-btn" onClick={() => setShow(true)}>
          Add Post
        </button>
      </Alert>

      {loading ? (
        <CustomizedAlert
          msg={"Loading..."}
          setRefetch={setRefetch}
          variant={"info"}
          spinner={true}
        />
      ) : error ? (
        <CustomizedAlert
          msg={"Something went wrong, please try again later"}
          setRefetch={setRefetch}
          variant={"danger"}
        />
      ) : posts.length === 0 ? (
        <CustomizedAlert
          msg={"There is No Posts found"}
          variant={"warning"}
          setRefetch={setRefetch}
        />
      ) : (
        posts.map((post) => (
          <Post
            key={post.post.id}
            images={post.images}
            tags={post.tags}
            post={post.post}
            user={post.user}
          />
        ))
      )}
    </Container>
  );
};

export default Community;

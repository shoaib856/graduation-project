import React, {useEffect, useState} from "react";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";
import CustomizedAlert from "../components/CustomizedAlert";
import {Alert, Container, Placeholder} from "react-bootstrap";
import AddPost from "../components/AddPost";
import Post from "../components/Post";
import RefreshBtn from "../components/RefreshBtn";

const Community = () => {
    document.title = "Community";
    const auth = useAuthValue();
    const [posts, setPosts] = useState([]);
    const [filteredPostsByTag, setFilteredPostsByTag] = useState([]);
    const [filteredPostsByUser, setFilteredPostsByUser] = useState([]);
    const [filteredPostsByUserAndTag, setFilteredPostsByUserAndTag] = useState(
        []
    );
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const [show, setShow] = useState(false);

    const [search, setSearch] = useState("");
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
            .catch((err) => {
                setLoading(false);
                setError(true);
                setRefetch(false);
                console.log(err);
            });
    };
    useEffect(() => {
        getData();
    }, [auth, refetch]);
    useEffect(() => {
        if (search && selectedUser) {
            const filteredPosts = filteredPostsByUser.filter((post) =>
                post.tags.includes(search.toLowerCase())
            );
            setFilteredPostsByUserAndTag(filteredPosts);
        } else if (search) {
            const filteredPosts = posts.filter((post) =>
                post.tags.includes(search.toLowerCase())
            );
            setFilteredPostsByTag(filteredPosts);
        } else {
            setFilteredPostsByTag([]);
            setFilteredPostsByUserAndTag([]);
        }
    }, [search]);

    useEffect(() => {
        if (selectedUser) {
            const filteredPosts = posts.filter(
                (post) => post.user.userName === selectedUser
            );
            setFilteredPostsByUser(filteredPosts);
        } else {
            setFilteredPostsByUser([]);
        }
    }, [selectedUser]);
    useEffect(() => {
        console.log(posts);
    }, [posts]);

    return (
        <Container className="self-start">
            <AddPost
                initialValues={{content: "", tags: [], images: []}}
                setRefetch={setRefetch}
                show={show}
                setShow={setShow}
            />

            <div className="px-2 py-1 backdrop-blur my-2 flex flex-col gap-1 sticky top-[5.3rem] md:top-14 z-10">
                <div className="flex flex-wrap justify-between items-center">
                    <h2 className="text-xl font-bold order-1">Community</h2>
                    <div className="order-2 md:!order-3 md:w-full w-80 md:mt-2">
                        <input
                            type="text"
                            placeholder="Search by tag"
                            className="form-control form-field "
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-1 order-3 md:!order-2 ">
                        <button className="form-btn !px-2" onClick={() => setShow(true)}>
                            +
                        </button>
                        <RefreshBtn setRefetch={setRefetch}/>
                    </div>
                </div>
                {selectedUser && (
                    <Alert
                        variant={"success"}
                        className="flex items-center justify-between"
                    >
                        <p>Selected User: {selectedUser}</p>
                        <button
                            className="form-btn"
                            onClick={() => {
                                setSearch("");
                                setSelectedUser(null);
                            }}
                        >
                            Clear
                        </button>
                    </Alert>
                )}
            </div>

            {loading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="max-w-2xl w-full mx-auto rounded mb-1 p-4 bg-emerald-200"
                    >
                        <Placeholder as="p" animation="glow">
                            <Placeholder xs={4}/>
                        </Placeholder>
                        <div className="border rounded !border-emerald-700 p-2">
                            <Placeholder as="p" animation="glow">
                                <Placeholder xs={10}/>
                                <Placeholder xs={5}/>
                                <Placeholder xs={8}/>
                                <Placeholder xs={12}/>
                            </Placeholder>
                        </div>
                    </div>
                ))
            ) : error ? (
                <CustomizedAlert
                    msg={"Something went wrong, please try again later"}
                    variant={"danger"}
                />
            ) : posts.length === 0 ? (
                <CustomizedAlert msg={"There is No Posts found"} variant={"warning"}/>
            ) : selectedUser ? (
                filteredPostsByUser.length === 0 ? (
                    <CustomizedAlert
                        msg={"There is No Posts found"}
                        variant={"warning"}
                    />
                ) : filteredPostsByUserAndTag.length > 0 ? (
                    filteredPostsByUserAndTag.map((post) => (
                        <Post
                            key={post.post.id}
                            images={post.images}
                            tags={post.tags}
                            post={post.post}
                            user={post.user}
                            userLike={post.userLike}
                            userDisLike={post.userDisLike}
                            setSearch={setSearch}
                            setRefetch={setRefetch}
                        />
                    ))
                ) : (
                    filteredPostsByUser.map((post) => (
                        <Post
                            key={post.post.id}
                            images={post.images}
                            tags={post.tags}
                            post={post.post}
                            user={post.user}
                            userLike={post.userLike}
                            userDisLike={post.userDisLike}
                            setSearch={setSearch}
                            setRefetch={setRefetch}
                        />
                    ))
                )
            ) : filteredPostsByTag.length > 0 ? (
                filteredPostsByTag.map((post) => (
                    <Post
                        key={post.post.id}
                        images={post.images}
                        tags={post.tags}
                        post={post.post}
                        user={post.user}
                        userLike={post.userLike}
                        userDisLike={post.userDisLike}
                        setSearch={setSearch}
                        setSelectedUser={setSelectedUser}
                        setRefetch={setRefetch}
                    />
                ))
            ) : (
                posts.map((post) => (
                    <Post
                        key={post.post.id}
                        images={post.images}
                        tags={post.tags}
                        post={post.post}
                        user={post.user}
                        userLike={post.userLike}
                        userDisLike={post.userDisLike}
                        setSearch={setSearch}
                        setSelectedUser={setSelectedUser}
                        setRefetch={setRefetch}
                    />
                ))
            )}
        </Container>
    );
};

export default Community;

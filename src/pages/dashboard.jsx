import {useEffect, useState} from "react";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";
import {Badge, Card, Dropdown, Placeholder} from "react-bootstrap";
import {PersonCircle, ThreeDotsVertical} from "react-bootstrap-icons";
import WarningMessage from "../components/warningMessage";
import {Link} from "react-router-dom";
import Swal from "sweetalert2";
import DefaultUserLogo from "../components/DefaultUserLogo";
import refreshIcon from "../assets/icons/refresh.svg";
import daysFromNow from "../utils/daysFromNow";
import fromBase64ToImg from "../utils/fromBase64ToImg";

function Dashboard() {
    document.title = "FarmVision | Dashboard";
    const auth = useAuthValue();
    const [usersData, setUsersData] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState(false);
    const [show, setShow] = useState(false);
    const [abortController, setAbortController] = useState(null);

    const getUsers = async () => {
        setLoading(true);
        await axios
            .get("/admin/user", {
                headers: {
                    "x-auth-token": auth?.token,
                },
            })
            .then((res) => {
                setLoading(false);
                setRefetch(false);
                setError(false);
                setUsersData(res.data.data);
            })
            .catch((err) => {
                setLoading(false);
                setError(true);
                setRefetch(false);
                setMsg("Something went wrong, please try again later");
                console.error(err);
            });
    };

    const handleDelete = async (id) => {
        const controller = new AbortController();
        setAbortController(controller);

        setLoading(true);
        await axios
            .delete(`/user/${id}`, {
                signal: controller.signal,
                headers: {
                    "x-auth-token": auth?.token,
                },
            })
            .then((res) => {
                setRefetch(true);
                setError(false);
                setLoading(false);
                setMsg(res.data.message);
            })
            .catch((err) => {
                setLoading(false);
                if (err.name === "AbortError" || abortController.aborted?.signal)
                    return;
                setError(true);
                setMsg(
                    err.response.data.message ||
                    "Something went wrong, please try again later"
                );
            });
    };
    const handleCancel = () => {
        abortController?.abort();
    };
    const handleUpdateAdmin = async (id, role) => {
        Swal.fire({
            title: "Select an option",
            input: "select",
            inputOptions: {
                farmer: "farmer",
                engineer: "engineer",
                admin: "admin",
            },
            inputPlaceholder: "Select a role",
            inputValue: role,
            showCancelButton: true,
            confirmButtonText: "Update",
            confirmButtonColor: "#3B82F6",
            cancelButtonText: "Cancel",
        }).then((res) => {
            // Handle the user's selection
            if (res.value) {
                Swal.fire({
                    title: "Are you sure?",
                    confirmButtonText: "Yes",
                    confirmButtonColor: "#3B82F6",
                    showCancelButton: true,
                    cancelButtonText: "Cancel",
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await axios
                            .put(
                                `/admin/user/${id}`,
                                {
                                    role: res.value,
                                },
                                {
                                    headers: {
                                        "x-auth-token": auth.token,
                                        "Content-Type": "application/json",
                                    },
                                }
                            )
                            .then((res) => {
                                setMsg(res.data.message);
                                setError(false);
                                setRefetch(true);
                            })
                            .catch((err) => {
                                setError(true);
                                setRefetch(false);
                                setMsg(
                                    err.response.data.message ||
                                    "Something went wrong, please try again later"
                                );
                            });
                    }
                });
            }
        });
    };
    useEffect(() => {
        getUsers();
    }, [auth, refetch]);

    useEffect(() => {
        if (msg) {
            setTimeout(() => {
                setMsg("");
            }, 3000);
        }
    }, [msg]);

    return (
        <div className="flex flex-col gap-2 text-emerald-600 w-full p-4 bg-white rounded-xl shadow-xl">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-semibold">Dashboard</h1>
                <div className="flex items-center gap-3">
                    <Badge bg={error ? "danger" : "success"}>{msg}</Badge>
                    {error ? (
                        <button onClick={() => setRefetch(true)} className="form-btn">
                            <img src={refreshIcon} alt="Refresh" className="w-5 h-5"/>
                        </button>
                    ) : null}
                </div>
            </div>
            <div
                className="grid gap-2 justify-center"
                style={{
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                }}
            >
                {loading ? (
                    <>
                        {[1, 2, 3, 4, 5, 6].map((n) => {
                            return (
                                <Card key={n} className="rounded-ss-3xl rounded-ee-3xl">
                                    <Card.Body
                                        className="flex items-center gap-2 bg-slate-50 rounded !rounded-ss-3xl !rounded-ee-3xl">
                                        <PersonCircle className=" rounded-full text-9xl text-gray-400"/>
                                        <div className="w-full">
                                            <Placeholder as={Card.Title} animation="glow">
                                                <Placeholder xs={6}/>
                                            </Placeholder>
                                            <Placeholder as={Card.Text} animation="glow">
                                                <Placeholder xs={7}/> <Placeholder xs={4}/>{" "}
                                                <Placeholder xs={4}/> <Placeholder xs={6}/>{" "}
                                                <Placeholder xs={8}/>
                                            </Placeholder>
                                            <Placeholder.Button className="w-full !bg-emerald-400 border-none"/>
                                        </div>
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </>
                ) : (
                    <>
                        {usersData.map((userData) => {
                            return (
                                <Card
                                    key={userData.user.id}
                                    className="rounded-ss-3xl rounded-ee-3xl"
                                >
                                    <Card.Body
                                        className="flex items-center bg-slate-50 rounded !rounded-ss-3xl !rounded-ee-3xl justify-between gap-2">
                                        <div id="user-logo">
                                            {userData.user?.image == "null" ||
                                            userData.user?.image == undefined ? (
                                                <DefaultUserLogo
                                                    dims={"w-16 h-16"}
                                                    nameAbbreviation={
                                                        userData.user.firstName[0]?.toUpperCase() +
                                                        userData.user.lastName[0]?.toUpperCase() || "UK"
                                                    }
                                                />
                                            ) : (
                                                <img
                                                    src={URL.createObjectURL(
                                                        fromBase64ToImg(userData.user.image)
                                                    )}
                                                    alt="User"
                                                    className="rounded-full w-16 h-16"
                                                />
                                            )}
                                        </div>
                                        <div id="user-data" className="flex flex-col flex-1 gap-1">
                                            <Card.Title className="font-bold text-xl flex justify-between">
                                                <p className="truncate w-40">
                                                    {userData.user.userName}
                                                </p>
                                                <Dropdown drop="down">
                                                    <Dropdown.Toggle
                                                        className={`after:!hidden !border-none !bg-transparent text-black`}
                                                    >
                                                        <ThreeDotsVertical/>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="p-2">
                                                        {show && (
                                                            <WarningMessage
                                                                show={show}
                                                                setShow={setShow}
                                                                process={handleDelete}
                                                                param={userData.user.id}
                                                                loading={loading}
                                                                handleCancel={handleCancel}
                                                            />
                                                        )}
                                                        <Dropdown.Item
                                                            disabled={
                                                                userData.user.id === auth.id ||
                                                                (auth.role === "admin" &&
                                                                    userData.user.role === "admin") ||
                                                                userData.user.role === "superAdmin"
                                                            }
                                                            className="hover:text-white text-center hover:bg-red-600 active:bg-red-600"
                                                            onClick={() => setShow(true)}
                                                        >
                                                            Delete
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            disabled={
                                                                userData.user.id === auth.id ||
                                                                (auth.role === "admin" &&
                                                                    userData.user.role === "admin") ||
                                                                userData.user.role === "superAdmin"
                                                            }
                                                            className="hover:text-white text-center hover:bg-yellow-500 active:bg-yellow-500"
                                                            onClick={() =>
                                                                handleUpdateAdmin(
                                                                    userData.user.id,
                                                                    userData.user.role
                                                                )
                                                            }
                                                        >
                                                            Change Role
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Card.Title>
                                            <Card.Text className="text-sm truncate w-44 text-gray-500">
                                                {userData.user.email}
                                            </Card.Text>
                                            <Card.Text className="text-sm text-gray-500">
                                                ({userData.user.role})
                                            </Card.Text>
                                            <Card.Text className="text-xs text-gray-400 absolute bottom-2 right-3">
                                                Joined from:
                                                {daysFromNow(userData.user.createdAt)}
                                            </Card.Text>
                                            <Card.Text className="text-xs text-gray-400 absolute bottom-2 left-2">
                                                updated from:
                                                {daysFromNow(userData.user.updatedAt)}
                                            </Card.Text>

                                            <button
                                                className="form-btn mb-3"
                                                disabled={
                                                    ((auth.role === "admin" &&
                                                            userData.user.role === "admin") ||
                                                        userData.user.role === "superAdmin") &&
                                                    auth.id !== userData.user.id
                                                }
                                            >
                                                {((auth.role === "admin" &&
                                                        userData.user.role === "admin") ||
                                                    userData.user.role === "superAdmin") &&
                                                auth.id !== userData.user.id ? (
                                                    "Disabled"
                                                ) : (
                                                    <Link
                                                        className="block"
                                                        to={`user-details/${userData.user.id}/`}
                                                    >
                                                        Details
                                                    </Link>
                                                )}
                                            </button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            );
                        })}
                    </>
                )}
            </div>
        </div>
    );
}

export default Dashboard;

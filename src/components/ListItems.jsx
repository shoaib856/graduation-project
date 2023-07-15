import {Alert, Badge, ListGroup} from "react-bootstrap";

import {
    Camera2,
    CameraVideoFill,
    ChatLeftTextFill,
    Exclamation,
    ExclamationCircleFill,
    LightbulbFill,
    TagFill,
    ThreeDotsVertical,
    Trash,
} from "react-bootstrap-icons";
import "animate.css";
import WarningMessage from "./warningMessage";
import axios from "../api/axios";
import CustomizedAlert from "./CustomizedAlert";
import {useEffect, useState} from "react";
import RefreshBtn from "./RefreshBtn";
import AnimatePing from "./AnimatePing";
import RequestedItems from "./RequestedItems";
import AnimateBorderSpinner from "./AnimateBorderSpinner";
import FeatureDetails from "../pages/FeatureDetails";
import TagDetails from "../pages/TagDetails";
import {toastMsg} from "./message-toast";
import {useUserData} from "../context/userData";
import ReportDetails from "../pages/ReportDetails.jsx";

const ListItems = ({
                       refetch,
                       setRefetch,
                       type,
                       showPrice = false,
                       auth,
                       setShowAdd = null,
                       detailed = false,
                       mine = false,
                   }) => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState();
    const [empty, setEmpty] = useState(false);
    const [showRequest, setShowRequest] = useState(false);
    const [loadingRequested, setLoadingRequested] = useState(false);
    const [itemRequested, setItemRequested] = useState([]);
    const [newRequest, setNewRequest] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const [id, setId] = useState(null);
    const user = useUserData();

    const deleteItem = async (id) => {
        const controller = new AbortController();
        setAbortController(controller);
        setLoading(true);
        await axios
            .delete(`/${type}/${id}`, {
                signal: controller.signal,
                headers: {
                    "x-auth-token": auth?.token,
                },
            })
            .then(() => {
                toastMsg("success", "Item deleted successfully");
                setRefetch(true);
                setLoading(false);
                setShowDelete(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                if (abortController?.signal.aborted) return;
                setRefetch(false);
                setError(true);
            });
    };
    const handleCancel = () => {
        abortController?.abort();
    };
    const getData = async () => {
        setLoading(true);
        await axios
            .get(`/${type}${mine ? "/getMyReports" : ""}`, {
                headers: {
                    "x-auth-token": auth?.token,
                },
            })
            .then((res) => {
                setLoading(false);
                setItems(res.data.data);
                res.data.data.length === 0 ? setEmpty(true) : setEmpty(false);
                setRefetch(false);
                setError(false);
            })
            .catch((err) => {
                setLoading(false);
                setError(true);
                console.error(err);
            });
    };

    useEffect(() => {
        getData();
    }, [auth, refetch]);

    const getTagRequests = () => {
        setLoadingRequested(true);
        axios
            .get("/tag/getTagRequests", {
                headers: {
                    "x-auth-token": auth?.token,
                },
            })
            .then((res) => {
                setLoadingRequested(false);
                setItemRequested(res.data.data);
            })
            .catch((err) => {
                setLoadingRequested(false);
                console.log(err);
            });
    };
    useEffect(() => {
        type === "tag" ? getTagRequests() : null;
    }, [auth, refetch]);
    useEffect(() => {
        itemRequested.length > 0
            ? itemRequested?.some((item) => item.isAccepted === false)
                ? setNewRequest(true)
                : setNewRequest(false)
            : setNewRequest(false);
    }, [refetch, itemRequested.length]);

    return (
        <>
            {selectedItem ? (
                type === "tag" ? (
                    <TagDetails
                        selectedTag={selectedItem}
                        setSelectedTag={setSelectedItem}
                        setRefetch={setRefetch}
                    />
                ) : type === "feature" ? (
                    <FeatureDetails
                        selectedFeature={selectedItem}
                        setSelectedFeature={setSelectedItem}
                        setRefetch={setRefetch}
                    />
                ) : <ReportDetails
                    selectedReport={selectedItem}
                    setSelectedReport={setSelectedItem}
                    setRefetch={setRefetch}/>
            ) : (
                <>
                    <Alert
                        variant="light"
                        className="flex justify-between !pl-3 text-2xl text-emerald-600 sticky top-0 z-10"
                    >
                        {type.at(0).toUpperCase() + type.slice(1) + "s"} list
                        <div className="flex gap-2">
                            <RequestedItems
                                type={type}
                                items={itemRequested}
                                setShow={setShowRequest}
                                show={showRequest}
                                setRefetch={setRefetch}
                                loadingRequested={loadingRequested}
                            />
                            {type === "tag" && (
                                <button
                                    onClick={() => setShowRequest(true)}
                                    className="relative bg-amber-300 hover:bg-amber-500 rounded"
                                >
                                    <Exclamation className="text-white"/>
                                    {loadingRequested ? (
                                        <AnimateBorderSpinner
                                            className={"absolute -top-1 -right-1 text-emerald-300"}
                                        />
                                    ) : newRequest ? (
                                        <AnimatePing className={"absolute -top-0.5 -right-0.5"}/>
                                    ) : null}
                                </button>
                            )}
                            {setShowAdd && (
                                <button
                                    onClick={() => setShowAdd(true)}
                                    className="form-btn !px-2"
                                >
                                    +
                                </button>
                            )}
                            <RefreshBtn setRefetch={setRefetch}/>
                        </div>
                    </Alert>
                    {loading ? (
                        <CustomizedAlert
                            msg={`Loading ${type + "s"}...`}
                            variant="info"
                            spinner={true}
                        />
                    ) : (
                        <>
                            <ListGroup className="gap-2">
                                {error ? (
                                    <CustomizedAlert
                                        msg={"Something went wrong, please try again later"}
                                        variant="danger"
                                        setRefetch={setRefetch}
                                    />
                                ) : empty ? (
                                    <CustomizedAlert
                                        msg={`No ${type + "s"} found`}
                                        variant="warning"
                                    />
                                ) : items?.length === 0 ? (
                                    <CustomizedAlert
                                        msg={`Loading ${type + "s"}...`}
                                        variant="info"
                                        spinner={true}
                                    />
                                ) : (
                                    items?.map((item) => (
                                        <ListGroup.Item
                                            key={item.id}
                                            className="flex justify-between items-center gap-2 flex-wrap rounded border py-1 non-emerald-hover"
                                        >
                                            <div className="details !break-words !break-all">
                                                <h2 className="flex border-b-2 border-emerald-400 items-center gap-2 text-2xl md:text-xl font-bold">
                                                    {item.type === "error" ? (
                                                        <ExclamationCircleFill className="text-red-600"/>
                                                    ) : item.type === "feedback" ? (
                                                        <ChatLeftTextFill className="text-blue-600"/>
                                                    ) : item.type === "suggestion" ? (
                                                        <LightbulbFill className="text-yellow-600"/>
                                                    ) : item.type === "video" ? (
                                                        <CameraVideoFill className="text-cyan-600"/>
                                                    ) : item.type === "image" ? (
                                                        <Camera2 className="text-indigo-600"/>
                                                    ) : (
                                                        <TagFill className="text-emerald-600"/>
                                                    )}
                                                    {item[type] || item.title}
                                                    {item?.user && (
                                                        <sub className="text-sm text-gray-500 font-thin">
                                                            ({item.user.userName})
                                                        </sub>
                                                    )}
                                                </h2>
                                                <div>
                                                    <p
                                                        className={`text-lg md:text-base max-w-xs w-full break-words break-all`}
                                                    >
                                                        {item.describtion.split("\n").map((line, i) => (
                                                            <span key={i} className="block">
                                {line}
                              </span>
                                                        ))}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {showPrice && (
                                                    <Badge
                                                        bg="success"
                                                        className="text-base md:text-sm p-1"
                                                    >
                                                        {item.price}$
                                                    </Badge>
                                                )}
                                                {showDelete && id === item.id && (
                                                    <WarningMessage
                                                        loading={loading}
                                                        show={showDelete}
                                                        setShow={setShowDelete}
                                                        process={deleteItem}
                                                        handleCancel={handleCancel}
                                                        param={id}
                                                    />
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setShowDelete(true);
                                                        setId(item.id);
                                                    }}
                                                    className="text-2xl disabled:bg-red-200 bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                                                    disabled={
                                                        ((auth?.role === "admin" &&
                                                                item?.user?.role === "admin") ||
                                                            item?.user?.role === "superAdmin") &&
                                                        user?.userName !== item?.user?.userName
                                                    }
                                                >
                                                    <Trash/>
                                                </button>

                                                {!detailed && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                        }}
                                                        className="bg-emerald-400 hover:bg-emerald-600 text-white badge text-2xl p-1"
                                                    >
                                                        <ThreeDotsVertical/>
                                                    </button>
                                                )}
                                            </div>
                                        </ListGroup.Item>
                                    ))
                                )}
                            </ListGroup>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default ListItems;

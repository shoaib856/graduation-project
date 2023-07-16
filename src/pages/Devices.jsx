import {useEffect, useState} from "react";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";
import {ListGroup, Placeholder} from "react-bootstrap";
import {toastMsg} from "../components/message-toast";
import {Trash} from "react-bootstrap-icons";
import CustomizedAlert from "../components/CustomizedAlert";
import WarningMessage from "../components/warningMessage";
import RefreshBtn from "../components/RefreshBtn";

const Devices = () => {
    const auth = useAuthValue();
    const [devices, setDevices] = useState([]);
    const [refetch, setRefetch] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const [id, setId] = useState(null)

    const getData = async () => {
        setLoading(true);
        await axios
            .get(`/token`, {
                headers: {
                    "x-auth-token": auth.token,
                },
            })
            .then((res) => {
                setDevices(res.data.data);
                setLoading(false);
                setRefetch(false);
            })
            .catch((err) => {
                toastMsg("error", "Error loading devices :(");
            });
    };
    const handleDelete = async (id) => {
        const controller = new AbortController();
        setAbortController(controller);
        setDeleteLoading(true);

        await axios
            .delete(`/token/${id}`, {
                signal: controller.signal,
                headers: {
                    "x-auth-token": auth.token,
                },
            })
            .then(() => {
                setDeleteLoading(false);
                setRefetch(true);
                setShowDelete(false);
                toastMsg("success", `Done`);
            })
            .catch((err) => {
                if (abortController?.signal.aborted) {
                    console.log("aborted");
                    return;
                }
                console.log(err);
                setDeleteLoading(false);
            });
    };
    const handleCancel = () => {
        setShowDelete(false);
        setDeleteLoading(false);
        abortController?.abort();
    };

    useEffect(() => {
        getData();
    }, [auth, refetch]);

    return (
        <div className="w-full py-3 px-1 flex flex-col gap-4 items-center bg-white !rounded-xl shadow-xl">
            <div className="flex justify-between w-full px-2 items-center">
                <h1 className="text-4xl text-emerald-600">Devices</h1>
                <RefreshBtn setRefetch={setRefetch} refetch={refetch}/>
            </div>
            <ListGroup className="w-full gap-2">
                {loading ? (
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3, 4, 5].map((item) => {
                            return (
                                <div key={item} className="border px-3 py-2 rounded">
                                    <Placeholder key={item} animation="glow">
                                        <Placeholder xs={6}/>
                                        <Placeholder xs={7}/>
                                    </Placeholder>
                                </div>
                            );
                        })}
                    </div>
                ) : devices.length === 0 ? (
                    <CustomizedAlert msg={"No devices found"} variant={"warning"}/>
                ) : (
                    devices?.map((device) => (
                        <ListGroup.Item
                            key={device.id}
                            className="non-emerald-hover border"
                        >
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-col flex-1">
                                    <h1 className="text-2xl">
                                        {device.deviceType} {device.token === auth.token && "(you)"}
                                    </h1>
                                    <p className="text-lg">{device.osName}</p>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <p className="text-lg">
                                        {
                                            new Date(device.createdAt)
                                                .toLocaleString("en-Us")
                                                .split(",")[0]
                                        }
                                    </p>
                                    <p className="text-lg">
                                        {
                                            new Date(device.createdAt)
                                                .toLocaleString("en-Us")
                                                .split(",")[1]
                                        }
                                    </p>
                                    <p className="text-lg">{device.clientName}</p>
                                </div>
                                <div className="flex flex-col justify-center items-center">
                                    {id === device.id && <WarningMessage
                                        process={handleDelete}
                                        param={device.id}
                                        setShow={setShowDelete}
                                        show={showDelete}
                                        loading={deleteLoading}
                                        handleCancel={handleCancel}
                                    />}
                                    <button
                                        onClick={() => {
                                            setShowDelete(true)
                                            setId(device.id)
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-2xl text-white p-1 rounded disabled:opacity-50"
                                        disabled={device.token === auth.token}
                                    >
                                        <Trash className="text-2xl"/>
                                    </button>
                                </div>
                            </div>
                        </ListGroup.Item>
                    ))
                )}
            </ListGroup>
        </div>
    );
};

export default Devices;

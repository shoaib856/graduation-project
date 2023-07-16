import base64ToImg from "../utils/fromBase64ToImg.js";
import DisplayResults from "./DisplayResults.jsx";
import {useState} from "react";
import {toastMsg} from "./message-toast.jsx";
import useAuthValue from "../hooks/useAuthValue.js";
import WarningMessage from "./warningMessage.jsx";
import axiosImgModel from "../api/axiosImgModel.js";
import {Trash} from "react-bootstrap-icons";

export const ItemInHistory = ({item, setRefetch}) => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false)
    const auth = useAuthValue();
    const [showDelete, setShowDelete] = useState(false);
    const [abortController, setAbortController] = useState(null);
    const deleteItem = async (id) => {
        const controller = new AbortController();
        setAbortController(controller);
        setLoading(true)
        await axiosImgModel
            .post("/imagesModels/delete/" + id, {"x-auth-token": auth.token}, {
                signal: controller?.signal,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            .then(() => {
                setLoading(false);
                setShowDelete(false);
                setRefetch(true);
                toastMsg("success", "Deleted successfully")
            })
            .catch((err) => {
                setLoading(false);
                setShowDelete(false);
                if (err.name === "AbortError") {
                    return;
                }
                setShowDelete(false);
                console.error(err);
            });

    }

    return (<div className={"p-2 rounded bg-emerald-100"}>
        <img className={"w-36 rounded"}
             src={URL?.createObjectURL(base64ToImg(item.resultImage))}
             alt="history"/>
        <p className={"text-sm"}>
            {new Date(item?.createdAt).toDateString()}
        </p>
        <div className={"flex  justify-between"}>
            <button
                className={"form-btn !text-sm !px-2 !py-1"}
                onClick={() => setShow(true)}
            >
                Show Details
            </button>
            <button
                className={"bg-red-300 hover:bg-red-500 rounded text-white !px-2 !py-1"}
                onClick={() => setShowDelete(true)}
            >
                <Trash />
            </button>

        </div>
        <WarningMessage show={showDelete} setShow={setShowDelete} process={deleteItem} param={item.id}
                        loading={loading}/>
        <DisplayResults result={item} show={show} setShow={setShow}/>
    </div>)
}
import {useEffect, useState} from "react";
import axiosImgModel from "../api/axiosImgModel.js";
import useAuthValue from "../hooks/useAuthValue.js";
import {ItemInHistory} from "../components/ItemInHistory.jsx";
import RefreshBtn from "../components/RefreshBtn.jsx";

const History = () => {
    const auth = useAuthValue();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refetch, setRefetch] = useState(true);

    const fetchHistory = async () => {
        setLoading(true);
        await axiosImgModel
            .post("/imagesModels/get", {"x-auth-token": auth.token}, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            .then((res) => {
                console.log("history fetched")
                setLoading(false);
                setRefetch(false)
                setData(res.data.data);
            })
            .catch((err) => {
                setLoading(false);
                console.error(err);
                setRefetch(false)
            });
    }
    useEffect(() => {
        auth && fetchHistory();
    }, [auth, refetch]);
    return (<>
        <div className="flex flex-col gap-2 text-emerald-600 w-full p-4 bg-white rounded-xl shadow-xl">
            <div className={"border-b-2 border-emerald-600 flex justify-between pb-2"}>
                <h2 className={"text-2xl "}>History</h2>
                <RefreshBtn setRefetch={setRefetch} refetch={refetch}/>
            </div>
            {
                loading ? <div className={"flex justify-center gap-3 flex-wrap mx-auto w-full"}>
                        {[1, 2, 3, 4, 5].map((item, index) => {
                            return (
                                <div key={index} className={"animate-pulse flex gap-2"}>
                                    <div className={"w-40 h-52 bg-emerald-100 rounded-lg"}/>
                                </div>
                            )
                        })}
                    </div> :
                    <div className={"flex justify-center gap-3 flex-wrap mx-auto w-full"}>
                        {
                            data.map((item, index) => {
                                return (
                                    <ItemInHistory key={index} item={item} setRefetch={setRefetch}/>
                                )
                            })}
                    </div>
            }
        </div>
    </>)
}
export default History;
import {useEffect, useState} from "react";
import axiosImgModel from "../api/axiosImgModel.js";
import useAuthValue from "../hooks/useAuthValue.js";

const History = () => {
    const auth = useAuthValue();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = async () => {
        console.log("start fetch")
        setLoading(true);
        await axiosImgModel
            .post("/imagesModels/get", {"x-auth-token": auth.token})
            .then((res) => {
                console.log("fetch done")
                console.log(res.data.data)
                setLoading(false);
                setData(res.data.data);
            })
            .catch((err) => {
                setLoading(false);
                console.error(err);
            });
    }
    useEffect(() => {
        fetchHistory();
    }, [auth]);
    return (<>
        <div>
            <h1>History</h1>
        </div>
    </>)
}
export default History;
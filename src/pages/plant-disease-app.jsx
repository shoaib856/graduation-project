import React, {useEffect, useState} from "react";
import axiosImgModel from "../api/axiosImgModel.js";
import axios from "../api/axios.js";
import useAuthValue from "../hooks/useAuthValue.js";
import {useFormik} from "formik";
import DisplayResults from "../components/DisplayResults";
import ShowImage from "../components/ShowImage";
import MarkMultiItems from "../components/MarkMultiItems.jsx";
import CustomizedAlert from "../components/CustomizedAlert.jsx";
import {Alert, ListGroup, Tab, Tabs} from "react-bootstrap";


function PlantDiseaseApp() {
    document.title = "Farm Vision | App";
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [resultVideo, setResultVideo] = useState(null);
    const [showResult, setShowResult] = useState(false)
    const [showResultVideo, setShowResultVideo] = useState(false)
    const [loading, setLoading] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const [error, setError] = useState(false);
    const [features, setFeatures] = useState([]);
    const auth = useAuthValue();
    const [isHover, setIsHover] = useState(false);
    const formikImages = useFormik({
        initialValues: {
            image: null, features: [],
        }, validate: (values) => {
            let errors = {};
            if (!values.image) {
                errors.image = "Required";
            }
            if (!values.features.length) {
                errors.features = "Required";
            }
            return errors;
        }, onSubmit: async (values) => {
            values = {...values, "x-auth-token": auth.token};
            await axiosImgModel
                .post("/imagesModels/process", values, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    setResult(res.data);
                    setShowResult(true)
                })
                .catch((err) => {
                    console.error(err);
                });

        },
    });
    const formikVideo = useFormik({
        initialValues: {
            video: null, features: [],
        }, validate: (values) => {
            let errors = {};
            if (!values.video) {
                errors.video = "Required";
            }
            if (!values.features.length) {
                errors.features = "Required";
            }
            return errors;
        }, onSubmit: async (values) => {
            values = {...values, "x-auth-token": auth.token};
            await axiosImgModel
                .post("/videosModels/process", values, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    setResultVideo(res.data);
                    setShowResult(true)
                })
                .catch((err) => {
                    console.error(err);
                });
        },
    });

    const getFeatures = async () => {
        setLoading(true)
        await axios
            .get("/feature", {
                headers: {
                    "x-auth-token": auth?.token,
                }
            })
            .then((res) => {
                setFeatures(res.data.data);
                setLoading(false)
                setError(false)
            })
            .catch((err) => {
                setLoading(false)
                setError(true)
                console.error(err);
            });
    }
    useEffect(() => {
        getFeatures();
    }, [auth, refetch]);



    return (<div className="text-lg rounded max-w-4xl w-full full-height !flex-col text-left bg-transparent">
        <h1 className="pl-2 pt-2 text-3xl w-full md:text-xl font-bold border-b-2 border-emerald-500">
            Application
        </h1>
        {(result) && <DisplayResults show={showResult} setShow={setShowResult} result={result}/>}
        {(resultVideo) &&
            <DisplayResults show={showResultVideo} setShow={setShowResultVideo} result={resultVideo} video/>}
        <form className="p-3 max-w-2xl w-full mx-auto">
            <Tabs defaultActiveKey="image">
                <Tab eventKey="image" title="Image">
                    <div className={"text-emerald-500 mt-4 flex flex-col gap-2 items-center"}>
                        <div className={"mx-auto"}>
                            <ShowImage width60 formik={formikImages}/>
                        </div>
                        <div className={"flex-1 w-full"}>
                            <p className={"border-b-2 mb-2 border-emerald-600 text-black"}>Choose Model</p>
                            <ListGroup>
                                {error ? (<CustomizedAlert
                                    variant={"danger"}
                                    msg={"Error While Loading Tags"}
                                    setRefetch={setRefetch}
                                />) : loading ? (<CustomizedAlert
                                    variant="info"
                                    msg={"Loading..."}
                                    spinner
                                />) : features?.length > 0 ? (features.map((feature) => (feature.type === "image" &&
                                    <MarkMultiItems
                                        key={feature.id}
                                        formikProps={formikImages.getFieldProps}
                                        itemDescription={feature.describtion}
                                        itemName={feature.feature}
                                        itemType={"features"}
                                        formikValues={formikImages.values}
                                    />))) : (<Alert
                                    variant="warning"
                                    className="border-l-8 border-l-orange-500"
                                >
                                    No Features Till Now!
                                </Alert>)}
                            </ListGroup>
                        </div>
                    </div>
                    <button
                        disabled={formikImages.isSubmitting || !(formikImages.isValid && formikImages.dirty)}
                        onClick={formikImages.handleSubmit}
                        type={"submit"}
                        className="form-btn mt-4 !text-lg w-full"
                    >
                        {formikImages.isSubmitting ? "Loading..." : "Process"}
                    </button>
                </Tab>
                <Tab eventKey="video" title="Video">
                    <div className={"flex flex-col gap-2 items-center p-3"}>
                        <div className={"max-w-lg w-full h-64 border rounded bg-gray-200/40"}>
                            {formikVideo.values.video ? (<video
                                src={URL.createObjectURL(formikVideo.values.video)}
                                className={"w-full h-full"}
                                controls
                            />) : (<div className={"w-full h-full flex justify-center items-center"}>
                                <p className={"text-gray-400 text-xl"}>No Video Selected</p>
                            </div>)}

                        </div>
                        <label className={"form-btn cursor-pointer"}>
                            {formikVideo.values.video ? "Change Video" : "Choose Video"}
                            <input type="file" className={"hidden"}
                                   accept={"video/*"}
                                   onChange={(e) => {
                                       formikVideo.setFieldValue("video", e.currentTarget.files[0]);
                                   }}/>
                        </label>
                        <div className={"w-full flex-1"}>
                            <p className={"border-b-2 mb-2 border-emerald-600 text-black"}>Choose Model</p>
                            <ListGroup>
                                {error ? (<CustomizedAlert
                                    variant={"danger"}
                                    msg={"Error While Loading Tags"}
                                    setRefetch={setRefetch}
                                />) : loading ? (<CustomizedAlert
                                    variant="info"
                                    msg={"Loading..."}
                                    spinner
                                />) : features?.length > 0 ? (features.map((feature) => (
                                    feature.type === "video" &&
                                    <MarkMultiItems
                                        key={feature.id}
                                        formikProps={formikVideo.getFieldProps}
                                        itemDescription={feature.describtion}
                                        itemName={feature.feature}
                                        itemType={"features"}
                                        formikValues={formikVideo.values}
                                    />))) : (<Alert
                                    variant="warning"
                                    className="border-l-8 border-l-orange-500"
                                >
                                    No Features Till Now!
                                </Alert>)}
                            </ListGroup>
                        </div>
                    </div>
                    <button
                        disabled={formikVideo.isSubmitting || !(formikVideo.isValid && formikVideo.dirty)}
                        onClick={formikVideo.handleSubmit}
                        type={"submit"}
                        className="form-btn mt-4 !text-lg w-full"
                    >
                        {formikImages.isSubmitting ? "Loading..." : "Process"}
                    </button>
                </Tab>
            </Tabs>
        </form>
    </div>)
        ;
}

export default PlantDiseaseApp;

import React, {useEffect, useState} from "react";

// import { showResult } from "../components/showResult";
import axiosImgModel from "../api/axiosImgModel.js";
import axios from "../api/axios.js";
import useAuthValue from "../hooks/useAuthValue.js";
import {useFormik} from "formik";
import DisplayResults from "../components/DisplayResults";
import ShowImage from "../components/ShowImage";
import MarkMultiItems from "../components/MarkMultiItems.jsx";
import CustomizedAlert from "../components/CustomizedAlert.jsx";
import {Alert, ListGroup} from "react-bootstrap";

function PlantDiseaseApp() {
    document.title = "Farm Vision | App";
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [resultImg, setResultImg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const [error, setError] = useState(false);
    const [features, setFeatures] = useState([]);
    const auth = useAuthValue();
    const [isHover, setIsHover] = useState(false);
    const formik = useFormik({
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
            console.log(values);
            await axiosImgModel
                .post("/imagesModels/process", values, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },

                })
                .then((res) => {
                    console.log(res.data);
                    setResult(res.data);
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
    }, [auth]);

    return (<div className="text-xl w-full text-left bg-white shadow-lg">
        <h1 className="pl-2 pt-2 text-3xl md:text-xl font-bold border-b-2 border-emerald-500">
            Application
        </h1>
        {result && <DisplayResults result={result}/>}
        <form className="p-3 max-w-4xl w-full mx-auto">
            {/*<Tabs defaultActiveKey="image">*/}
            {/*    <Tabs.Item eventKey="image" title="Image">*/}
            <div className={"text-emerald-500 mt-4 flex md:flex-col gap-2 items-center"}>
                <div className={"mx-auto"}>
                    <ShowImage width60 formik={formik}/>
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
                                formikProps={formik.getFieldProps}
                                itemDescription={feature.describtion}
                                itemName={feature.feature}
                                itemType={"features"}
                                formikValues={formik.values}
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
                disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
                onClick={formik.handleSubmit}
                type={"submit"}
                className="form-btn mt-4 !text-lg w-full"
            >
                {formik.isSubmitting ? "Loading..." : "Process"}
            </button>
            {/*    </Tabs.Item>*/}
            {/*    <Tabs.Item eventKey="video" title="Video">*/}
            {/*        <div className={"flex md:flex-col gap-2 items-center"}>*/}
            {/*            <div className={"mx-auto"}>*/}
            {/*                <ShowImage width60 formik={formik}/>*/}
            {/*            </div>*/}
            {/*            <div className={"flex-1"} >*/}
            {/*                <p className={"border-b-2 mb-2 border-emerald-600 text-black"}>Choose Model</p>*/}
            {/*                <ListGroup>*/}
            {/*                    {error ? (<CustomizedAlert*/}
            {/*                        variant={"danger"}*/}
            {/*                        msg={"Error While Loading Tags"}*/}
            {/*                        setRefetch={setRefetch}*/}
            {/*                    />) : loading ? (<CustomizedAlert*/}
            {/*                        variant="info"*/}
            {/*                        msg={"Loading..."}*/}
            {/*                        spinner*/}
            {/*                    />) : features?.length > 0 ? (features.map((feature) => (*/}
            {/*                        feature.type === "video" &&*/}
            {/*                        <MarkMultiItems*/}
            {/*                            key={feature.id}*/}
            {/*                            formikProps={formik.getFieldProps}*/}
            {/*                            itemDescription={feature.describtion}*/}
            {/*                            itemName={feature.feature}*/}
            {/*                            itemType={"features"}*/}
            {/*                            formikValues={formik.values}*/}
            {/*                        />))) : (<Alert*/}
            {/*                        variant="warning"*/}
            {/*                        className="border-l-8 border-l-orange-500"*/}
            {/*                    >*/}
            {/*                        No Features Till Now!*/}
            {/*                    </Alert>)}*/}
            {/*                </ListGroup>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </Tabs.Item>*/}
            {/*</Tabs>*/}
        </form>
    </div>);
}

export default PlantDiseaseApp;

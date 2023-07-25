import React, {useEffect, useState} from "react";
import {Accordion, ListGroup, Modal} from "react-bootstrap";
import {Download, XCircleFill} from "react-bootstrap-icons";
import base64ToImg from "../utils/fromBase64ToImg.js";
import CustomAccordion from "./CustomAccordion.jsx";
import axiosImgModel from "../api/axiosImgModel.js";
import CustomizedAlert from "./CustomizedAlert.jsx";

const DisplayResults = ({result, show, setShow, video = false}) => {
    const [resultVideo, setResultVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const getVideo = async () => {
        console.log("get video")
        setLoading(true);
        await axiosImgModel.get(`/getVideo/${result?.videoResult}`, {
            responseType: "blob",
        }).then((res) => {
            setResultVideo(res.data);
            setLoading(false);
        }).catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }
    useEffect(() => {
        video && getVideo()
    }, [video])
    return (<Modal centered show={show} onHide={() => setShow(false)}>
        <Modal.Header className="flex justify-between items-center">
            <Modal.Title
                className={"text-3xl text-emerald-600 uppercase"}>{result?.message || "result details"}</Modal.Title>
            <XCircleFill className="close-btn" onClick={() => setShow(false)}/>
        </Modal.Header>
        <Modal.Body>
            <Accordion defaultActiveKey={"0"}>
                {(result?.resultImage || result?.image) && <CustomAccordion header={"Result Image"} eventKey={"0"}>
                    <a
                        download={"result.png"}
                        target={"_blank"}
                        className={"absolute top-5 right-7 p-2 rounded-full bg-white hover:!bg-emerald-400 hover:text-white text-xl"}
                        href={URL?.createObjectURL(base64ToImg(result?.resultImage || result?.image))}>
                        <Download/>
                    </a>
                    <img src={URL?.createObjectURL(base64ToImg(result?.resultImage || result?.image))} alt={"result"}
                         className={"w-full h-full"}/>
                </CustomAccordion>}
                {(result&&video) && <CustomAccordion header={"Result Video"} eventKey={"1"}>
                    {loading ?<>
                    <a
                        download={"result.mp4"}
                        target={"_blank"}
                        className={"absolute top-5 right-7 p-2 rounded-full bg-white hover:!bg-emerald-400 hover:text-white text-xl"}
                        href={URL?.createObjectURL(resultVideo)}>
                        <Download/>
                    </a>
                    <video src={URL.createObjectURL(resultVideo)} controls className={"w-full h-full"}/>
                    </>:<CustomizedAlert variant={"info"} msg={"loading..."} spinner />}
                </CustomAccordion>}

                {result?.diseases && <CustomAccordion header={"Disease"} eventKey={"2"}>
                    <ListGroup>
                        {result.diseases.map((disease, index) => {
                            return (<ListGroup.Item key={index} className={"non-emerald-hover border-none"}>
                                <span className={"text-xl text-emerald-600"}>{disease}</span>
                            </ListGroup.Item>)
                        })}
                    </ListGroup>
                </CustomAccordion>}
                {result?.confidence && <CustomAccordion header={"Confidence"} eventKey={"3"}>
                    <p>percentage: {result?.confidence?.percentage} </p>
                </CustomAccordion>}
                {result?.type && <CustomAccordion header={"Type"} eventKey={"4"}>
                    <p>{result?.type}</p>
                </CustomAccordion>}

            </Accordion>

        </Modal.Body>
        <Modal.Footer>
            <button className={"bg-gray-300 hover:bg-gray-400 hover:text-white py-2 px-6 rounded"}
                    onClick={() => setShow(false)}>
                Close
            </button>

        </Modal.Footer>
    </Modal>);
};

export default DisplayResults;

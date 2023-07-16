import React from "react";
import {Accordion, ListGroup, Modal} from "react-bootstrap";
import {Download, XCircleFill} from "react-bootstrap-icons";
import base64ToImg from "../utils/fromBase64ToImg.js";
import CustomAccordion from "./CustomAccordion.jsx";

const DisplayResults = ({result, show, setShow}) => {

    return (<Modal centered show={show} onHide={() => setShow(false)}>
        <Modal.Header className="flex justify-between items-center">
            <Modal.Title className={"text-3xl text-emerald-600 uppercase"}>{result?.message || "result details"}</Modal.Title>
            <XCircleFill className="close-btn" onClick={() => setShow(false)}/>
        </Modal.Header>
        <Modal.Body>
            <Accordion defaultActiveKey={"0"}>
                <CustomAccordion header={"Result Image"} eventKey={"0"}>
                    <a
                        download={"result.png"}
                        target={"_blank"}
                        className={"absolute top-5 right-7 p-2 rounded-full bg-white hover:!bg-emerald-400 hover:text-white text-xl"}
                        href={URL?.createObjectURL(base64ToImg(result?.resultImage))}>
                        <Download/>
                    </a>
                    <img src={URL.createObjectURL(base64ToImg(result?.resultImage))} alt={"result"}
                         className={"w-full h-full"}/>
                </CustomAccordion>
                <CustomAccordion header={"Disease"} eventKey={"1"}>
                    <ListGroup>
                        {result.diseases.map((disease, index) => {
                            return (<ListGroup.Item key={index} className={"non-emerald-hover border-none"}>
                                <span className={"text-xl text-emerald-600"}>{disease}</span>
                            </ListGroup.Item>)
                        })}
                    </ListGroup>
                </CustomAccordion>
                {result?.confidence && <CustomAccordion header={"Confidence"} eventKey={"2"}>
                    <p>percentage: {result?.confidence?.percentage} </p>
                </CustomAccordion>}
                {result?.type && <CustomAccordion header={"Type"} eventKey={"3"}>
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

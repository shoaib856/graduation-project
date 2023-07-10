import React, { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { XCircleFill } from "react-bootstrap-icons";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";

const DisplayResults = ({ result }) => {
  const auth = useAuthValue();
  const getResultImage = () => {
    axios
      .post(`/getImage/${result.resultImage}`, { "x-auth-token": auth.token })
      .then((res) => {
        console.log(res.data);
      });
  };
  useEffect(() => {
    getResultImage();
    console.log(auth.token);
  }, []);

  return (
    <Modal centered show={true} onHide={() => {}}>
      <Modal.Header className="flex justify-between items-center">
        <Modal.Title>Model Results</Modal.Title>
        <XCircleFill className="close-btn" onClick={() => {}} />
      </Modal.Header>
      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => {}}>
          Close
        </Button>
        <Button variant="primary" onClick={() => {}}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DisplayResults;

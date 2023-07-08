import React, { useState } from "react";
import { ListGroup, Modal } from "react-bootstrap";
import { CheckCircleFill, XCircleFill } from "react-bootstrap-icons";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";
import CustomizedAlert from "./CustomizedAlert";

const RequestedItems = ({
  items,
  type,
  show,
  setShow,
  setRefetch,
  loadingRequested,
}) => {
  const auth = useAuthValue();
  const [loading, setLoading] = useState({ loading: false, id: null });
  const handleAccept = async (id) => {
    setLoading({ loading: true, id });
    await axios
      .put(`/${type}/acceptTagRequest/${id}`, null, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then(() => {
        setLoading({ loading: false, id: null });
        setRefetch(true);
      })
      .catch((err) => {
        setLoading({ loading: false, id: null });
        console.log(err);
      });
  };
  const handleReject = async (id) => {
    setLoading({ loading: true, id });
    await axios
      .put(`/${type}/rejectTagRequest/${id}`, null, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then(() => {
        setLoading({ loading: false, id: null });
        setRefetch(true);
      })
      .catch((err) => {
        setLoading({ loading: false, id: null });
        console.log(err);
      });
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header>
        <Modal.Title>Requested Items</Modal.Title>
        <button>
          <XCircleFill className="close-btn" onClick={() => setShow(false)} />
        </button>
      </Modal.Header>
      <Modal.Body>
        {loadingRequested ? (
          <CustomizedAlert msg={"Loading..."} variant={"info"} spinner={true} />
        ) : items.length === 0 ? (
          <p className="text-center text-xl font-bold bg-amber-200 p-4 rounded">
            No Requested Items
          </p>
        ) : (
          <ListGroup className="flex flex-col gap-2">
            {items?.map((item, i) => (
              <ListGroup.Item
                key={i}
                className="flex justify-between items-center border rounded non-emerald-hover"
              >
                <div className="flex flex-col">
                  <span className="text-lg font-bold break-words break-all">
                    {item[type]}
                  </span>
                  <span className="break-words break-all">
                    {item.describtion}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={item.id === loading.id && loading.loading}
                    onClick={() => handleReject(item.id)}
                    className="disabled:text-red-200 text-2xl text-red-300 hover:text-red-500"
                  >
                    <XCircleFill />
                  </button>
                  <button
                    disabled={item.id === loading.id && loading.loading}
                    onClick={() => handleAccept(item.id)}
                    className="disabled:text-emerald-200 text-2xl text-emerald-300 hover:text-emerald-500"
                  >
                    <CheckCircleFill />
                  </button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default RequestedItems;

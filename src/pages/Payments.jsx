import React, { useEffect, useState } from "react";
import useAuthValue from "../hooks/useAuthValue";
import axios from "../api/axios";
import daysFromNow from "../utils/daysFromNow";
import { Alert, ListGroup, Modal } from "react-bootstrap";
import RefreshBtn from "../components/RefreshBtn";
import {
  Camera2,
  CameraVideoFill,
  ClockHistory,
  TagFill,
  XCircleFill,
} from "react-bootstrap-icons";
import WarningMessage from "../components/warningMessage";
import CustomizedAlert from "../components/CustomizedAlert";

const Payments = () => {
  const auth = useAuthValue();
  const [features, setFeatures] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [loadingFeatures, setLoadingFeatures] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [id, setId] = useState(null);
  const [show, setShow] = useState(false);
  const [payment, setPayment] = useState(null);

  const getFeatures = async () => {
    setLoadingFeatures(true);
    await axios
      .get("/feature/getUserFeatures", {
        headers: { "x-auth-token": auth.token },
      })
      .then((res) => {
        setLoadingFeatures(false);
        setFeatures(res.data.data);
        setRefetch(false);
        setEmpty(res.data.data.length === 0);
      })
      .catch((err) => {
        setLoadingFeatures(false);
        setRefetch(false);
        console.error(err);
      });
  };
  useEffect(() => {
    auth && getFeatures();
  }, [auth, refetch]);

  const deleteFeature = async (id) => {
    const controller = new AbortController();
    setAbortController(controller);
    setLoading(true);
    await axios
      .delete(`/feature/deleteUserFeature/${id}`, {
        signal: controller.signal,
        headers: { "x-auth-token": auth.token },
      })
      .then(() => {
        setRefetch(true);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        if (abortController?.signal.aborted) {
          console.log("aborted");
          return;
        }
        console.error(err);
      });
  };
  const handleCancel = () => {
    abortController?.abort();
  };

  const getMyPaymentHistory = async () => {
    setLoadingPayment(true);
    await axios
      .get("/subscribe/getMyPayments", {
        headers: { "x-auth-token": auth.token },
      })
      .then((res) => {
        setLoadingPayment(false);
        setPayment(res.data.data);
        setRefetch(false);
      })
      .catch((err) => {
        setLoadingPayment(false);
        setRefetch(false);
        console.error(err);
      });
  };
  useEffect(() => {
    auth && getMyPaymentHistory();
  }, [auth, refetch]);

  return (
    <div className="w-full bg-white rounded-lg">
      <div className="flex items-center justify-between border-b-2 border-emerald-600 p-3">
        <h1 className="text-3xl font-semibold">Payments</h1>
        <div className="flex gap-2">
          <History
            items={payment}
            setShow={setShow}
            show={show}
            loading={loadingPayment}
          />
          <button className="form-btn !text-2xl" onClick={() => setShow(true)}>
            <ClockHistory />
          </button>
          <RefreshBtn refetch={refetch} setRefetch={setRefetch} />
        </div>
      </div>
      {loadingFeatures ? (
        <CustomizedAlert msg={"Loading..."} variant={"info"} spinner={true} />
      ) : empty ? (
        <Alert variant="warning" className="text-xl font-bold">
          No Features Purchased yet
        </Alert>
      ) : (
        <ListGroup className="flex flex-col gap-2 p-3">
          {features.map((feature) => (
            <ListGroup.Item
              className="border-none rounded-lg flex justify-between non-emerald-hover"
              key={feature.id}
            >
              <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1 break-words break-all">
                  <h2 className="flex items-center gap-1 text-xl font-medium uppercase text-teal-500">
                    <div className="text-2xl">
                      {feature.type === "video" ? (
                        <CameraVideoFill className="text-cyan-600" />
                      ) : feature.type === "image" ? (
                        <Camera2 className="text-indigo-600" />
                      ) : (
                        <TagFill className="text-emerald-600" />
                      )}
                    </div>
                    {feature.feature}
                  </h2>
                  <p className="text-base break-words break-all first-letter:uppercase">
                    {feature.describtion.split("\n").map((line, i) => (
                      <span className="block" key={i}>
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex gap-1">
                    <span className="text-sm text-gray-500">Price:</span>
                    <span className="text-sm">${feature.price}</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-sm text-gray-500">from:</span>
                    <span className="text-sm">
                      {daysFromNow(feature.createdAt) +
                        " / " +
                        new Date(feature.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
              {id === feature.id && (
                <WarningMessage
                  loading={loading}
                  process={deleteFeature}
                  param={id}
                  setShow={setShowDelete}
                  show={showDelete}
                  handleCancel={handleCancel}
                />
              )}
              <button>
                <XCircleFill
                  className="close-btn"
                  onClick={() => {
                    setShowDelete(true);
                    setId(feature.id);
                  }}
                />
              </button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Payments;

const History = ({ items, loading, show, setShow }) => {
  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header>
        <Modal.Title>History</Modal.Title>
        <button>
          <XCircleFill className="close-btn" onClick={() => setShow(false)} />
        </button>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <CustomizedAlert msg={"Loading..."} variant={"info"} spinner={true} />
        ) : items?.length === 0 ? (
          <Alert className="text-xl font-bol">No Purchases Yet</Alert>
        ) : (
          <ListGroup className="flex flex-col gap-2">
            {items?.map((item, i) => (
              <ListGroup.Item
                key={i}
                className="flex justify-between items-center border rounded non-emerald-hover"
              >
                <div className="flex flex-col">
                  <span className="first-letter:uppercase text-lg break-words break-all">
                    {item.describtion}
                  </span>
                  <span className="text-sm text-gray-500">
                    Date: {new Date(item.createdAt).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Price: ${item.price}
                  </span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
    </Modal>
  );
};

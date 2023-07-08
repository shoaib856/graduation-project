import { Alert, Badge, ListGroup } from "react-bootstrap";

import {
  Dot,
  Exclamation,
  ExclamationCircleFill,
  ThreeDotsVertical,
  Trash,
} from "react-bootstrap-icons";
import "animate.css";
import { Link } from "react-router-dom";
import warningMessage from "./warningMessage";
import axios from "../api/axios";
import CustomizedAlert from "./CustomizedAlert";
import { useEffect, useState } from "react";
import RefreshBtn from "./RefreshBtn";
import AnimatePing from "./AnimatePing";
import RequestedItems from "./RequestedItems";
import AnimateBorderSpinner from "./AnimateBorderSpinner";

const ListItems = ({
  refetch,
  setRefetch,
  type,
  showPrice = false,
  auth,
  setShowAdd,
}) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [msg, setMsg] = useState("");
  const [items, setItems] = useState();
  const [empty, setEmpty] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [loadingRequested, setLoadingRequested] = useState(false);
  const [itemRequested, setItemRequested] = useState([]);
  const [newRequest, setNewRequest] = useState(false);
  const deleteItem = async (id) => {
    setLoading(true);
    await axios
      .delete(`/${type}/${id}`, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then(() => {
        setRefetch(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setRefetch(false);
        setError(true);
      });
  };
  const getData = async () => {
    setLoading(true);
    await axios
      .get(`/${type}`, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then((res) => {
        setLoading(false);
        setItems(res.data.data);
        res.data.data.length === 0 ? setEmpty(true) : setEmpty(false);
        setRefetch(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        console.log(err);
      });
  };

  useEffect(() => {
    getData();
  }, [auth, refetch]);

  const getTagRequests = () => {
    setLoadingRequested(true);
    axios
      .get("/tag/getTagRequests", {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then((res) => {
        setLoadingRequested(false);
        setItemRequested(res.data.data);
      })
      .catch((err) => {
        setLoadingRequested(false);
        console.log(err);
      });
  };
  useEffect(() => {
    type === "tag" ? getTagRequests() : null;
  }, [auth, refetch]);
  useEffect(() => {
    itemRequested.length > 0
      ? itemRequested?.some((item) => item.isAccepted === false)
        ? setNewRequest(true)
        : setNewRequest(false)
      : setNewRequest(false);
  }, [refetch, itemRequested.length]);

  return (
    <>
      <Alert
        variant="light"
        className="flex justify-between !pl-3 text-2xl text-emerald-600 sticky top-0 z-10"
      >
        {type.at(0).toUpperCase() + type.slice(1) + "s"} list
        <div className="flex gap-2">
          <RequestedItems
            type={type}
            items={itemRequested}
            setShow={setShowRequest}
            show={showRequest}
            setRefetch={setRefetch}
            loadingRequested={loadingRequested}
          />
          {type === "tag" && (
            <button
              onClick={() => setShowRequest(true)}
              className="relative bg-amber-300 hover:bg-amber-500 rounded"
            >
              <Exclamation className="text-white" />
              {loadingRequested ? (
                <AnimateBorderSpinner
                  className={"absolute -top-1 -right-1 text-emerald-300"}
                />
              ) : newRequest ? (
                <AnimatePing className={"absolute -top-0.5 -right-0.5"} />
              ) : null}
            </button>
          )}
          <button onClick={() => setShowAdd(true)} className="form-btn !px-2">
            +
          </button>
          <RefreshBtn setRefetch={setRefetch} />
        </div>
      </Alert>
      {loading ? (
        <CustomizedAlert
          msg={`Loading ${type + "s"}...`}
          variant="info"
          spinner={true}
        />
      ) : (
        <>
          <ListGroup className="gap-2">
            {error ? (
              <CustomizedAlert
                msg={"Something went wrong, please try again later"}
                variant="danger"
                setRefetch={setRefetch}
              />
            ) : empty ? (
              <CustomizedAlert
                msg={`No ${type + "s"} found`}
                variant="warning"
              />
            ) : items?.length === 0 ? (
              <CustomizedAlert
                msg={`Loading ${type + "s"}...`}
                variant="info"
                spinner={true}
              />
            ) : (
              items?.map((item) => (
                <ListGroup.Item
                  key={item.id}
                  className="flex justify-between items-center gap-2 flex-wrap rounded border py-1 non-emerald-hover"
                >
                  <div className="details !break-words">
                    <h2 className="text-2xl md:text-xl font-bold">
                      {item[type]}
                    </h2>
                    <div>
                      <p
                        className={`text-lg md:text-base max-w-[150px] w-full break-words truncate`}
                      >
                        {item.describtion}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {showPrice && (
                      <Badge bg="success" className="text-base md:text-sm p-1">
                        {item.price}$
                      </Badge>
                    )}
                    <button
                      onClick={() => warningMessage(deleteItem, item.id)}
                      className="bg-red-500 hover:bg-red-600 text-base md:text-sm cursor-pointer text-white p-1 rounded"
                      disabled={loading}
                    >
                      <Trash className="text-2xl" />
                    </button>

                    <Link
                      to={`./${type}-details/${item.id}`}
                      className="bg-emerald-400 hover:bg-emerald-600 text-white badge text-2xl p-1"
                    >
                      <ThreeDotsVertical />
                    </Link>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </>
      )}
    </>
  );
};

export default ListItems;

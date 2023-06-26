import { Alert, Badge, ListGroup } from "react-bootstrap";

import { ThreeDotsVertical, Trash } from "react-bootstrap-icons";
import "animate.css";
import { Link } from "react-router-dom";
import warningMessage from "./warningMessage";
import axios from "../api/axios";
import { toastMsg } from "./message-toast";

const List = ({
  refetch,
  setRefetch,
  data,
  empty,
  error,
  loading,
  setLoading,
  type,
  showPrice = false,
  auth,
}) => {
  const deleteFeature = async (id) => {
    setLoading(true);
    await axios
      .delete(`/${type}/${id}`, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then((res) => {
        toastMsg("success", res.data.message);
        setRefetch(true);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toastMsg("error", "Something went wrong");
      });
  };
  return (
    <>
      <hr className="my-2" />
      {refetch ? (
        <Alert variant="info">Loading {type + "s"}...</Alert>
      ) : (
        <>
          <Alert variant="light" className="!pl-3 text-2xl text-emerald-600">
            {type + "s"} list
          </Alert>
          <ListGroup className="gap-2">
            {/* 
            // TODO: Add a spinner
            // TODO: Add a error message
            // TODO: Add a refetch button 
            */}

            {empty ? (
              <Alert variant="warning">No {type + "s"} Added</Alert>
            ) : data.length === 0 ? (
              <Alert variant="info">Loading {type + "s"}...</Alert>
            ) : (
              data.map((item) => (
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
                      onClick={() => warningMessage(deleteFeature, item.id)}
                      className="bg-red-500 hover:bg-red-600 text-base md:text-sm cursor-pointer text-white p-1 rounded"
                      disabled={loading}
                    >
                      <Trash className="text-2xl" />
                    </button>

                    <Link
                      to={`./${item}-details/${item.id}`}
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

export default List;

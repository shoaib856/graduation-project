import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";
import { Alert, ListGroup } from "react-bootstrap";
import { toastMsg } from "../components/message-toast";
import { Trash } from "react-bootstrap-icons";

const Devices = () => {
  const auth = useAuthValue();
  const [devices, setDevices] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    await axios
      .get(`/token`, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then((res) => {
        setDevices(res.data.data);
        setLoading(false);
        toastMsg("success", "Devices loaded :)");
        setRefetch(false);
      })
      .catch((err) => {
        toastMsg("error", "Error loading devices :(");
      });
  };
  const handleDelete = async (id) => {
    await axios
      .delete(`/token/${id}`, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then((res) => {
        setRefetch(true);
        toastMsg("success", `${res.data.message} Reloading...`);
      })
      .catch((err) => {
        toastMsg("error", err.response.data.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, [auth, refetch]);
  return (
    <div className="w-full py-3 px-1 flex flex-col gap-4 items-center bg-white !rounded-xl shadow-xl">
      <h1 className="text-4xl w-full text-emerald-600 pl-3">Devices</h1>
      <ListGroup className="w-full gap-2">
        {loading ? (
          <Alert variant="info">Loading Devices... </Alert>
        ) : devices.length === 0 ? (
          <Alert variant="warning">No Devices Found</Alert>
        ) : (
          devices?.map((device) => (
            <ListGroup.Item
              key={device.id}
              className="non-emerald-hover border"
            >
              <div className="flex flex-row justify-between">
                <div className="flex flex-col flex-1">
                  <h1 className="text-2xl">
                    {device.deviceType} {device.token === auth.token && "(you)"}
                  </h1>
                  <p className="text-lg">{device.osName}</p>
                </div>
                <div className="flex flex-col flex-1">
                  <p className="text-lg">
                    {
                      new Date(device.createdAt)
                        .toLocaleString("en-Us")
                        .split(",")[0]
                    }
                  </p>
                  <p className="text-lg">
                    {
                      new Date(device.createdAt)
                        .toLocaleString("en-Us")
                        .split(",")[1]
                    }
                  </p>
                  <p className="text-lg">{device.clientName}</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <button
                    onClick={() => handleDelete(device.id)}
                    className="bg-red-500 hover:bg-red-600 text-2xl text-white p-1 rounded disabled:opacity-50"
                    disabled={device.token === auth.token}
                  >
                    <Trash className="text-2xl" />
                  </button>
                </div>
              </div>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </div>
  );
};

export default Devices;

// const Device = ({ device }) => {
//   return (
//     <div className="flex flex-col gap-2 text-emerald-600 w-full p-4 bg-white rounded-xl shadow-xl">
//       <h1 className="text-4xl w-full rounded-md">{device.name}</h1>
//       <ListGroup>
//         {devices.map((device) => (
//           <ListGroup.Item key={device.id}>
//             <div className="flex flex-row justify-between">
//               <div className="flex flex-col">
//                 <h1 className="text-2xl">{device.device}</h1>
//                 <p className="text-lg">{device.osName}</p>
//               </div>
//               <div className="flex flex-col">
//                 <p className="text-lg">{device.ip}</p>
//                 <p className="text-lg">{device.clientName}</p>
//               </div>
//             </div>
//           </ListGroup.Item>
//         ))}
//       </ListGroup>
//     </div>
//   );
// };

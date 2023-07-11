import React, { useEffect, useState } from "react";
import useAuthValue from "../hooks/useAuthValue";
import axios from "../api/axios";
import daysFromNow from "../utils/daysFromNow";
import { ListGroup } from "react-bootstrap";
import RefreshBtn from "../components/RefreshBtn";

const Payments = () => {
  const auth = useAuthValue();
  const [payments, setPayments] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const url = "/feature/deleteUserFeature/:id";
  
  const getPayments = async () => {
    await axios
      .get("/subscribe/getMyPayments", {
        headers: { "x-auth-token": auth.token },
      })
      .then((res) => {
        setPayments(res.data.data);
        setRefetch(false);
        console.log("done");
      })
      .catch((err) => {
        setRefetch(false);
        console.error(err);
      });
  };
  useEffect(() => {
    auth && getPayments();
  }, [auth, refetch]);

  return (
    <div className="w-full bg-white rounded-lg">
      <div className="flex items-center justify-between border-b-2 border-emerald-600 p-3">
        <h1 className="text-3xl font-semibold">Payments</h1>
        <RefreshBtn refetch={refetch} setRefetch={setRefetch} />
      </div>
      <ListGroup className="flex flex-col gap-2 p-3">
        {payments.map((payment) => (
          <ListGroup.Item
            className="border-none rounded-lg flex flex-col gap-1 non-emerald-hover"
            key={payment.id}
          >
            <div className="flex flex-wrap items-center gap-1 break-words break-all">
              <span className="text-lg font-medium break-words break-all">
                {payment.describtion}
              </span>
            </div>
            <div className="flex gap-1">
              <span className="text-sm text-gray-500">Price:</span>
              <span className="text-sm">{payment.price}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-sm text-gray-500">Date:</span>
              <span className="text-sm">
                {daysFromNow(payment.createdAt) +
                  " / " +
                  new Date(payment.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Payments;

import React from "react";
import { Alert, Spinner } from "react-bootstrap";
import refresh from "../assets/icons/refresh.svg";
import RefreshBtn from "./RefreshBtn";

const CustomizedAlert = ({
  msg,
  variant,
  spinner = false,
  refetch,
  setRefetch,
}) => {
  return (
    <Alert variant={variant} className="flex justify-between items-center">
      <div className="flex gap-3 items-center">
        {spinner && <Spinner animation="border" variant="info" />}
        <p>{msg}</p>
      </div>
      {!(variant === "info") && setRefetch && (
        <RefreshBtn refetch={refetch} setRefetch={setRefetch} />
      )}
    </Alert>
  );
};

export default CustomizedAlert;

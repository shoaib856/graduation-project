import React from "react";
import { Alert, Spinner } from "react-bootstrap";
import refresh from "../assets/icons/refresh.svg";

const CustomizedAlert = ({ msg, variant, spinner = false, setRefetch }) => {
  return (
    <Alert variant={variant} className="flex justify-between items-center">
      <div className="flex gap-3 items-center">
        {spinner && <Spinner animation="border" variant="info" />}
        <p>{msg}</p>
      </div>
      {variant === "danger" && (
        <button onClick={() => setRefetch(true)} className="form-btn">
          <img src={refresh} alt="refresh" className="w-5 h-5" />
        </button>
      )}
    </Alert>
  );
};

export default CustomizedAlert;

import React from "react";
import refresh from "../assets/icons/refresh.svg";

const RefreshBtn = ({ setRefetch, refetch = false }) => {
  return (
    <button
      disabled={refetch}
      type={"button"}
      className="form-btn"
      onClick={() => setRefetch(true)}
    >
      <img className="w-5 h-5" src={refresh} alt="refresh" />
    </button>
  );
};

export default RefreshBtn;

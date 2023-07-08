import React from "react";

const AnimatePing = ({ className }) => {
  return (
    <div className={className}>
      <span className={"relative flex h-3 w-3"}>
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
      </span>
    </div>
  );
};

export default AnimatePing;

import React from "react";

const CustomRow = (props) => {
  return <div className="flex sm:block gap-1">{props.children}</div>;
};

export default CustomRow;

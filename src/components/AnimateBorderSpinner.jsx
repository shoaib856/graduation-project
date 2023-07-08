import React from "react";
import { Spinner } from "react-bootstrap";

const AnimateBorderSpinner = ({ className }) => {
  return <Spinner animation="border" className={className} size="sm" />;
};

export default AnimateBorderSpinner;

import { OverlayTrigger, Tooltip } from "react-bootstrap";

const ShowOnHover = (props) => {
  return (
    <OverlayTrigger
      placement="bottom"
      overlay={<Tooltip id="button-tooltip-2">{props.description}</Tooltip>}
    >
      <span>{props.children}</span>
    </OverlayTrigger>
  );
};

export default ShowOnHover;

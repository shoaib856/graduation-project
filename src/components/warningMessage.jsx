import { Modal } from "react-bootstrap";

const WarningMessage = ({
  show,
  setShow,
  process,
  param = null,
  loading,
  handleCancel = null,
}) => {
  const handleClose = () => {
    setShow(false);
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="text-4xl text-center">Are you sure?</Modal.Body>
      <Modal.Footer className="flex justify-between">
        <button
          className="form-btn"
          onClick={() => {
            param ? process(param) : process();
          }}
          disabled={loading}
        >
          {loading ? "Processing..." : "Yes, do it!"}
        </button>
        <button
          className="text-red-300 hover:text-red-600"
          onClick={() => handleCancel() || handleClose()}
        >
          No, cancel!
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarningMessage;

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
        {!loading?<button
            className="form-btn"
            onClick={() => {
              param ? process(param) : process();
            }}
        >
          YES
        </button>:
            <button
              onClick={handleCancel}
              className={"bg-amber-300 p-2 rounded hover:bg-amber-400"}
            >
              Cancel Operation
            </button>
        }
        <button
          className="text-red-300 hover:text-red-600"
          onClick={handleClose}
        >
          NO
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarningMessage;

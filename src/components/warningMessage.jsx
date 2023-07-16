import {Modal} from "react-bootstrap";
import AnimateBorderSpinner from "./AnimateBorderSpinner.jsx";

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
        console.log("close")
    };
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body className="text-4xl text-center">Are you sure?</Modal.Body>
            <Modal.Footer className="flex justify-between">
                <div className={"flex gap-2"}>
                    <button
                        className="form-btn"
                        onClick={() => {
                            param ? process(param) : process();
                        }}
                        disabled={loading}
                    >
                        {loading ? <>
                            <AnimateBorderSpinner />
                            <span className={"ml-2"}>Processing...</span>
                        </> : "Do it"}
                    </button>
                    {loading && <button
                        onClick={handleCancel}
                        className={"form-btn !bg-amber-400"}
                    >
                        Cancel
                    </button>}
                </div>

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

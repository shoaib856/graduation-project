import React from "react";
import { Trash, XCircleFill } from "react-bootstrap-icons";
import WarningMessage from "./warningMessage";
import { Button } from "react-bootstrap";
import EditableField from "./editableField";
import { toastMsg } from "./message-toast";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";
import SelectBox from "./SelectBox";

const ItemDetails = ({
  formik,
  selectedItem,
  setSelectedItem,
  type,
  setRefetch,
}) => {
  const [showDelete, setShowDelete] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [abortController, setAbortController] = React.useState(null);
  const auth = useAuthValue();

  const deleteItem = async (id) => {
    const controller = new AbortController();
    setAbortController(controller);
    setLoading(true);
    await axios
      .delete(`/${type}/${id}`, {
        signal: controller.signal,
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then((res) => {
        setLoading(false);
        toastMsg("success", res.data.message);
        setSelectedItem(null);
        setRefetch(true);
      })
      .catch((err) => {
        setLoading(false);
        if (err.name === "AbortError" || abortController?.signal.aborted)
          return;
        toastMsg("error", "Something went wrong");
        console.error(err);
      });
  };

  const handleCancel = () => {
    abortController?.abort();
  };

  return (
    <div className="flex flex-col gap-2 text-emerald-600 w-full bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="border-b-2 border-emerald-600 p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <XCircleFill
            className="close-btn"
            onClick={() => setSelectedItem(null)}
          />
          <h1 className="text-3xl font-semibold">
            {type[0]?.toUpperCase() + type.slice(1)} Details
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span>
            Created at:
            {`${new Date(selectedItem?.createdAt).toDateString("en-Us", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}`}
          </span>
          <button
            onClick={() => setShowDelete(true)}
            className="bg-red-500 hover:bg-red-600 text-2xl cursor-pointer text-white p-1 rounded"
          >
            <Trash />
          </button>
          {showDelete && (
            <WarningMessage
              setShow={setShowDelete}
              show={showDelete}
              process={deleteItem}
              loading={loading}
              param={selectedItem.id}
              handleCancel={handleCancel}
            />
          )}
        </div>
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-1 text-lg p-3"
      >
        <EditableField
          beforeEditData={selectedItem[type]}
          formik={formik}
          id={type}
          label={type[0]?.toUpperCase() + type.slice(1)}
        />
        {type === "feature" && (
          <>
            <EditableField
              beforeEditData={selectedItem.price}
              formik={formik}
              id={"price"}
              label={"Price"}
            />
            <SelectBox
              formik={formik}
              id={"type"}
              label={"Type"}
              options={["image", "video", "other"]}
            />
          </>
        )}
        <EditableField
          beforeEditData={selectedItem.describtion}
          formik={formik}
          id={"describtion"}
          label={"Description"}
          as={"textarea"}
        />
        <Button
          type="submit"
          className="mt-3 flex justify-center items-center gap-2 bg-emerald-400 border-none !shadow-none hover:!bg-emerald-600 disabled:bg-emerald-200 disabled:text-emerald-900 font-bold text-lg"
          disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
        >
          {formik.isSubmitting ? "Updating..." : "Update"}
        </Button>
      </form>
    </div>
  );
};

export default ItemDetails;

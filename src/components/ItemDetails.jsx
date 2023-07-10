import { useFormik } from "formik";
import React from "react";
import { Alert, Button, Form, Badge } from "react-bootstrap";
import { PencilSquare, Trash, XCircleFill } from "react-bootstrap-icons";
import { useImmer } from "use-immer";

const ItemDetails = ({ item, setItem, initialValues, type }) => {
  const featureRef = React.useRef();
  const descriptionRef = React.useRef();
  const priceRef = React.useRef();
  const reportTypeRef = React.useRef();

  const [fieldsEnabled, setFieldsEnabled] = useImmer({
    feature: false,
    describtion: false,
    price: false,
  });
  const updatedItemFormik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const handleEnable = (field) => {
    field.disabled = false;
    field.focus();
    setFieldsEnabled((draft) => {
      draft[field.name] = true;
    });
  };
  const handleDisable = (field) => {
    field.disabled = true;
    setFieldsEnabled((draft) => {
      draft[field.name] = false;
    });
    updatedItemFormik.setFieldValue(field.name, selectedFeature[field.name]);
  };
  const handleDisableAll = () => {
    setFieldsEnabled((draft) => {
      Object.keys(draft).forEach((field) => {
        draft[field] = false;
      });
    });

    handleDisable(featureRef.current);
    handleDisable(descriptionRef.current);
    handleDisable(priceRef.current);
  };

  return (
    <div className="flex flex-col gap-2 text-emerald-600 w-full p-4 bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">
          {type[0]?.toUpperCase() + type.slice(1)} Details
        </h1>
        <div className="flex items-center gap-2">
          {new Date(item?.updatedAt) - new Date(item?.createdAt) === 0 ? (
            <>
              Created at:
              {`${new Date(item?.createdAt).toDateString("en-Us", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}`}
            </>
          ) : (
            <>
              last updated at:
              {`${new Date(item?.updatedAt).toDateString("en-Us", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}`}
            </>
          )}
          <button
            onClick={() => {
              warningMessage(deleteFeature, item?.id);
            }}
            className="bg-red-500 hover:bg-red-600 text-2xl cursor-pointer text-white p-1 rounded"
          >
            <Trash />
          </button>
        </div>
      </div>
      <form
        onSubmit={updatedItemFormik.handleSubmit}
        className="flex flex-col gap-1 text-lg"
      >
        <Form.FloatingLabel label="Feature Name">
          <Form.Control
            name="feature"
            {...updatedItemFormik.getFieldProps(Object.keys(initialValues)[0])}
            autoComplete="nope"
            type="text"
            className="form-field disabled:bg-white"
            placeholder="Feature Name"
            required
            ref={featureRef}
            disabled
          />
          {!fieldsEnabled.feature ? (
            <PencilSquare
              onClick={() => {
                handleEnable(featureRef.current);
              }}
              className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
            />
          ) : (
            <XCircleFill
              onClick={() => {
                handleDisable(featureRef.current);
              }}
              className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
            />
          )}
          {updatedItemFormik.touched.feature &&
            updatedItemFormik.errors.feature && (
              <Alert
                variant="danger"
                className="m-0 px-1 py-2 border-l-8 !text-sm"
              >
                {updatedItemFormik.errors.feature}
              </Alert>
            )}
        </Form.FloatingLabel>
        <Form.Group className="relative">
          <Badge className="absolute left-1 bg-transparent text-gray-600/80 font-normal text-base">
            Description
          </Badge>
          <Form.Control
            as="textarea"
            rows={3}
            name="describtion"
            {...updatedItemFormik.getFieldProps("describtion")}
            autoComplete="nope"
            type="text"
            className="form-field pt-4 disabled:bg-white overflow-y-scroll"
            placeholder="Feature Description"
            required
            ref={descriptionRef}
            disabled
          />
          {!fieldsEnabled.describtion ? (
            <PencilSquare
              onClick={() => {
                handleEnable(descriptionRef.current);
              }}
              className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-5 cursor-pointer`}
            />
          ) : (
            <XCircleFill
              onClick={() => {
                handleDisable(descriptionRef.current);
              }}
              className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-5 cursor-pointer`}
            />
          )}
          {updatedItemFormik.touched.describtion &&
            updatedItemFormik.errors.describtion && (
              <Alert
                variant="danger"
                className="m-0 px-1 py-2 border-l-8 !text-sm"
              >
                {updatedItemFormik.errors.describtion}
              </Alert>
            )}
        </Form.Group>
        {type === "report" && (
          <Form.Group className="relative">
            <Badge className="absolute left-1 bg-transparent text-gray-600/80 font-normal text-base">
              Report Type
            </Badge>
            <Form.Control
              as="select"
              name="reportType"
              {...updatedItemFormik.getFieldProps("reportType")}
              autoComplete="nope"
              type="text"
              className="form-field pt-4 disabled:bg-white overflow-y-scroll"
              placeholder="Report Type"
              required
              ref={reportTypeRef}
              disabled
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Form.Control>
            {!fieldsEnabled.reportType ? (
              <PencilSquare
                onClick={() => {
                  handleEnable(reportTypeRef.current);
                }}
                className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-5 cursor-pointer`}
              />
            ) : (
              <XCircleFill
                onClick={() => {
                  handleDisable(reportTypeRef.current);
                }}
                className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-5 cursor-pointer`}
              />
            )}
            {updatedItemFormik.touched.reportType &&
              updatedItemFormik.errors.reportType && (
                <Alert
                  variant="danger"
                  className="m-0 px-1 py-2 border-l-8 !text-sm"
                >
                  {updatedItemFormik.errors.reportType}
                </Alert>
              )}
          </Form.Group>
        )}
        {type === "feature" && (
          <Form.FloatingLabel label="Feature Price">
            <Form.Control
              name="price"
              {...updatedItemFormik.getFieldProps("price")}
              autoComplete="nope"
              type="text"
              className="form-field disabled:bg-white"
              placeholder="Price"
              required
              ref={priceRef}
              disabled
            />
            {!fieldsEnabled.price ? (
              <PencilSquare
                onClick={() => {
                  handleEnable(priceRef.current);
                }}
                className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
              />
            ) : (
              <XCircleFill
                onClick={() => {
                  handleDisable(priceRef.current);
                }}
                className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
              />
            )}
            {updatedItemFormik.touched.price &&
              updatedItemFormik.errors.price && (
                <Alert
                  variant="danger"
                  className="m-0 px-1 py-2 border-l-8 !text-sm"
                >
                  {updatedItemFormik.errors.price}
                </Alert>
              )}
          </Form.FloatingLabel>
        )}
        <Button
          type="submit"
          className="flex justify-center items-center gap-2 bg-emerald-400 border-none !shadow-none hover:!bg-emerald-600 disabled:bg-emerald-200 disabled:text-emerald-900 font-bold text-lg"
          disabled={
            updatedItemFormik.isSubmitting ||
            !(updatedItemFormik.isValid && updatedItemFormik.dirty)
          }
        >
          {updatedItemFormik.isSubmitting ? "Updating..." : "Update"}
        </Button>
      </form>
    </div>
  );
};

export default ItemDetails;

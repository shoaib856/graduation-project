import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthValue from "../hooks/useAuthValue";
import { useImmer } from "use-immer";
import { useFormik } from "formik";
import axios from "../api/axios";
import { toastMsg } from "../components/message-toast";
import * as Yup from "yup";
import { PencilSquare, Trash, XCircleFill } from "react-bootstrap-icons";
import { Alert, Badge, Button, Form } from "react-bootstrap";
import warningMessage from "../components/warningMessage";
import CustomizedAlert from "../components/CustomizedAlert";

const validationSchema = Yup.object({
  feature: Yup.string()
    .required("Required")
    .min(3, "Must be 3 characters or more"),
  describtion: Yup.string()
    .required("Required")
    .min(10, "Must be 10 characters or more"),
  price: Yup.string()
    .required("Required")
    .matches(
      /^[0-9.?]+$/,
      "Phone number must be number and contain only one ."
    ),
});
const FeatureDetails = () => {
  const featureRef = useRef(null);
  const descriptionRef = useRef(null);
  const priceRef = useRef(null);
  const auth = useAuthValue();
  const [selectedFeature, setSelectedFeature] = useState(null);
  const params = useParams();
  const [refetch, setRefetch] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [fieldsEnabled, setFieldsEnabled] = useImmer({
    feature: false,
    describtion: false,
    price: false,
  });
  const getData = async () => {
    try {
      await axios
        .get(`/feature/${params.id}`, {
          headers: {
            "x-auth-token": auth.token,
          },
        })
        .then((res) => {
          setSelectedFeature(res.data.data);
          updateFeatureFormik.setFieldValue("feature", res.data.data.feature);
          updateFeatureFormik.setFieldValue(
            "describtion",
            res.data.data.describtion
          );
          updateFeatureFormik.setFieldValue("price", res.data.data.price);
          setRefetch(false);
        })
        .catch((err) => {
          setError(true);
        });
    } catch (err) {
      toastMsg("error", "Something went wrong");
    }
  };
  const deleteFeature = async (id) => {
    try {
      await axios
        .delete(`/feature/${id}`, {
          headers: {
            "x-auth-token": auth.token,
          },
        })
        .then((res) => {
          toastMsg("success", res.data.message);
          setTimeout(() => {
            navigate("../");
          }, 2000);
        })
        .catch((err) => {
          toastMsg("error", "Something went wrong");
        });
    } catch (err) {
      toastMsg("error", "Something went wrong");
    }
  };
  const updateFeatureFormik = useFormik({
    initialValues: {
      feature: selectedFeature?.feature,
      describtion: selectedFeature?.describtion,
      price: selectedFeature?.price,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (
        values.describtion === selectedFeature.describtion &&
        values.feature === selectedFeature.feature &&
        values.price === selectedFeature.price
      ) {
        toastMsg("info", "Nothing changed");
        return;
      }
      try {
        const editedFields = Object.keys(values).reduce((acc, curr) => {
          if (values[curr] !== selectedFeature[curr]) {
            acc[curr] = values[curr];
          }
          return acc;
        }, {});
        await axios
          .put(`/feature/${params.id}`, editedFields, {
            headers: {
              "x-auth-token": auth.token,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            toastMsg("success", res.data.message);
            setTimeout(() => {
              setRefetch(true);
            }, 2000);
            setSelectedFeature(null);
            handleDisableAll();
          });
      } catch (err) {
        toastMsg("error", "Something went wrong");
        updateFeatureFormik.isSubmitting = false;
      }
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
    updateFeatureFormik.setFieldValue(field.name, selectedFeature[field.name]);
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
  useEffect(() => {
    getData();
  }, [auth, refetch]);

  return (
    <div className="flex flex-col gap-2 text-emerald-600 w-full p-4 bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Feature Details</h1>
        <div className="flex items-center gap-2">
          {new Date(selectedFeature?.updatedAt) -
            new Date(selectedFeature?.createdAt) ===
          0 ? (
            <>
              Created at:
              {`${new Date(selectedFeature?.createdAt).toDateString("en-Us", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}`}
            </>
          ) : (
            <>
              last updated at:
              {`${new Date(selectedFeature?.updatedAt).toDateString("en-Us", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}`}
            </>
          )}
          <button
            onClick={() => {
              warningMessage(deleteFeature, selectedFeature?.id);
            }}
            className="bg-red-500 hover:bg-red-600 text-2xl cursor-pointer text-white p-1 rounded"
          >
            <Trash />
          </button>
        </div>
      </div>
      {error ? (
        <Alert variant="danger" className="w-full flex items-center gap-2">
          Not Found Feature, Redirecting...
          {setTimeout(() => {
            navigate("../");
          }, 1000)}
        </Alert>
      ) : !selectedFeature ? (
        <CustomizedAlert variant="info" msg="Loading..." spinner={true} />
      ) : (
        <>
          <form
            onSubmit={updateFeatureFormik.handleSubmit}
            className="flex flex-col gap-1 text-lg"
          >
            <Form.FloatingLabel label="Feature Name">
              <Form.Control
                name="feature"
                {...updateFeatureFormik.getFieldProps("feature")}
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
              {updateFeatureFormik.touched.feature &&
                updateFeatureFormik.errors.feature && (
                  <Alert
                    variant="danger"
                    className="m-0 px-1 py-2 border-l-8 !text-sm"
                  >
                    {updateFeatureFormik.errors.feature}
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
                {...updateFeatureFormik.getFieldProps("describtion")}
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
              {updateFeatureFormik.touched.describtion &&
                updateFeatureFormik.errors.describtion && (
                  <Alert
                    variant="danger"
                    className="m-0 px-1 py-2 border-l-8 !text-sm"
                  >
                    {updateFeatureFormik.errors.describtion}
                  </Alert>
                )}
            </Form.Group>
            <Form.FloatingLabel label="Feature Price">
              <Form.Control
                name="price"
                {...updateFeatureFormik.getFieldProps("price")}
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
              {updateFeatureFormik.touched.price &&
                updateFeatureFormik.errors.price && (
                  <Alert
                    variant="danger"
                    className="m-0 px-1 py-2 border-l-8 !text-sm"
                  >
                    {updateFeatureFormik.errors.price}
                  </Alert>
                )}
            </Form.FloatingLabel>
            <Button
              type="submit"
              className="flex justify-center items-center gap-2 bg-emerald-400 border-none !shadow-none hover:!bg-emerald-600 disabled:bg-emerald-200 disabled:text-emerald-900 font-bold text-lg"
              disabled={
                updateFeatureFormik.isSubmitting ||
                !(updateFeatureFormik.isValid && updateFeatureFormik.dirty)
              }
            >
              {updateFeatureFormik.isSubmitting ? "Updating..." : "Update"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};
export default FeatureDetails;

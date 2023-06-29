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
  tag: Yup.string().required("Required").min(3, "Must be 3 characters or more"),
  describtion: Yup.string()
    .required("Required")
    .min(10, "Must be 10 characters or more"),
});
const TagDetails = () => {
  const tagRef = useRef(null);
  const descriptionRef = useRef(null);
  const auth = useAuthValue();
  const [selectedTag, setSelectedTag] = useState(null);
  const params = useParams();
  const [refetch, setRefetch] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [fieldsEnabled, setFieldsEnabled] = useImmer({
    tag: false,
    describtion: false,
  });
  const getData = async () => {
    try {
      await axios
        .get(`/tag/${params.id}`, {
          headers: {
            "x-auth-token": auth.token,
          },
        })
        .then((res) => {
          setSelectedTag(res.data.data);
          updateFeatureFormik.setFieldValue("tag", res.data.data.tag);
          updateFeatureFormik.setFieldValue(
            "describtion",
            res.data.data.describtion
          );

          setRefetch(false);
          // toastMsg("success", res.data.message);
        })
        .catch((err) => {
          // toastMsg("error", "Something went wrong");
          setError(true);
        });
    } catch (err) {
      toastMsg("error", "Something went wrong");
    }
  };
  const deleteFeature = async (id) => {
    try {
      await axios
        .delete(`/tag/${id}`, {
          headers: {
            "x-auth-token": auth.token,
          },
        })
        .then((res) => {
          toastMsg("success", res.data.message);
          setTimeout(() => {
            navigate(-1);
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
      tag: selectedTag?.tag,
      describtion: selectedTag?.describtion,
    },
    validationSchema,
    onSubmit: async (values) => {
      if (
        values.describtion === selectedTag.describtion &&
        values.tag === selectedTag.tag
      ) {
        toastMsg("info", "Nothing changed");
        return;
      }
      try {
        const editedFields = Object.keys(values).reduce((acc, curr) => {
          if (values[curr] !== selectedTag[curr]) {
            acc[curr] = values[curr];
          }
          return acc;
        }, {});
        await axios
          .put(`/tag/${params.id}`, editedFields, {
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
            setSelectedTag(null);
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
    updateFeatureFormik.setFieldValue(field.name, selectedTag[field.name]);
  };
  const handleDisableAll = () => {
    setFieldsEnabled((draft) => {
      Object.keys(draft).forEach((field) => {
        draft[field] = false;
      });
    });

    handleDisable(tagRef.current);
    handleDisable(descriptionRef.current);
  };
  useEffect(() => {
    getData();
  }, [auth, refetch]);

  return (
    <div className="flex flex-col gap-2 text-emerald-600 w-full p-4 bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Tag Details</h1>
        <div className="flex items-center gap-2">
          {new Date(selectedTag?.updatedAt) -
            new Date(selectedTag?.createdAt) ===
          0 ? (
            <>
              Created at:
              {`${new Date(selectedTag?.createdAt).toDateString("en-Us", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}`}
            </>
          ) : (
            <>
              last updated at:
              {`${new Date(selectedTag?.updatedAt).toDateString("en-Us", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}`}
            </>
          )}
          <button
            onClick={() => {
              warningMessage(deleteFeature, selectedTag?.id);
            }}
            className="bg-red-500 hover:bg-red-600 text-2xl cursor-pointer text-white p-1 rounded"
          >
            <Trash />
          </button>
        </div>
      </div>
      {error ? (
        <Alert variant="danger" className="w-full flex items-center gap-2">
          Not Found Tag, Redirecting...
          {setTimeout(() => {
            navigate("../");
          }, 1000)}
        </Alert>
      ) : !selectedTag ? (
        <CustomizedAlert variant="info" msg="Loading..." spinner={true} />
      ) : (
        <>
          <form
            onSubmit={updateFeatureFormik.handleSubmit}
            className="flex flex-col gap-1 text-lg"
          >
            <Form.FloatingLabel label="Tag Name">
              <Form.Control
                name="tag"
                {...updateFeatureFormik.getFieldProps("tag")}
                autoComplete="nope"
                type="text"
                className="form-field disabled:bg-white"
                placeholder="Tag Name"
                required
                ref={tagRef}
                disabled
              />
              {!fieldsEnabled.tag ? (
                <PencilSquare
                  onClick={() => {
                    handleEnable(tagRef.current);
                  }}
                  className={`text-emerald-400 hover:text-emerald-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                />
              ) : (
                <XCircleFill
                  onClick={() => {
                    handleDisable(tagRef.current);
                  }}
                  className={`text-red-400 hover:text-red-600 text-2xl absolute top-4 right-2 cursor-pointer`}
                />
              )}
              {updateFeatureFormik.touched.tag &&
                updateFeatureFormik.errors.tag && (
                  <Alert
                    variant="danger"
                    className="m-0 px-1 py-2 border-l-8 !text-sm"
                  >
                    {updateFeatureFormik.errors.tag}
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
                placeholder="Tag Description"
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
export default TagDetails;

import React from "react";

import { useFormik } from "formik";
import {
  Alert,
  Badge,
  Button,
  Col,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import * as Yup from "yup";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";
import { toastMsg } from "../components/message-toast";
import { useEffect, useRef, useState } from "react";
import { ThreeDotsVertical, Trash } from "react-bootstrap-icons";
import "animate.css";
import { Link } from "react-router-dom";
import warningMessage from "../components/warningMessage";

const validationSchema = Yup.object({
  tag: Yup.string().required("Required").min(3, "Must be 3 characters or more"),
  describtion: Yup.string()
    .required("Required")
    .min(10, "Must be 10 characters or more"),
});

const AddTag = () => {
  document.title = "Dashboard | Add Tag";
  const auth = useAuthValue();
  const [tags, setTags] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      tag: "",
      describtion: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log(values);
        await axios
          .post("/tag", values, {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": auth.token,
            },
          })
          .then((res) => {
            toastMsg("success", res.data.message);
            setRefetch(true);
            formik.resetForm();
          });
      } catch (err) {
        toastMsg("error", err.response.data.message);
      }
    },
  });

  const getData = async () => {
    await axios
      .get(`/tag`, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then((res) => {
        setTags(res.data.data);
        res.data.data.length === 0 ? setEmpty(true) : setEmpty(false);
        setRefetch(false);
        toastMsg("success", res.data.message);
      })
      .catch((err) => {
        setError(true);
        toastMsg("error", "Something went wrong");
      });
  };
  const deleteFeature = async (id) => {
    setLoading(true);
    await axios
      .delete(`/tag/${id}`, {
        headers: {
          "x-auth-token": auth.token,
        },
      })
      .then((res) => {
        toastMsg("success", res.data.message);
        setRefetch(true);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toastMsg("error", "Something went wrong");
      });
  };

  useEffect(() => {
    getData();
  }, [auth, refetch]);

  return (
    <div className="flex flex-col gap-2 text-emerald-600 w-full p-4 bg-white rounded-xl shadow-xl overflow-hidden">
      <Alert variant="light" className="!pl-3 text-2xl text-emerald-600">
        Add Tag
      </Alert>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-1 text-lg"
      >
        <Form.FloatingLabel label="Tag Name">
          <Form.Control
            name="tag"
            {...formik.getFieldProps("tag")}
            autoComplete="nope"
            type="text"
            className="form-field"
            placeholder="Tag Name"
            required
          />
          {formik.touched.tag && formik.errors.tag && (
            <Alert
              variant="danger"
              className="mt-1 px-1 py-2 border-l-8 !text-sm"
            >
              {formik.errors.tag}
            </Alert>
          )}
        </Form.FloatingLabel>

        <Form.Group>
          <Form.Control
            as="textarea"
            rows={3}
            name="describtion"
            {...formik.getFieldProps("describtion")}
            autoComplete="nope"
            type="text"
            className="form-field"
            placeholder="Tag Description"
            required
          />
          {formik.touched.describtion && formik.errors.describtion && (
            <Alert
              variant="danger"
              className="mt-1 px-1 py-2 border-l-8 !text-sm"
            >
              {formik.errors.describtion}
            </Alert>
          )}
        </Form.Group>

        <Button
          type="submit"
          className="bg-emerald-400 border-none !shadow-none hover:!bg-emerald-600 disabled:bg-emerald-200 disabled:text-emerald-900 font-bold text-lg"
          disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
        >
          {formik.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
      <hr className="my-2" />
      {refetch ? (
        <Alert variant="info">Loading Tags...</Alert>
      ) : (
        <>
          <Alert variant="light" className="!pl-3 text-2xl text-emerald-600">
            Tags list
          </Alert>
          <ListGroup className="gap-2">
            {empty ? (
              <Alert variant="warning"> No Tags Added </Alert>
            ) : tags.length === 0 ? (
              <Alert variant="info">Loading Tags...</Alert>
            ) : (
              tags.map((tag) => (
                <ListGroup.Item
                  key={tag.id}
                  className="flex justify-between items-center gap-2 flex-wrap rounded border py-1 non-emerald-hover"
                >
                  <div className="details !break-words">
                    <h2 className="text-2xl md:text-xl font-bold">{tag.tag}</h2>
                    <div>
                      <p
                        className={`text-lg md:text-base max-w-[150px] w-full break-words truncate`}
                      >
                        {tag.describtion}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => warningMessage(deleteFeature, tag.id)}
                      className="bg-red-500 hover:bg-red-600 text-base md:text-sm cursor-pointer text-white p-1 rounded"
                      disabled={loading}
                    >
                      <Trash className="text-2xl" />
                    </button>
                    <Link
                      to={`./tag-details/${tag.id}`}
                      className="bg-emerald-400 hover:bg-emerald-600 text-white badge text-2xl p-1"
                    >
                      <ThreeDotsVertical />
                    </Link>
                  </div>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </>
      )}
    </div>
  );
};

export default AddTag;

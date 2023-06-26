import "animate.css";
import List from "../components/list";
import { useFormik } from "formik";
import useAuthValue from "../hooks/useAuthValue";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Alert, Badge, Container, Form } from "react-bootstrap";
import InputField from "../components/inputField";
import { toastMsg } from "../components/message-toast";

const validationSchema = Yup.object({
  tag: Yup.string().required("Required").min(3, "Must be 3 characters or more"),
  describtion: Yup.string()
    .required("Required")
    .min(10, "Must be 10 characters or more"),
});
let initialValues = {
  tag: "",
  describtion: "",
};

const AddFeature = () => {
  const auth = useAuthValue();
  const [tags, setTags] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  document.title = "Dashboard | Add Tag";
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios
          .post(`/tag`, values, {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": auth.token,
            },
          })
          .then((res) => {
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
      })
      .catch((err) => {
        setError(true);
        console.log(err);
        toastMsg("error", "Something went wrong, please try again later");
      });
  };

  useEffect(() => {
    getData();
  }, [auth, refetch]);

  return (
    <>
      <div className="flex flex-col gap-2 text-emerald-600 w-full p-4 bg-white rounded-xl shadow-xl overflow-hidden">
        <Alert variant="light" className="!pl-3 text-2xl text-emerald-600">
          Add Tag
        </Alert>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-1 text-lg"
        >
          <InputField
            Label="Name"
            type="text"
            placeholder="Enter name"
            id="tag"
            formikProps={formik.getFieldProps}
            errors={formik.errors}
            touched={formik.touched}
          />
          <Form.Group className="mb-2">
            <Container fluid className="flex justify-between items-center pb-1">
              <label htmlFor="describtion">Describtion</label>
              {formik.errors.describtion && formik.touched.describtion ? (
                <Badge bg="danger">{formik.errors.describtion}</Badge>
              ) : null}
            </Container>
            <Form.Control
              as="textarea"
              rows={3}
              className="form-field"
              placeholder="Enter describtion"
              id="describtion"
              {...formik.getFieldProps("describtion")}
            />
          </Form.Group>

          <button
            type="submit"
            className="form-btn"
            disabled={formik.isSubmitting || !(formik.isValid && formik.dirty)}
          >
            {formik.isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
        <List
          refetch={refetch}
          setRefetch={setRefetch}
          data={tags}
          empty={empty}
          error={error}
          loading={loading}
          setLoading={setLoading}
          type="tag"
          auth={auth}
        />
      </div>
    </>
  );
};

export default AddFeature;

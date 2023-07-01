import { Container } from "react-bootstrap";
import InputField from "../components/inputField";
import { useFormik } from "formik";
import * as Yup from "yup";

function Contact() {
  const formik = useFormik({
    initialValues: {
      title: "",
      describtion: "",
    },
    onSubmit: async (values) => {
      console.log(values);
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      describtion: Yup.string().required("Required"),
    }),
  });

  return (
    <Container fluid>
      <h1 className="text-2xl">Contact</h1>
      <div className="flex flex-col gap-2">
        <InputField
          Label="Title"
          type={"text"}
          errors={formik.errors}
          formikProps={formik.getFieldProps}
          id={"title"}
          touched={formik.touched}
          placeholder="Name"
        />
        <div className="form-group">
          <label htmlFor="describtion">Message</label>
          <textarea
            className="form-control form-field"
            id="describtion"
            rows="3"
            placeholder="Message"
            {...formik.getFieldProps("describtion")}
          ></textarea>
        </div>

        <button onClick={formik.handleSubmit} className="btn btn-primary">
          Submit
        </button>
      </div>
    </Container>
  );
}

export default Contact;

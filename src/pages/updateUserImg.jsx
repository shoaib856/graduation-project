import { useFormik } from "formik";
import { useState } from "react";
import { Form, Container, Button } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import axios from "../api/axios";

const UpdateUserImg = () => {
  const [image, setImage] = useState();
  const formik = useFormik({
    initialValues: {
      image: "",
    },
    onSubmit: async (values) => {
      try {
        await axios
          .post("/logo", values, {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": auth.token,
            },
          })
          .then((res) => {
            toastMsg("success", res.data.message);
            formik.resetForm();
          });
      } catch (err) {
        console.log(err);
        toastMsg("error", err.response.data.message);
      }
    },
  });

  return (
    <div className="w-full py-3 px-1 flex flex-col gap-5 items-center bg-white !rounded-xl shadow-xl">
      <h1 className="text-4xl w-full rounded-md text-emerald-600 pl-2">
        Change Logo
      </h1>
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col gap-2 w-full"
      >
        <Container className="cover-img flex justify-center py-3" fluid>
          {image ? (
            <Image
              roundedCircle
              className="max-w-[150px] w-full py-3 relative z-[1]"
              src={URL.createObjectURL(image)}
              alt="profile-image"
            />
          ) : (
            <PersonCircle className="text-black text-8xl z-[1] relative bg-white rounded-full" />
          )}
        </Container>

        <Form.Control
          type="file"
          className="file-choice-field"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <Button type="submit" variant="warning" className="bg-yellow-500">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default UpdateUserImg;

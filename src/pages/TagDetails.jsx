import useAuthValue from "../hooks/useAuthValue";
import { useFormik } from "formik";
import axios from "../api/axios";
import { toastMsg } from "../components/message-toast";
import * as Yup from "yup";

import ItemDetails from "../components/ItemDetails";

const validationSchema = Yup.object({
  tag: Yup.string().required("Required").min(3, "Must be 3 characters or more"),
  describtion: Yup.string()
    .required("Required")
    .min(10, "Must be 10 characters or more"),
});
const TagDetails = ({ selectedTag, setSelectedTag, setRefetch }) => {
  const auth = useAuthValue();

  const updateTagFormik = useFormik({
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
          .put(`/tag/${selectedTag.id}`, editedFields, {
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
        console.error(err);
        toastMsg("error", "Something went wrong");
        updateTagFormik.isSubmitting = false;
      }
    },
  });

  return (
    <ItemDetails
      formik={updateTagFormik}
      selectedItem={selectedTag}
      setSelectedItem={setSelectedTag}
      type={"tag"}
      setRefetch={setRefetch}
    />
  );
};
export default TagDetails;

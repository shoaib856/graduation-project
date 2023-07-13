import useAuthValue from "../hooks/useAuthValue";
import { useFormik } from "formik";
import axios from "../api/axios";
import { toastMsg } from "../components/message-toast";
import * as Yup from "yup";
import ItemDetails from "../components/ItemDetails";

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
const FeatureDetails = ({
  selectedFeature,
  setSelectedFeature,
  setRefetch,
}) => {
  const auth = useAuthValue();

  const updateFeatureFormik = useFormik({
    initialValues: {
      feature: selectedFeature?.feature,
      describtion: selectedFeature?.describtion,
      price: selectedFeature?.price,
      type: selectedFeature?.type,
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
          .put(`/feature/${selectedFeature.id}`, editedFields, {
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
          });
      } catch (err) {
        toastMsg("error", "Something went wrong");
        updateFeatureFormik.isSubmitting = false;
      }
    },
  });

  return (
    <ItemDetails
      formik={updateFeatureFormik}
      selectedItem={selectedFeature}
      setSelectedItem={setSelectedFeature}
      type={"feature"}
      setRefetch={setRefetch}
    />
  );
};
export default FeatureDetails;

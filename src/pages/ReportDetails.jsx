import React from "react";
import ItemDetails from "../components/ItemDetails";
import { useFormik } from "formik";
import { toastMsg } from "../components/message-toast";
import useAuthValue from "../hooks/useAuthValue";

const ReportDetails = ({ selectedReport, setSelectedReport, setRefetch }) => {
    const auth = useAuthValue();
  const updateReportFormik = useFormik({
    initialValues: {
      title: selectedReport?.title,
      description: selectedReport?.description,
      type: selectedReport?.type,
    },
    validationSchema: null,
    onSubmit: async (values) => {
      if (
        values.title === selectedReport.title &&
        values.description === selectedReport.description
      ) {
        toastMsg("info", "Nothing changed");
        return;
      }
      try {
        const editedFields = Object.keys(values).reduce((acc, curr) => {
          if (values[curr] !== selectedReport[curr]) {
            acc[curr] = values[curr];
          }
          return acc;
        }, {});
        await axios
          .put(`/report/${selectedReport.id}`, editedFields, {
            headers: {
              "x-auth-token": auth.token,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            toastMsg("success", res.data.message);
            setRefetch(true);
            setSelectedReport(null);
          });
      } catch (err) {
        console.error(err);
        toastMsg("error", "Something went wrong");
        updateReportFormik.isSubmitting = false;
      }
    },
  });

  return (
    <ItemDetails
      selectedItem={selectedReport}
      setSelectedItem={setSelectedReport}
      setRefetch={setRefetch}
      type="report"
      formik={null}
    />
  );
};

export default ReportDetails;

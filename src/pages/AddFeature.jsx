import ListItems from "../components/ListItems";
import useAuthValue from "../hooks/useAuthValue";
import * as Yup from "yup";
import { useState } from "react";
import AddItem from "../components/AddItem";

const AddFeature = () => {
  const auth = useAuthValue();
  const [features, setFeatures] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  document.title = "Dashboard | Add Feature";

  const validationSchema = Yup.object({
    feature: Yup.string()
      .required("Required")
      .min(3, "Must be 3 characters or more"),
    describtion: Yup.string()
      .required("Required")
      .min(10, "Must be 10 characters or more"),
    price: Yup.number().required("Required"),
  });

  const initialValues = {
    feature: "",
    describtion: "",
    price: 0,
  };

  return (
    <div className="flex flex-col gap-2 text-emerald-600 w-full p-4 bg-white rounded-xl shadow-xl overflow-hidden">
      <AddItem
        initialValues={initialValues}
        refetch={refetch}
        setEmpty={setEmpty}
        setRefetch={setRefetch}
        setError={setError}
        error={error}
        setItems={setFeatures}
        type="feature"
        validationSchema={validationSchema}
        auth={auth}
      />
      <ListItems
        data={features}
        empty={empty}
        error={error}
        loading={loading}
        setRefetch={setRefetch}
        auth={auth}
        refetch={refetch}
        setLoading={setLoading}
        showPrice={true}
        type="feature"
        setError={setError}
      />
    </div>
  );
};

export default AddFeature;

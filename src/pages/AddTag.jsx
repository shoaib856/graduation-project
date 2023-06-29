import ListItems from "../components/ListItems";
import useAuthValue from "../hooks/useAuthValue";
import { useState } from "react";
import * as Yup from "yup";

import AddItem from "../components/AddItem";

const AddFeature = () => {
  const auth = useAuthValue();
  const [tags, setTags] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  document.title = "Dashboard | Add Tag";

  const validationSchema = Yup.object({
    tag: Yup.string()
      .required("Required")
      .min(3, "Must be 3 characters or more"),
    describtion: Yup.string()
      .required("Required")
      .min(10, "Must be 10 characters or more"),
  });
  const initialValues = {
    tag: "",
    describtion: "",
  };
  return (
    <>
      <div className="flex flex-col gap-2 text-emerald-600 w-full p-4 bg-white rounded-xl shadow-xl overflow-hidden">
        <AddItem
          auth={auth}
          initialValues={initialValues}
          refetch={refetch}
          setRefetch={setRefetch}
          setEmpty={setEmpty}
          setError={setError}
          error={error}
          setItems={setTags}
          type="tag"
          validationSchema={validationSchema}
        />
        <ListItems
          refetch={refetch}
          setRefetch={setRefetch}
          data={tags}
          empty={empty}
          error={error}
          loading={loading}
          setLoading={setLoading}
          type="tag"
          auth={auth}
          setError={setError}
        />
      </div>
    </>
  );
};

export default AddFeature;

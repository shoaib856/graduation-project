import ListItems from "../components/ListItems";
import useAuthValue from "../hooks/useAuthValue";
import { useState } from "react";
import * as Yup from "yup";

import AddItem from "../components/AddItem";

const AddFeature = () => {
  const auth = useAuthValue();
  const [refetch, setRefetch] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
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
          setRefetch={setRefetch}
          type="tag"
          validationSchema={validationSchema}
          show={showAdd}
          setShow={setShowAdd}
        />
        <ListItems
          refetch={refetch}
          setRefetch={setRefetch}
          type="tag"
          auth={auth}
          setShowAdd={setShowAdd}
        />
      </div>
    </>
  );
};

export default AddFeature;

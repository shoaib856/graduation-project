import React, { useEffect, useState } from "react";
import ListItems from "../components/ListItems";
import useAuthValue from "../hooks/useAuthValue";
import ItemDetails from "../components/ItemDetails";
import axios from "../api/axios";

const Reports = () => {
  document.title = "Dashboard | Reports";
  const auth = useAuthValue();
  const [refetch, setRefetch] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const initialValues = {
    title: selectedItem ? selectedItem.title : "",
    describtion: selectedItem ? selectedItem.describtion : "",
    type: selectedItem ? selectedItem.type : "",
  };
  useEffect(() => {
    if (selectedItem) {
      document.title = `Dashboard | ${selectedItem.title}`;
    } else {
      document.title = `Dashboard | Reports`;
    }
  }, [selectedItem]);
  
  return (
    <div className="w-full ">
      {selectedItem ? (
        <ItemDetails
          item={selectedItem}
          setItem={setSelectedItem}
          initialValues={initialValues}
          type={"report"}
        />
      ) : (
        <ListItems
          type="report"
          auth={auth}
          refetch={refetch}
          setRefetch={setRefetch}
          setSelectedItem={setSelectedItem}
        />
      )}
    </div>
  );
};

export default Reports;

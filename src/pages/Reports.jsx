import React, { useState } from "react";
import ListItems from "../components/ListItems";
import useAuthValue from "../hooks/useAuthValue";
import { useLocation } from "react-router-dom";

const Reports = () => {
  document.title = "Dashboard | Reports";
  const auth = useAuthValue();
  const [refetch, setRefetch] = useState(false);
  const location = useLocation();
  const mine = location.pathname === "/profile/reports/";

  return (
    <div className="w-full ">
      <ListItems
        type="report"
        auth={auth}
        refetch={refetch}
        setRefetch={setRefetch}
        detailed={!mine}
        mine={mine}
      />
    </div>
  );
};

export default Reports;

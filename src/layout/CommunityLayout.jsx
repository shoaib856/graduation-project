import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const CommunityLayout = () => {
  return (
    <Suspense>
      <Outlet />
    </Suspense>
  );
};

export default CommunityLayout;

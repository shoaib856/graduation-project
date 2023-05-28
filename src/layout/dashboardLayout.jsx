import { Outlet } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import { Suspense } from "react";
import { Container } from "react-bootstrap";

const DashboardLayout = () => {
  return (
    <Container fluid className="!px-0 flex gap-3 md:flex-col md:items-center">
      <aside className="!max-h-full max-w-xs md:max-w-lg w-full rounded">
        <DashboardNavbar />
      </aside>
      <div className="flex mx-auto flex-1 max-w-5xl md:max-w-lg w-full">
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </Container>
  );
};

export default DashboardLayout;

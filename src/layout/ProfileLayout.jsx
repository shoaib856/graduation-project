import { Navigate, Outlet, useNavigate } from "react-router-dom";
import ProfileNavbar from "../components/ProfileNavbar";
import { Container } from "react-bootstrap";
import { Suspense, useEffect } from "react";
import useAuthValue from "../hooks/useAuthValue";
import { toastMsg } from "../components/message-toast";

const ProfileLayout = () => {
  const auth = useAuthValue();
  const navigate = useNavigate();
  useEffect(() => {
    if (!auth) {
      toastMsg("error", "You are not authorized, please login first");
      navigate("../");
    }
  }, []);
  return (
    <Container fluid className="!px-0 flex gap-3 md:flex-col md:items-center">
      <aside className="!max-h-full max-w-xs w-full md:min-w-full rounded">
        <ProfileNavbar />
      </aside>
      <div className="flex justify-center items-center flex-1 max-w-5xl w-full mx-auto">
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </Container>
  );
};

export default ProfileLayout;

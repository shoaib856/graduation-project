import { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";
const NavBar = lazy(() => import("../components/navbar"));
import Loader from "../components/loader";
import useLoaderValue from "../hooks/useLoaderValue";
const Footer = lazy(() => import("../components/footer"));

function RootLayout() {
  const loader = useLoaderValue();
  return (
    <>
      <NavBar />
      <Suspense fallback={<Loader />}>
        <main className="full-height">
          <Outlet />
        </main>
      </Suspense>
      {loader && <Loader />}
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default RootLayout;

import { Navbar } from "react-bootstrap";
import { ArrowReturnRight } from "react-bootstrap-icons";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";

const DashboardNavbar = () => {
  const location = useLocation();
  const userDetailsPath = location.pathname.includes("user-details");
  const params = useParams();

  return (
    <Navbar
      expand="md"
      expanded
      className="flex flex-col gap-1 md:flex-row md:px-3"
    >
      <Link to={"./"} className="text-2xl font-bold navbar-brand">
        Dashboard
      </Link>
      <Navbar.Toggle />
      <Navbar.Collapse className="w-full">
        <nav className="list-group w-full font-bold">
          <div className="flex flex-col">
            <div className="flex bg-white border rounded-t-md -mb-px">
              <NavLink
                to={"./"}
                className="list-group-item w-full border-none "
              >
                Users
              </NavLink>
            </div>

            {userDetailsPath && (
              <div>
                <div className="flex gap-1">
                  <ArrowReturnRight className="self-center text-4xl" />
                  <NavLink
                    to={`./user-details/${params.id}/`}
                    className="list-group-item border-none w-full"
                  >
                    User Details
                  </NavLink>
                </div>

                <div className="flex gap-1">
                  <ArrowReturnRight className="self-center text-4xl" />
                  <NavLink
                    to={`./user-details/${params.id}/edit-pwd/`}
                    className="list-group-item border-none w-full"
                  >
                    Edit Password
                  </NavLink>
                </div>
              </div>
            )}
          </div>
          <NavLink to={"./add-user/"} className="list-group-item border-none ">
            Add User
          </NavLink>
          <NavLink to={"./features/"} className="list-group-item border-none ">
            Features
          </NavLink>
          <NavLink to={"./tags/"} className="list-group-item border-none ">
            Tags
          </NavLink>
          <NavLink to={"./reports/"} className="list-group-item border-none ">
            Reports
          </NavLink>
        </nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default DashboardNavbar;

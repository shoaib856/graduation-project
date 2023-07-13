import { Navbar } from "react-bootstrap";
import { Link, NavLink, useLocation } from "react-router-dom";

const ProfileNavbar = () => {
  const location = useLocation();
  return (
    <Navbar expand="md" className="flex flex-col gap-1 md:flex-row md:px-3">
      <Link to={"./"} className="text-2xl font-bold navbar-brand">
        Profile
      </Link>
      <Navbar.Toggle />
      <Navbar.Collapse className="w-full">
        <nav className="list-group w-full">
          <NavLink to={"./"} className="list-group-item">
            Profile
          </NavLink>
          <NavLink to={"./edit-pwd/"} className="list-group-item">
            Change Password
          </NavLink>
          <NavLink to={"./payments/"} className="list-group-item">
            Payments
          </NavLink>
          <NavLink to={"./devices/"} className="list-group-item">
            Devices
          </NavLink>
          <NavLink to={"./reports/"} className="list-group-item">
            My Reports
          </NavLink>
        </nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default ProfileNavbar;

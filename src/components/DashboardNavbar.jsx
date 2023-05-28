import { Transition } from "@headlessui/react";
import { useState } from "react";
import { Navbar } from "react-bootstrap";
import { ArrowDownCircleFill, ArrowReturnRight } from "react-bootstrap-icons";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";

const DashboardNavbar = () => {
  const location = useLocation();
  const userDetailsPath = location.pathname.includes("user-details");
  const params = useParams();
  const [userDetailsMenuShow, setUserDetailsMenuShow] = useState(true);

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

              {userDetailsPath && (
                <div className="px-2 self-center">
                  <ArrowDownCircleFill
                    onClick={() => setUserDetailsMenuShow(!userDetailsMenuShow)}
                    className={`font-bold text-3xl  cursor-pointer transition-all ${
                      userDetailsMenuShow && "rotate-180"
                    }`}
                  />
                </div>
              )}
            </div>
            {userDetailsPath && (
              <Transition
                show={userDetailsMenuShow}
                enter="transition ease-out duration-100 transform"
                enterFrom="opacity-0 scale-0"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-0"
                className={"w-11/12 self-end mb-2 list-group"}
              >
                <>
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
                  <div className="flex gap-1">
                    <ArrowReturnRight className="self-center text-4xl" />
                    <NavLink
                      to={`./user-details/${params.id}/update-user-img/`}
                      className="list-group-item border-none w-full"
                    >
                      Update User Image
                    </NavLink>
                  </div>
                </>
              </Transition>
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
        </nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default DashboardNavbar;

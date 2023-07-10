import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import removeCookie from "../hooks/removeCookie";
import Login from "./login";
import {
  AppIndicator,
  BoxArrowInRight,
  BoxArrowLeft,
  CaretDownFill,
  ChatDotsFill,
  CreditCard,
  HouseFill,
  PersonCircle,
  PersonFill,
  Speedometer,
  Telegram,
  XCircleFill,
} from "react-bootstrap-icons";
import { useRefetchState } from "../context/refetch";
import { handleUserData } from "../context/userData";
import getData from "../utils/getData";
import handleLogout from "../utils/handleLogout";
import fromBase64ToImg from "../utils/fromBase64ToImg";
import DefaultUserLogo from "./DefaultUserLogo";

function NavBar() {
  const [auth, setAuth] = useAuth();
  const [userData, setUserData] = handleUserData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showNavList, setShowNavList] = useState(false);
  const [refetch, setRefetch] = useRefetchState();
  const [error, setError] = useState(false);

  useEffect(() => {
    auth && getData(auth, setError, setUserData);
  }, [auth, error]);

  const hideLoginForm = () => {
    setShowLogin(false);
  };
  useEffect(() => {
    !auth && hideLoginForm();
  }, [auth, refetch]);

  return (
    <Navbar
      sticky="top"
      expand="md"
      className="transition-all duration-500 bg-white/40 backdrop-blur-md"
    >
      <Container className="gap-4">
        <Navbar.Brand className="order-1 md-lg:order-2 flex-1">
          <Link to={"./"} className="flex items-center">
            <img src={logo} alt="logo" className="w-[50px] sm:w-[30px]" />
            <span>
              <strong className="text-emerald-400 text-4xl sm:text-2xl">
                Plant
              </strong>
              hie
            </span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle
          onClick={() => setShowNavList(true)}
          aria-controls="basic-navbar-nav"
        />
        <Offcanvas
          show={showNavList}
          onHide={() => setShowNavList(false)}
          responsive="md"
          id="basic-navbar-nav"
          placement="start"
          className="order-2 md:order-1  text-emerald-400/80 font-bold md:py-3 md:px-1"
        >
          <Offcanvas.Header>
            <Offcanvas.Title>
              <strong className="text-4xl">Plant</strong>
              <span className="text-black">hie</span>
            </Offcanvas.Title>
            <XCircleFill
              className="close-btn"
              onClick={() => setShowNavList(false)}
            />
          </Offcanvas.Header>
          <Offcanvas.Body className="px-1">
            <Nav className="items-center font-bold py-3 list-group list-group-horizontal-md">
              {["Home", "About", "Contact"].map((tab, i) => {
                const links = ["/", "/about", "/contact"];
                return (
                  <NavLink
                    key={tab}
                    to={links[i]}
                    onClick={() => setShowNavList(false)}
                    className="link list-group-item w-full flex items-center gap-3 text-emerald-400/80 !border-none"
                  >
                    {tab === "Home" ? (
                      <HouseFill className="text-2xl" />
                    ) : tab === "About" ? (
                      <div className="flex text-xl relative">
                        <PersonFill className="absolute -top-px -left-2 " />
                        <PersonFill className="relative z-10 text-2xl" />
                        <PersonFill className="absolute -top-px -right-2 " />
                      </div>
                    ) : (
                      <Telegram className="text-2xl" />
                    )}

                    {tab}
                  </NavLink>
                );
              })}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {auth ? (
          <div
            id="avatarDropdownList"
            className="relative inline-block order-3"
          >
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setShowList(!showList)}
            >
              {userData?.image == "null" || userData?.image == undefined ? (
                <DefaultUserLogo
                  dims={"h-8 w-8"}
                  nameAbbreviation={
                    userData?.firstName[0]?.toUpperCase() +
                      userData?.lastName[0]?.toUpperCase() || "UK"
                  }
                  logo
                />
              ) : (
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={URL.createObjectURL(fromBase64ToImg(userData?.image))}
                  alt="Avatar"
                />
              )}
              <CaretDownFill className="text-xs" />
            </button>
            <div
              className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ${
                !showList && "hidden"
              }`}
            >
              <div className="py-2">
                <Link
                  onClick={() => setShowList(false)}
                  to={"/profile/"}
                  className="flex items-center gap-2 px-4 py-2 text-slate-800 hover:bg-gray-200 "
                >
                  <PersonFill />
                  Profile
                </Link>
                <Link
                  to={"app/"}
                  onClick={() => setShowList(false)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-800 hover:bg-gray-200 "
                >
                  <AppIndicator />
                  Detection App
                </Link>
                <Link
                  to={"community/"}
                  onClick={() => setShowList(false)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-800 hover:bg-gray-200"
                >
                  <ChatDotsFill />
                  Community
                </Link>
                <Link
                  to={"pricing/"}
                  onClick={() => setShowList(false)}
                  className="flex items-center gap-2 px-4 py-2 text-slate-800 hover:bg-gray-200"
                >
                  <CreditCard />
                  Pricing
                </Link>
                {(auth?.role === "admin" || auth?.role === "superAdmin") && (
                  <Link
                    to={"dashboard/"}
                    onClick={() => setShowList(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-800 hover:bg-gray-200"
                  >
                    <Speedometer />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={async () => {
                    setShowLogin(false);
                    await handleLogout(
                      auth,
                      setAuth,
                      removeCookie,
                      setLoading,
                      navigate
                    );
                    setShowList(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center gap-2"
                >
                  <BoxArrowLeft />
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <button
              className="text-white py-2 px-4 rounded bg-emerald-400  hover:bg-emerald-600 active:bg-emerald-600 font-bold !border-none order-3 flex items-center gap-2 sm:!px-2"
              onClick={() => setShowLogin(true)}
            >
              <BoxArrowInRight className="text-xl" />
              Login
            </button>
            <Login show={showLogin} onHide={hideLoginForm} />
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default NavBar;

import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import {
  Container,
  Image,
  Nav,
  Navbar,
  Offcanvas,
} from "react-bootstrap";
import { toastMsg } from "./message-toast";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import useLoader from "../hooks/useLoader";
import { useEffect, useState } from "react";
import removeCookie from "../hooks/removeCookie";
import Login from "./login";
import {
  AppIndicator,
  BoxArrowInRight,
  BoxArrowLeft,
  CaretDownFill,
  HouseFill,
  PersonCircle,
  PersonFill,
  Speedometer,
  Telegram,
  XCircleFill,
} from "react-bootstrap-icons";
import { setUserImage } from "../context/userImg";
import { useRefetchState } from "../context/refetch";

function NavBar() {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [loader, setLoader] = useLoader();
  const [userImg, setUserImg] = setUserImage();
  const [showLogin, setShowLogin] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showNavList, setShowNavList] = useState(false);
  const [refetch, setRefetch] = useRefetchState();

  const handleLogout = async () => {
    setLoader(true);
    setShowLogin(false);
    await axios
      .post(
        "/logout",
        {},
        {
          headers: {
            "x-auth-token": auth.token,
          },
        }
      )
      .then((res) => {
        navigate({ pathname: "./" });
        toastMsg("success", res.data.message);
        setLoader(false);
        setAuth(null);
        removeCookie("userIn");
      })
      .catch((err) => {
        setLoader(false);
        toastMsg("error", err.response.data.message);
      });
  };
  const getAvatar = async () => {
    await axios
      .get(`/logo/${auth?.id}`, {
        responseType: "blob",
        headers: { "x-auth-token": auth?.token },
      })
      .then((imgRes) => {
        setUserImg(imgRes.data);
        setRefetch(false);
      })
      .catch(() => setUserImg(null));
  };
  const hideLoginForm = () => {
    setShowLogin(false);
  };
  useEffect(() => {
    auth && getAvatar();
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
                const links = ["./", "about", "contact"];
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
              {userImg ? (
                <Image
                  roundedCircle
                  className="h-8 w-8"
                  src={URL.createObjectURL(userImg)}
                  alt="Avatar"
                />
              ) : (
                <PersonCircle className="bg-white rounded-full text-3xl" />
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
                  to={"/graduation-project/profile/"}
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
                  onClick={() => {
                    handleLogout();
                    setUserImg(null);
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

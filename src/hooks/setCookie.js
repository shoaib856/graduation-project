import Cookies from "js-cookie";

const setCookie = (cookieName, userIn) =>
  Cookies.set(cookieName, userIn, {
    expires: 999999999999999,
    secure: true,
    sameSite: "strict",
    path: "./",
  });

export default setCookie;

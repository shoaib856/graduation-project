import Cookies from "js-cookie";

const removeCookie = (cookieName) => Cookies.remove(cookieName, { path: "" });

export default removeCookie;

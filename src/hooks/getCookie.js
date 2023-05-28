import Cookies from "js-cookie";

const getCookie = (cookieName) => Cookies.get(cookieName) ?? null;

export default getCookie;

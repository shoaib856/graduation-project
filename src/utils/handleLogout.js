import axios from "../api/axios";
import { toastMsg } from "../components/message-toast";

const handleLogout = async (
  auth,
  setAuth,
  removeCookie,
  setLoading,
  navigate
) => {
  setLoading(true);
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
      navigate({ pathname: "/" });
      toastMsg("success", res.data.message);
      setLoading(false);
      setAuth(null);
      removeCookie("userIn");
    })
    .catch((err) => {
      setLoading(false);
      toastMsg("error", err.response.data.message);
    });
};

export default handleLogout;
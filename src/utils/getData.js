import axios from "../api/axios";

const getData = async (
  auth,
  setError,
  setUserData,
  setRefetch = null,
  id = null
) => {
  try {
    await axios
      .get(`/user/${id || auth.id}`, {
        headers: { "x-auth-token": auth?.token },
      })
      .then((res) => {
        console.log("Data fetched");
        setError(false);
        setUserData(res.data.data.user);
        setRefetch ? setRefetch(false) : null;
      });
  } catch (err) {
    setRefetch ? setRefetch(false) : null;
    setError(true);
    console.error(err.response || "Something went wrong");
  }
};

export default getData;

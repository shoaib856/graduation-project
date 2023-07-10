import { Button, ButtonGroup, Card, Placeholder } from "react-bootstrap";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { toastMsg } from "../components/message-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import removeCookie from "../hooks/removeCookie";
import { PersonCircle } from "react-bootstrap-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomizedAlert from "../components/CustomizedAlert";
import { handleUserData } from "../context/userData";
import ShowImage from "../components/ShowImage";
import fromBase64ToImg from "../utils/fromBase64ToImg";
import EditableField from "../components/editableField";
import CustomRow from "../components/CustomRow";
import handleLogout from "../utils/handleLogout";
import getData from "../utils/getData";

const validationSchema = Yup.object({
  userName: Yup.string()
    .required("Required")
    .min(8, "Must be 8 characters or more")
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Username must be small case"),
  firstName: Yup.string()
    .required("Required")
    .max(15, "Must be 15 characters or less"),
  lastName: Yup.string()
    .required("Required")
    .max(20, "Must be 20 characters or less"),
  email: Yup.string().email("Invalid email address").required("Required"),
  phoneNumber: Yup.string()
    .required("Required")
    .matches(/^[0-9]+$/, "Phone number must be number")
    .min(11, "Phone number must be at least 11 characters")
    .max(11, "Phone number must be at most 11 characters"),
  country: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  streetName: Yup.string().required("Required"),
  postCode: Yup.string().required("Required"),
  workField: Yup.string().required("Required"),
  usageTarget: Yup.string().required("Required"),
});
const initialValues = {
  image: "",
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  phoneNumber: "",
  country: "",
  city: "",
  state: "",
  streetName: "",
  postCode: "",
  role: "",
  workField: "",
  usageTarget: "",
  features: [],
};

function Profile() {
  const [auth, setAuth] = useAuth();

  const [userData, setUserData] = handleUserData();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [error, setError] = useState(false);
  const [image, setImage] = useState(null);

  const navigate = useNavigate();

  const location = useLocation();

  const profileLocation =
    location.pathname.split("/").slice(-2)[0] === "profile";

  document.title = profileLocation
    ? "FarmVision | Profile"
    : "Dashboard | User Details";
  const params = useParams();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const editedFields = Object.keys(values).reduce(
        (acc, current) => {
          if (values[current] !== user[current]) {
            acc[current] = values[current];
          }
          return acc;
        },
        { image }
      );
      if (Object.keys(editedFields).length === 0) {
        toastMsg("info", "No changes were made");
        return;
      }
      await axios
        .put(`/user/${profileLocation ? auth.id : params.id}`, editedFields, {
          headers: {
            "x-auth-token": auth.token,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          toastMsg("success", res.data.message);
          setRefetch(true);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  });

  const getLocalData = async () => {
    try {
      if (profileLocation) {
        if (userData && !refetch) {
          formik.setValues(userData);
          setImage(fromBase64ToImg(userData.image));
          setUser(userData);
        } else if (refetch) {
          getData(auth, setError, setUserData, setRefetch);
        }
      } else {
        setLoading(true);
        await axios
          .get(`user/${params.id}`, {
            headers: { "x-auth-token": auth?.token },
          })
          .then((res) => {
            formik.setValues(res.data.data.user);
            setUser(res.data.data.user);
            setImage(fromBase64ToImg(res.data.data.user.image));
            setLoading(false);
            setRefetch(false);
            auth.id == params.id && refetch
              ? getData(auth, setError, setUserData, setRefetch)
              : null;
          })
          .catch((err) => {
            console.error(err);
            setError(true);
            setRefetch(false);
            setLoading(false);
          });
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      toastMsg("error", "You Must Login or Register first");
      navigate("../");
    }
  };

  useEffect(() => {
    getLocalData();
  }, [auth, refetch, userData]);

  return (
    <div className="w-full py-3 px-1 flex flex-col gap-4 items-center bg-white !rounded-xl shadow-xl">
      <h1 className="text-4xl w-full pl-3 border-b-2 border-emerald-600">
        Profile
      </h1>
      {error ? (
        <div className="w-full">
          <CustomizedAlert
            variant="danger"
            msg={"Something went wrong"}
            setRefetch={setRefetch}
          />
        </div>
      ) : !user || refetch ? (
        <Card className="w-full">
          <Card.Header className="flex justify-center w-full">
            <PersonCircle className="text-gray-300 text-8xl" />
          </Card.Header>
          <Card.Body>
            <Placeholder as={Card.Title} animation="glow">
              <Placeholder xs={6} />
            </Placeholder>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={12} />
              <Placeholder xs={12} />
              <Placeholder xs={12} />
              <Placeholder xs={12} />
            </Placeholder>
          </Card.Body>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-2 !w-full px-2">
            <div className="flex md:flex-col items-center gap-2 justify-center">
              <ShowImage
                formik={formik}
                image={image}
                setImage={setImage}
                width40
                base64
              />
              <div className="md:text-center">
                <h1 className="text-6xl md:text-4xl">
                  {user?.firstName + " " + user?.lastName}
                </h1>
                <span className="text-lg ">({user?.role})</span>
              </div>
            </div>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-1 text-emerald-600 p-1"
            >
              <CustomRow>
                <EditableField
                  id={"userName"}
                  label={"Username"}
                  formik={formik}
                  beforeEditData={user.userName}
                />
                <EditableField
                  id={"email"}
                  label={"Email"}
                  formik={formik}
                  beforeEditData={user.email}
                />
              </CustomRow>
              <CustomRow>
                <EditableField
                  id={"firstName"}
                  label={"First Name"}
                  formik={formik}
                  beforeEditData={user.firstName}
                />
                <EditableField
                  id={"lastName"}
                  label={"Last Name"}
                  formik={formik}
                  beforeEditData={user.lastName}
                />
              </CustomRow>

              <CustomRow>
                <EditableField
                  id={"phoneNumber"}
                  label={"Phone Number"}
                  formik={formik}
                  beforeEditData={user.phoneNumber}
                />
                <EditableField
                  id={"postCode"}
                  label={"Post Code"}
                  formik={formik}
                  beforeEditData={user.postCode}
                />
              </CustomRow>

              <CustomRow>
                <EditableField
                  id={"country"}
                  label={"Country"}
                  formik={formik}
                  beforeEditData={user.country}
                />
                <EditableField
                  id={"city"}
                  label={"City"}
                  formik={formik}
                  beforeEditData={user.city}
                />
              </CustomRow>

              <CustomRow>
                <EditableField
                  id={"state"}
                  label={"State"}
                  formik={formik}
                  beforeEditData={user.state}
                />
                <EditableField
                  id={"streetName"}
                  label={"Street Name"}
                  formik={formik}
                  beforeEditData={user.streetName}
                />
              </CustomRow>
              <CustomRow>
                <EditableField
                  id={"workField"}
                  label={"Work Field"}
                  formik={formik}
                  beforeEditData={user.workField}
                />
                <EditableField
                  id={"usageTarget"}
                  label={"Usage Target"}
                  formik={formik}
                  beforeEditData={user.usageTarget}
                />
              </CustomRow>

              <ButtonGroup className="mt-2">
                <Button
                  variant="info"
                  type="submit"
                  className="bg-sky-500 text-white"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {formik.isSubmitting ? "Saving..." : "Save"}
                </Button>

                <Button
                  variant="danger"
                  className="bg-red-500"
                  onClick={() => {
                    handleLogout(
                      auth,
                      setAuth,
                      removeCookie,
                      setLoading,
                      navigate
                    );
                  }}
                  disabled={formik.isSubmitting || loading}
                >
                  Logout
                </Button>
              </ButtonGroup>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;

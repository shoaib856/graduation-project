import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";
import { Badge, Card, Dropdown, Placeholder } from "react-bootstrap";
import { PersonCircle, ThreeDotsVertical } from "react-bootstrap-icons";
import { toastMsg } from "../components/message-toast";
import warningMessage from "../components/warningMessage";
import { useUserImage } from "../context/userImg";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import DefaultUserLogo from "../components/DefaultUserLogo";

const colors = [
  "bg-red-400",
  "bg-orange-400",
  "bg-emerald-400",
  "bg-amber-400",
  "bg-sky-400",
  "bg-indigo-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-green-400",
  "bg-blue-400",
  "bg-teal-400",
  "bg-rose-400",
  "bg-cyan-400",
  "bg-lime-400",
  "bg-yellow-400",
  "bg-violet-400",
  "bg-fuchsia-400",
  "bg-slate-400",
  "bg-gray-400",
  "bg-stone-400",
  "bg-zinc-400",
  "bg-neutral-400",
];

function Dashboard() {
  document.title = "FarmVision | Dashboard";
  const auth = useAuthValue();
  const [usersData, setUsersData] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useState(false);
  const userImg = useUserImage();
  const getUsers = async () => {
    setLoading(true);
    await axios
      .get("/admin/user", {
        headers: {
          "x-auth-token": auth?.token,
        },
      })
      .then((res) => {
        toastMsg("success", res.data.message);
        setLoading(false);
        setRefetch(false);
        setUsersData(res.data.data);
      });
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await axios
      .delete(`/user/${id}`, {
        headers: {
          "x-auth-token": auth?.token,
        },
      })
      .then((res) => {
        setRefetch(true);
        setLoading(false);
        toastMsg("success", `${res.data.message} Reloading...`);
      });
  };
  const handleUpdateAdmin = async (id, role) => {
    Swal.fire({
      title: "Select an option",
      input: "select",
      inputOptions: {
        farmer: "farmer",
        engineer: "engineer",
        admin: "admin",
      },
      inputPlaceholder: "Select a role",
      inputValue: role,
      showCancelButton: true,
      confirmButtonText: "Update",
      confirmButtonColor: "#3B82F6",
      cancelButtonText: "Cancel",
    }).then((res) => {
      // Handle the user's selection
      if (res.value) {
        Swal.fire({
          title: "Are you sure?",
          confirmButtonText: "Yes",
          confirmButtonColor: "#3B82F6",
          showCancelButton: true,
          cancelButtonText: "Cancel",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await axios
              .put(
                `/admin/user/${id}`,
                {
                  role: res.value,
                },
                {
                  headers: {
                    "x-auth-token": auth.token,
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((res) => {
                toastMsg("success", res.data.message);
                setRefetch(true);
              })
              .catch((err) => {
                toastMsg("error", err.response.data.message);
              });
          }
        });
      }
    });
  };
  useEffect(() => {
    getUsers();
  }, [auth, refetch]);

  return (
    <div className="flex flex-col gap-2 text-emerald-600 w-full p-4 bg-white rounded-xl shadow-xl">
      <h1 className="text-4xl w-full text-emerald-600 pl-3">Dashboard</h1>
      <div
        className="grid gap-2 justify-center"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        }}
      >
        {loading ? (
          <>
            {[1, 2, 3].map((n) => {
              return (
                <Card key={n}>
                  <Card.Body className="flex items-center gap-2 bg-slate-50">
                    <PersonCircle className=" rounded-full text-9xl text-gray-400" />
                    <div className="w-full">
                      <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                      <Placeholder as={Card.Text} animation="glow">
                        <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                        <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                        <Placeholder xs={8} />
                      </Placeholder>
                      <Placeholder.Button className="w-full !bg-emerald-400 border-none" />
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </>
        ) : (
          <>
            {usersData.map((userData) => {
              return (
                <Card key={userData.user.id}>
                  <Card.Body className="flex items-center bg-slate-50 justify-between gap-2">
                    <div id="user-logo">
                      <DefaultUserLogo
                        dims={"w-16 h-16"}
                        nameAbbreviation={
                          userData.user.firstName[0].toUpperCase() +
                          userData.user.lastName[0].toUpperCase()
                        }
                      />
                    </div>
                    <div id="user-data" className="flex flex-col flex-1 gap-1">
                      <Card.Title className="font-bold text-xl flex justify-between">
                        <p>{userData.user.userName}</p>
                        <Dropdown drop="down">
                          <Dropdown.Toggle
                            className={`after:!hidden !border-none !bg-transparent text-black`}
                          >
                            <ThreeDotsVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="p-2">
                            <Dropdown.Item
                              disabled={
                                userData.user.id === auth.id ||
                                userData.user.admin
                              }
                              className="hover:text-white text-center hover:bg-red-600 active:bg-red-600"
                              onClick={() =>
                                warningMessage(handleDelete, userData.user.id)
                              }
                            >
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item
                              disabled={
                                userData.user.id === auth.id ||
                                userData.user.role === "superAdmin"
                              }
                              className="hover:text-white text-center hover:bg-yellow-500 active:bg-yellow-500"
                              onClick={() =>
                                handleUpdateAdmin(
                                  userData.user.id,
                                  userData.user.role
                                )
                              }
                            >
                              Change Role
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Card.Title>
                      <Card.Text className="text-sm text-gray-500">
                        {userData.user.email}
                      </Card.Text>
                      <Card.Text className="text-sm text-gray-500">
                        Role: {userData.user.role}
                      </Card.Text>
                      <Card.Text className="text-sm text-gray-500">
                        Joined at:{" "}
                        {
                          new Date(userData.user.createdAt)
                            .toLocaleString("en-Us")
                            .split(",")[0]
                        }
                      </Card.Text>
                      <Card.Text className="text-sm text-gray-500">
                        Last Update:{" "}
                        {
                          new Date(userData.user.updatedAt)

                            .toLocaleString("en-Us")
                            .split(",")[0]
                        }
                      </Card.Text>
                      <Link
                        to={`user-details/${userData.user.id}/`}
                        className="rounded text-white bg-emerald-400 hover:bg-emerald-600 active:bg-emerald-600 py-2 text-center shadow-sm hover:shadow-lg transition-all duration-300"
                      >
                        Details
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

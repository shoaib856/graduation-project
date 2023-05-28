import axios from "../api/axios";
import { Button, ButtonGroup, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toastMsg } from "./message-toast";

import { useState } from "react";
import useAuth from "../hooks/useAuth.js";
import useLoader from "../hooks/useLoader";
import setCookie from "../hooks/setCookie";
import { XCircleFill } from "react-bootstrap-icons";

function Login({ show, onHide }) {
  const [auth, setAuth] = useAuth();
  const [loader, setLoader] = useLoader();
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    await axios
      .post(
        "/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        toastMsg("success", res?.data.message);
        setAuth({
          role: res?.data.role,
          token: res?.data.token,
          id: res?.data.user_id,
        });
        setCookie(
          "userIn",
          JSON.stringify({
            role: res?.data.role,
            token: res?.data.token,
            id: res?.data.user_id,
          })
        );
        navigate("/graduation-project/");
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        password.length < 8
          ? toastMsg("error", "Password Can't be less than 8 characters")
          : toastMsg("error", err.response.data.message.toString());
      });
  };
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="backdrop-blur bg-white/5"
    >
      <Modal.Header>
        <Modal.Title className="font-bold text-emerald-900">Login</Modal.Title>
        <XCircleFill onClick={onHide} className="close-btn" />
      </Modal.Header>
      <Modal.Body>
        <Form className="text-xl text-emerald-900 " onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="email">E-mail *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:!border-emerald-500 focus:!shadow-md focus:!shadow-emerald-500"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">Password *</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPwd(e.target.value)}
              className="focus:!border-emerald-500 focus:!shadow-md focus:!shadow-emerald-500"
            />
          </Form.Group>
          <ButtonGroup className="w-full">
            <Button variant="success" type="submit" className="bg-green-700">
              <i className="bi bi-box-arrow-in-right mr-3"></i>
              Login
            </Button>
            <Button variant="danger" className="bg-red-600" onClick={onHide}>
              Cancel
            </Button>
          </ButtonGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <span className="mx-auto">
          Haven't you an account?{"  "}
          <Link
            to="/graduation-project/register"
            className="text-emerald-600 hover:text-emerald-400 underline underline-offset-2"
            onClick={onHide}
          >
            Register
          </Link>
        </span>
      </Modal.Footer>
    </Modal>
  );
}

export default Login;

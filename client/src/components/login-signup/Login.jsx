import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../utils/mutations";
import Auth from "../../utils/auth";

export default function Login() {
  const [userFormData, setUserFormData] = useState({ email: "", password: "" });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [login, { error, data }] = useMutation(LOGIN_USER);
console.log(error);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await login({
        variables: { ...userFormData },
      });

      Auth.login(data.login.token);

      setUserFormData({
        username: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      setShowAlert(true);
    }
  };

  return (
    <>
      {showAlert && <Alert variant="danger">{error.message}</Alert>}

      <div className=" login m-5">
        <div className="">
          <Card.Body>
            <Card.Title
              className="text-center p-4 "
              style={{
                fontSize: "50px",
                fontStyle: "italic",
                fontWeight: "bold",
              }}
            >
              Login
            </Card.Title>
            <Card.Text>
              <div className="formlogin ">
                <Form.Group className="mb-3 " controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit "
                  className="mt-3"
                  onClick={handleFormSubmit}
                >
                  Submit
                </Button>
              </div>
            </Card.Text>
          </Card.Body>
        </div>
      </div>
    </>
  );
}

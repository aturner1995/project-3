import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../../utils/mutations";
import Auth from "../../utils/auth";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";

export default function Signup() {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [hasCapital, setHasCapital] = React.useState(false);
  const [hasNumber, setHasNumber] = React.useState(false);
  const [hasSpecial, setHasSpecial] = React.useState(false);
  const [hasLowerCase, setHasLowerCase] = React.useState(false);
  const [has8Chars, setHas8Chars] = React.useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [userFormData, setUserFormData] = React.useState({
    username: "",
    email: "",
    password: "",
  });

  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });

    if (name === "password") {
      confirmPasswordChecker(event);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (has8Chars && hasCapital && hasNumber && hasSpecial && hasLowerCase) {
      try {
        const { data } = await addUser({
          variables: {
            ...userFormData,
          },
        });
        Auth.login(data.addUser.token);
      } catch (err) {
        console.error(err);
      }

      setUserFormData({
        username: "",
        email: "",
        password: "",
      });
    } else {
      setShowAlert(true);
    }
  };

  function confirmPasswordChecker(event) {
    const { value } = event.target;
    setConfirmPassword(value);
  }

  function passwordChecker(event) {
    const value = event.target.value;
    setPassword(value);
    hasCapitalChecker(value);
    hasNumberChecker(value);
    hasSpecialChecker(value);
    hasLowerCaseChecker(value);
    has8CharsChecker(value);
  }

  function hasCapitalChecker(value) {
    const passw = /[A-Z]/;
    setHasCapital(value.match(passw) !== null);
  }

  function hasNumberChecker(value) {
    const passw = /[0-9]/;
    setHasNumber(value.match(passw) !== null);
  }

  function hasSpecialChecker(value) {
    const passw = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    setHasSpecial(value.match(passw) !== null);
  }

  function hasLowerCaseChecker(value) {
    const passw = /[a-z]/;
    setHasLowerCase(value.match(passw) !== null);
  }

  function has8CharsChecker(value) {
    const passw = /^.{8,}$/;
    setHas8Chars(value.match(passw) !== null);
  }

  return (
    <>
      {showAlert && (
        <Alert variant="danger">
          Please fill out all the required fields with a minimum of 8
          characters, one uppercase letter, one lowercase letter, one number
        </Alert>
      )}

      <div className="mx-4">
        <div className="">
          <Card.Body>
            <Card.Title
              className="text-center"
              style={{
                fontSize: "50px",
                fontStyle: "italic",
                fontWeight: "bold",
              }}
            >
              Sign up
            </Card.Title>
            <Card.Text>
              <div className="formlogin">
                <Form.Label>Username</Form.Label>
                <Form.Group controlId="formBasicEmailSignup">
                  <Form.Control
                    name="username"
                    onChange={handleInputChange}
                    placeholder="Username"
                    value={userFormData.username}
                    aria-describedby="basic-addon1"
                    required
                  />
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    name="email"
                    onChange={handleInputChange}
                    value={userFormData.email}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={passwordChecker}
                  />
                </Form.Group>

                {password.length > 0 && (
                  <div>
                    <div className="d-flex justify-content-start align-items-center">
                      <div>Has capital letter?</div>
                      <FontAwesomeIcon
                        icon={hasCapital ? faCheck : faTimes}
                        size="xl"
                        style={{
                          color: hasCapital ? "#06ea34" : "#ff0000",
                          marginLeft: "10px",
                        }}
                      />
                    </div>

                    <div className="d-flex justify-content-start align-items-center">
                      <div>Has number?</div>
                      <FontAwesomeIcon
                        icon={hasNumber ? faCheck : faTimes}
                        size="xl"
                        style={{
                          color: hasNumber ? "#06ea34" : "#ff0000",
                          marginLeft: "10px",
                        }}
                      />
                    </div>

                    <div className="d-flex justify-content-start align-items-center">
                      <div>Has special character?</div>
                      <FontAwesomeIcon
                        icon={hasSpecial ? faCheck : faTimes}
                        size="xl"
                        style={{
                          color: hasSpecial ? "#06ea34" : "#ff0000",
                          marginLeft: "10px",
                        }}
                      />
                    </div>

                    <div className="d-flex justify-content-start align-items-center">
                      <div>Has lowercase letter?</div>
                      <FontAwesomeIcon
                        icon={hasLowerCase ? faCheck : faTimes}
                        size="xl"
                        style={{
                          color: hasLowerCase ? "#06ea34" : "#ff0000",
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                    <div className="d-flex justify-content-start align-items-center">
                      <div>password length should be 8 or more?</div>
                      <FontAwesomeIcon
                        icon={has8Chars ? faCheck : faTimes}
                        size="xl"
                        style={{
                          color: has8Chars ? "#06ea34" : "#ff0000",
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                  </div>
                )}

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Confirm password</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    placeholder="Confirm password"
                    onChange={handleInputChange}
                    value={confirmPassword}
                    required
                  />
                </Form.Group>

                {confirmPassword !== "" && confirmPassword !== password ? (
                  <div className="alert alert-danger" role="alert">
                    Passwords do not match
                  </div>
                ) : confirmPassword !== "" && confirmPassword === password ? (
                  <div className="alert alert-success" role="alert">
                    Passwords match
                  </div>
                ) : null}

                <Button
                  variant="primary"
                  type="submit"
                  className="my-2"
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

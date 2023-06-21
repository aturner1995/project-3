import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignInAlt,
  faUserPlus,
  faArrowLeft,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import Googlefacebook from "./Googlefacebook";
import Login from "./Login";
import Signup from "./Signup";
import { Row, Col } from 'react-bootstrap';
import { Button } from "primereact/button";

export default function LoginSignupIndex() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleFormSwitchLogin = () => {
    setShowLogin(!showLogin);
  };

  const handleFormSwitchSignup = () => {
    setShowSignup(!showSignup);
  };

  const handleBack = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  return (
      <Row className="flex-column flex-md-row align-items-center bg-white text-dark">
        <Col lg={5} md={0} className="left-login" style={{ position: "relative", height: "100%" }}>
          <div className="image-container" style={{ height: "100%", overflow: "hidden" }}>
            <img
              src="/images/login.webp"
              alt="Family using Taskmaster to create free time"
              className="login-image"
              style={{ height: "100%", width: "100%"}}
            />
          </div>
          <div className="logo-text-container">
            <div className="text-center">
              <img className="logo" src='/images/logo-black.webp' alt="Logo" />
            </div>
            <div className="overlay-text text-white mt-1">
              <ul>
                <li className="d-flex">
                  <i className="pi pi-check-circle mt-1"></i>
                  <p className="mx-1">Pay per task, not per hour</p>
                </li>
                <li className="d-flex">
                  <i className="pi pi-check-circle mt-1"></i>
                  <p className="mx-1">Access to the best local services</p>
                </li>
                <li className="d-flex">
                  <i className="pi pi-check-circle mt-1"></i>
                  <p className="mx-1">Stick to your budget</p>
                </li>
              </ul>
            </div>
          </div>
        </Col>
        <Col lg={7} md={12} className="right-login mb-2">
          {!showLogin && !showSignup ? (
            <>
              <div className="text-center mb-3">
                <p className="fw-bold m-2 fs-4">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Sign in options
                </p>
              </div>
              <div className="d-flex text-center mb-3 justify-content-center align-items-center">
                <Googlefacebook />
              </div>

              <div className="text-center mt-5 fs-4">
                <p className="fw-bold m-2">
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                  Continue with email
                </p>
              </div>

              <div className="d-grid justify-content-center mt-4">
              <Button className="my-2"  icon='pi pi-user' label="Login" severity="success" onClick={handleFormSwitchLogin} outlined />
              <Button className="my-2" icon='pi pi-user-plus' label="Signup" severity="success" onClick={handleFormSwitchSignup} outlined />
              </div>
            </>
          ) : (
            <>
              <div className="text-center mt-3">
                <button
                  className="back-button btn btn-link"
                  onClick={handleBack}
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                  Back
                </button>
              </div>
              {showLogin && <Login />}
              {showSignup && <Signup />}
            </>
          )}
        </Col>
      </Row>
  );
}

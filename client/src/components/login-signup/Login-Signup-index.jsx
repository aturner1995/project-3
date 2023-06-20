import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignInAlt,
  faUserPlus,
  faArrowLeft,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

import loginimage1 from "../../assets/loginimage1.png";
import loginimage2 from "../../assets/loginimage2.png";
import loginimage3 from "../../assets/loginimage3.png";
import { ThemeContext } from "../../utils/themeContext";
import logoImage from "../../assets/logo-white.avif";
import Googlefacebook from "./Googlefacebook";
import Login from "./Login";
import Signup from "./Signup";

const images = [loginimage1, loginimage2, loginimage3];

export default function LoginSignupIndex() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { currentImage } = useContext(ThemeContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
    <div className={`hero bg-${currentImage.color} text-white`}>
      <div className="d-flex flex-column flex-md-row align-items-center mt-5">
        <div className="col-12 col-md-6">
          <div className="left-side m-3">
            <h2 className="text-center text-success mb-4">
              <span>
                <img className="img-fluid logo" src={logoImage} alt="Logo" />
              </span>
            </h2>
            <p>
              A marketplace for finding freelancers and becoming a freelancer.
              It provides a platform for connecting businesses and individuals
              with talented professionals from various fields.
            </p>
            <p>
              Whether you need help with graphic design, web development,
              writing, or any other freelance service, our app offers a diverse
              pool of skilled freelancers ready to meet your needs.
            </p>
          </div>

          <img
            src={images[currentImageIndex]}
            alt=""
            className="col-12 login-image"
            style={{ height: "auto", opacity: 1 }}
          />
        </div>

        <div className="col-12 col-md-6 mb-5">
          {!showLogin && !showSignup ? (
            <>
              <div className="text-center mb-3">
                <p className="fw-bold m-2 fs-4">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Sign in options
                </p>
              </div>
              <div className="text-center mb-3 d-flex justify-content-center align-items-center">
                <Googlefacebook />
              </div>

              <div className="text-center mt-5 fs-4">
                <p className="fw-bold m-2">
                  <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                  Continue with email
                </p>
              </div>

              <div className="d-grid gap-2 col-12 justify-content-center mt-4">
                <button
                  className="manual-login-button btn btn-outline-info btn-lg"
                  onClick={handleFormSwitchLogin}
                >
                  <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                  Login
                </button>
                <button
                  className="manual-signup-button btn btn-outline-info btn-lg mt-3"
                  onClick={handleFormSwitchSignup}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                  Signup
                </button>
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
        </div>
      </div>
    </div>
  );
}

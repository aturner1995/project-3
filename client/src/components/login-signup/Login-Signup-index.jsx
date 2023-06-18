import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Login from "./Login";
import Signup from "./Signup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import loginimage1 from "../../assets/loginimage1.png";
import loginimage2 from "../../assets/loginimage2.png";
import loginimage3 from "../../assets/loginimage3.png";
import { ThemeContext } from '../../utils/themeContext';
import logoImage from "../../assets/logo-white.avif";



const images = [loginimage1, loginimage2, loginimage3];

export default function LoginSignupIndex() {
  const [showLogin, setShowLogin] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { currentImage } = useContext(ThemeContext);

  const handleFormSwitch = () => {
    setShowLogin(!showLogin);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formVariants = {
    hidden: { opacity: 0, rotateY: 180 },
    visible: { opacity: 1, rotateY: 0 },
  };

  return (
    <div  className={`hero bg-${currentImage.color} text-white `} >
      <div className="text-end mt-5 me-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleFormSwitch}
          style={{ cursor: "pointer" }}
        >
          <FontAwesomeIcon icon={faUser} className="user-icon me-2" />
          <motion.span
            className="heading-text"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Click to sign in"}
          </motion.span>
        </motion.div>
      </div>
      <div className="d-flex flex-column flex-md-row align-items-center mt-5">
        <div className="col-12 col-md-6">
        <div className="left-side m-3">
        <h2 className="text-center text-success mb-4"><span><img className="img-fluid" src={logoImage} alt="Logo"></img>
</span></h2>
        <p>
          A marketplace for finding freelancers and becoming a freelancer. It provides a platform for connecting businesses and individuals with talented professionals from various fields.
        </p>
        <p>
          Whether you need help with graphic design, web development, writing, or any other freelance service, our app offers a diverse pool of skilled freelancers ready to meet your needs.
        </p>
      </div>
          <motion.img
            src={images[currentImageIndex]}
            alt=""
            className="col-12"
            style={{ height: "auto" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="col-12 col-md-6 mb-5">
          <motion.div
            className="form-container"
            initial="hidden"
            animate="visible"
            variants={formVariants}
            transition={{ duration: 0.8 }}
          >
            {showLogin ? <Login /> : <Signup />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

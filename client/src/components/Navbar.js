import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Modal,
  Image,
  NavDropdown,
} from "react-bootstrap";
import { Button } from "primereact/button";
import { ThemeContext } from "../utils/themeContext";
import Auth from "../utils/auth";
import { motion } from "framer-motion";
import LoginSignupIndex from "./login-signup/Login-Signup-index";


const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const { currentImage } = useContext(ThemeContext);
  const [isTop, setIsTop] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navBarClasses = `nav-bar ${isTop && isHomePage ? `bg-${currentImage.color}` : "bg-white"
    }`;
  const logoSrc =
    isTop && isHomePage ? "/images/logo-white.webp" : "/images/logo-black.webp";
  const navLinkColor = isTop && isHomePage ? "text-white" : "text-black";
  const buttonColor = isTop && isHomePage ? "p-button-outlined" : "";

  const link = (
    <Link to="/Profile" className={navLinkColor}>
      My Profile
    </Link>
  );

  return (
    <>
      <Navbar className={navBarClasses} expand="lg" sticky="top">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <Image src={logoSrc} className="nav-img"></Image>
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            className="bg-white"
          />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="ml-auto d-flex">
              <Nav.Link as={Link} to="/search" className={navLinkColor}>
                Explore
              </Nav.Link>
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to="/chat" className={navLinkColor}>
                    Messages
                  </Nav.Link>
                  <NavDropdown
                    title="My Account"
                    id="basic-nav-dropdown"
                    className={navLinkColor}
                  >
                    <NavDropdown.Item
                      as={Link}
                      to="/Profile"
                      className={navLinkColor}
                    >
                      {link}
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      onClick={Auth.logout}
                      className={navLinkColor}
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Nav.Link
                    onClick={() => setShowModal(true)}
                    className={navLinkColor}
                  >
                    Sign in
                  </Nav.Link>
                  <Nav.Link onClick={() => setShowModal(true)}>
                    <Button
                      label="Join"
                      severity="success"
                      size="small"
                      className={buttonColor}
                    />
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal
        as={motion.div}
        size="lg"
        fullscreen="true"
        show={showModal}
        onHide={() => setShowModal(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        dialogClassName="custom-modal"
      >
        <LoginSignupIndex />
      </Modal>
      <style type="text/css">
        {`
          .dropdown-menu {
            background-color: #5373A1;
          }
          .dropdown-toggle {
            color: white;
          }
        `}
      </style>
    </>
  );
};

export default AppNavbar;

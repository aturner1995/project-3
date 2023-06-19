import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab, Image } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { ThemeContext } from '../utils/themeContext';
import Auth from '../utils/auth';

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);
  const { currentImage } = useContext(ThemeContext);
  const [isTop, setIsTop] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled) {
        setIsTop(false);
      } else {
        setIsTop(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navBarClasses = `nav-bar ${isTop && isHomePage ? `bg-${currentImage.color}` : 'bg-white'}`;
  const logoSrc = isTop && isHomePage ? '/images/logo-white.avif' : '/images/logo-black.avif';
  const navLinkColor = isTop && isHomePage ? 'text-white' : 'text-black';
  const buttonColor = isTop && isHomePage ? 'p-button-outlined' : '';


  return (
    <>
      <Navbar className={navBarClasses} expand='lg' sticky='top'>
        <Container fluid>
          <Navbar.Brand as={Link} to='/'>
            <Image src={logoSrc} className='nav-img'></Image>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className='bg-white'/>
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className='ml-auto d-flex'>
              <Nav.Link as={Link} to='/' className={navLinkColor}>
                Explore
              </Nav.Link>
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to='/saved' className={navLinkColor}>
                    See Your Books
                  </Nav.Link>
                  <Nav.Link onClick={Auth.logout} className={navLinkColor}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link onClick={() => setShowModal(true)} className={navLinkColor}>Sign in</Nav.Link>
                  <Nav.Link onClick={() => setShowModal(true)}><Button label="Join" severity="success" size='small' className={buttonColor} /></Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>{/* <LoginForm handleModalClose={() => setShowModal(false)} /> */}</Tab.Pane>
              <Tab.Pane eventKey='signup'>{/* <SignUpForm handleModalClose={() => setShowModal(false)} /> */}</Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;

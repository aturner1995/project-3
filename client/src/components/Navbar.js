import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const AppNavbar = () => {
    return (
        <>
            <Navbar bg='dark' variant='dark' expand='lg'>
                <Container fluid>
                    <Navbar.Brand as={Link} to='/'>
                        Project 3
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className='mx-5' />
                    <Navbar.Collapse id="basic-navbar-nav" className="nav-icons mx-5">
                        <Nav className='ml-auto d-flex'>
                            <Nav.Link as={Link} to='/'>
                                Link
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default AppNavbar
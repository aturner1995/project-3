import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer text-dark pt-3">
      <Container className="d-flex justify-content-between align-items-center">
        <div>
          <h4>Taskmaster</h4>
          <p>Your Personal Productivity Assistant</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

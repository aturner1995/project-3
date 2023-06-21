import React, { useContext, useState } from 'react';
import { Image, Row, Col, Form } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ThemeContext } from '../utils/themeContext';
import { useNavigate, Link } from 'react-router-dom';

const Hero = () => {
  const { currentImage } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchQuery) {
      // Redirect to /search page with the search query
      navigate(`/search/query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className={`hero bg-${currentImage.color}`}>
      <Row>
        <Col className='left text-center mt-5 pt-5' lg={7}>
          <div className="text-white mx-5">
            <h1 className=''>Get tasks done on your schedule</h1>
          </div>
          <div className='d-flex justify-content-center'>
            <Form className="p-inputgroup mx-5 d-flex justify-content-center" style={{ width: '80%' }}>
              <InputText
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for your Task"
              />
              <Button icon="pi pi-search" className="p-button-success" onClick={handleSearch} />
            </Form>
          </div>
          <div className='d-flex align-items-center mt-2 justify-content-center flex-wrap'>
            <h5 className='text-white mt-2 d-flex'>Popular:</h5>
            <Link to={`/search/query=${encodeURIComponent('Landscaping')}`} className='popular mx-1 d-flex'>Landscaping</Link>
            <Link to={`/search/query=${encodeURIComponent('Carpenter')}`} className='popular mx-1 d-flex'>Carpenter</Link>
            <Link to={`/search/query=${encodeURIComponent('Massage')}`} className='popular mx-1 d-flex'>Massage</Link>
            <Link to={`/search/query=${encodeURIComponent('Movers')}`} className='popular mx-1 d-flex'>Movers</Link>
          </div>
        </Col>
        <Col className='right d-flex justify-content-center image-container' lg={5}>
          <Image
            src={currentImage.image}
            height='400'
            className='hero-img'
            style={{ objectFit: 'contain' }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Hero;

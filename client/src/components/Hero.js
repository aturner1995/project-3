import React, { useContext } from 'react';
import { Image, Row, Col } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ThemeContext } from '../utils/themeContext';

const Hero = () => {
    const { currentImage } = useContext(ThemeContext);

    return (
        <div className={`hero bg-${currentImage.color}`}>
            <Row>
                <Col className='left text-center mt-5 pt-5' lg={7}>
                    <div className="text-white mx-5">
                        <h1 className=''>Get tasks done on your schedule</h1>
                    </div>
                    <div className='d-flex justify-content-center'>
                        <div className="p-inputgroup mx-5 d-flex justify-content-center" style={{ width: '80%' }}>
                            <InputText placeholder="Search for your Task" />
                            <Button icon="pi pi-search" className="p-button-success" />
                        </div>
                    </div>
                    <div className='d-flex align-items-center mt-2 justify-content-center flex-wrap'>
                        <h5 className='text-white mt-2 d-flex'>Popular:</h5>
                        <span className='popular mx-1 d-flex'>Landscaping</span>
                        <span className='popular mx-1 d-flex'>Carpenter</span>
                        <span className='popular mx-1 d-flex'>Massage</span>
                        <span className='popular mx-1 d-flex'>Movers</span>
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
}

export default Hero;

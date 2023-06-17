import React, { useState, useEffect } from 'react';
import { Image, Row, Col } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const bgImages = [
    {
        image: '/images/dog-walk.png',
        color: 'yellow'
    },
    {
        image: '/images/carpenter.png',
        color: 'yellow'
    },
    {
        image: '/images/lawn.png',
        color: 'yellow'
    },
    {
        image: '/images/moving.png',
        color: 'yellow'
    },
    {
        image: '/images/massage.png',
        color: 'yellow'
    },
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prevIndex =>
                prevIndex === bgImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const currentImage = bgImages[currentIndex];

    return (
        <div className={`hero bg-dark ${currentImage.color}`}>
            <Row>
                <Col className='left text-center mt-5 pt-5' md={7}>
                    <div className="text-white mx-5">
                        <h1 className=''>Get tasks done on your schedule</h1>
                    </div>
                    <div className='d-flex justify-content-center '>
                        <div className="p-inputgroup mx-5 d-flex justify-content-center" style={{ width: '80%' }}>
                            <InputText placeholder="Keyword" />
                            <Button icon="pi pi-search" className="p-button-success" />
                        </div>
                    </div>
                    <div className='d-flex align-items-center mt-2 justify-content-center'>
                        <h5 className='text-white mt-2'>Popular:</h5>
                        <span className='popular mx-1'>Landscaping</span>
                        <span className='popular mx-1'>Carpenter</span>
                        <span className='popular mx-1'>Massage Therapist</span>
                        <span className='popular mx-1'>Web Development</span>
                    </div>
                </Col>
                <Col className='right d-flex justify-content-center image-container' md={5}>
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

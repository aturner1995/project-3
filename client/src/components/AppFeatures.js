import React from 'react';
import { Image, Row, Col, Container } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';

const AppFeatures = () => {
    return (
        <div className='app-feat'>
            <Container>
                <Row className='py-5'>
                    <Col className='mx-5 justify-content-center'>
                        <h2 className='mb-4'>Taskmaster: Your Productivity Assistant</h2>
                        <ul className='feature-list list-unstyled'>
                            <li className='d-flex align-items-start'>
                                <i className="pi pi-check-circle mt-2"></i>
                                <div className='ms-2'>
                                    <h4>Quality work done on your schedule</h4>
                                    <p>Efficiently manage your tasks and get them done according to your preferred schedule.</p>
                                </div>
                            </li>
                            <li className='d-flex align-items-start'>
                                <i className="pi pi-check-circle mt-2"></i>
                                <div className='ms-2'>
                                    <h4>Stick to your budget</h4>
                                    <p>Keep track of your expenses and ensure your projects stay within the allocated budget.</p>
                                </div>
                            </li>
                            <li className='d-flex align-items-start'>
                                <i className="pi pi-check-circle mt-2"></i>
                                <div className='ms-2'>
                                    <h4>No hidden costs</h4>
                                    <p>Transparent pricing with no hidden fees or unexpected charges.</p>
                                </div>
                            </li>
                            <li className='d-flex align-items-start'>
                                <i className="pi pi-check-circle mt-2"></i>
                                <div className='ms-2'>
                                    <h4>24/7 customer support</h4>
                                    <p>Receive round-the-clock assistance from our dedicated support team.</p>
                                </div>
                            </li>
                        </ul>
                    </Col>
                    <Col className='right-app-feat d-flex flex-column align-items-center justify-content-center position-relative'>
                        <div className='image-container'>
                            <Image src='/images/family.webp' height='450' />
                            <Link to='/search'>
                                <Button label='Explore Now' severity='success' className='position-absolute top-50 start-50 translate-middle' />
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AppFeatures;

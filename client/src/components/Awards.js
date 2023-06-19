import React from 'react';
import { Row, Col } from 'react-bootstrap';

const Awards = () => {
    return (
        <div className='awards'>
            <Row>
                <Col className='text-center mt-3'>
                    <h3><strong>10,000+</strong></h3>
                    <p>TASKS COMPLETED</p>
                </Col>
                <Col className='text-center mt-3'>
                    <h3><strong>96%</strong></h3>
                    <p>RATED PERFECT SERVICE</p>
                </Col>
                <Col className='text-center mt-3'>
                    <h3 className='d-flex align-items-center justify-content-center'><strong>4.8</strong><i className="pi pi-star-fill"></i></h3>
                    <p>APP STORE RATING</p>
                </Col>
            </Row>
        </div>
    )
}

export default Awards
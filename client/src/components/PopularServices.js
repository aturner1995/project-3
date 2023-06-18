import React from 'react';
import { Carousel } from 'primereact/carousel';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const services = [
    {
        name: 'Landscaping',
        image: '/images/landscape.avif'
    },
    {
        name: 'Dog Care',
        image: '/images/dog.avif'
    },
    {
        name: 'House Cleaning',
        image: '/images/cleaning.avif'
    },
    {
        name: 'Web Development',
        image: '/images/web.avif'
    },
    {
        name: 'Renovations',
        image: '/images/reno.avif'
    },
    {
        name: 'Appliance Repair',
        image: '/images/washer.avif'
    },
    {
        name: 'Physical Therapy',
        image: '/images/massage2.avif'
    },
    {
        name: 'Photography',
        image: '/images/photo.avif'
    }
];

const PopularServices = () => {
    const responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const serviceTemplate = (product) => {
        return (
            <Link className="border-1 surface-border border-round m-2 text-center py-5 px-3">
                <div className="mb-3 position-relative card-container">
                    <img src={product.image} height="400" alt={product.name} className="w-6 shadow-2" />
                    <h4 className="mb-1 product-title-car position-absolute bottom-50 start-50 translate-middle-x text-white">
                        <strong>{product.name}</strong>
                    </h4>
                </div>
            </Link>
        );
    };

    return (
        <>
            <Container fluid>
                <h2 className="ms-5 mt-5">Popular Tasks:</h2>
                <Carousel
                    value={services}
                    numVisible={4}
                    numScroll={1}
                    responsiveOptions={responsiveOptions}
                    className="custom-carousel"
                    autoplayInterval={5000}
                    itemTemplate={serviceTemplate}
                />
            </Container>
        </>
    );
};

export default PopularServices;
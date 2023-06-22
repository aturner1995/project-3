import React from 'react';
import { Carousel } from 'primereact/carousel';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

const services = [
    {
        name: 'Landscaping',
        image: '/images/landscape.webp'
    },
    {
        name: 'Dog Care',
        image: '/images/dog.webp'
    },
    {
        name: 'House Cleaning',
        image: '/images/cleaning.webp'
    },
    {
        name: 'Web Development',
        image: '/images/web.webp'
    },
    {
        name: 'Renovations',
        image: '/images/reno.webp'
    },
    {
        name: 'Appliance Repair',
        image: '/images/washer.webp'
    },
    {
        name: 'Physical Therapy',
        image: '/images/massage2.webp'
    },
    {
        name: 'Photography',
        image: '/images/photo.webp'
    }
];

const PopularServices = () => {
    const responsiveOptions = [
        {
            breakpoint: '1800px',
            numVisible: 5,
            numScroll: 1
        },
        {
            breakpoint: '1500px',
            numVisible: 4,
            numScroll: 1
        },
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
            <Link to={`/search/category=${encodeURIComponent(product.name)}`} className="border-1 surface-border border-round m-2 text-center py-5 px-3">
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
                    numVisible={6}
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
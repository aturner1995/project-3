import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import { Galleria } from 'primereact/galleria';
import { Card, Container } from 'react-bootstrap';
import { MultiSelect } from 'primereact/multiselect';

const Search = () => {
    const searchData = [
        {
            img: ['/images/search1.jpg', '/images/search2.jpg'],
            title: 'Lawn Mowing',
            description: 'I mow your lawn for money'
        },
        {
            img: ['/images/search1.jpg', '/images/search2.jpg'],
            title: 'House Cleaning',
            description: 'I clean your house for money'
        },
        {
            img: ['/images/search1.jpg', '/images/search2.jpg'],
            title: 'Dog Walking',
            description: 'I walk your dog for money'
        },
        {
            img: ['/images/search1.jpg', '/images/search2.jpg'],
            title: 'Tutoring',
            description: 'I provide tutoring services for money'
        },
        {
            img: ['/images/search1.jpg', '/images/search2.jpg'],
            title: 'Tutoring',
            description: 'I provide tutoring services for money'
        },
        {
            img: ['/images/search1.jpg', '/images/search2.jpg'],
            title: 'Tutoring',
            description: 'I provide tutoring services for money'
        },
        {
            img: ['/images/search1.jpg', '/images/search2.jpg'],
            title: 'Tutoring',
            description: 'I provide tutoring services for money'
        },
        {
            img: ['/images/search1.jpg', '/images/search2.jpg'],
            title: 'Tutoring',
            description: 'I provide tutoring services for money'
        }
    ];

    const itemTemplate = (item) => {
        return (
            <div>
                <img src={item} alt="Item" style={{ height: '150px' }} />
            </div>
        );
    };

    const thumbnailTemplate = (item) => {
        return (
            <div>
                <img src={item} alt="Thumbnail" />
            </div>
        );
    };

    const [selectedCategories, setSelectedCategories] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const categories = [
        { name: '1'},
        { name: '2'},
        { name: '3'},
        { name: '4'},
        { name: '5'}
    ];

    const filters = [
        {name: 'Location'},
        {name: 'Low Price'},
        {name: 'Ratings'},
        {name: 'High Price'},
    ]

    return (
        <div>
            <h1 className='mx-5 my-3'>Search Tasks</h1>
            <SearchForm />
            <Container className='d-flex justify-content-end' fluid>
                <MultiSelect value={selectedFilter} onChange={(e) => setSelectedFilter(e.value)} options={filters} optionLabel="name" display="chip"
                    placeholder="Filter By" className='mx-2'/>
                <MultiSelect value={selectedCategories} onChange={(e) => setSelectedCategories(e.value)} options={categories} optionLabel="name" display="chip"
                    placeholder="Select Category" className='mx-2'/>
            </Container>
            <Container className="d-flex flex-wrap justify-content-center" fluid>
                {searchData.map((service, index) => (
                    <Card key={index} className="m-2" style={{ maxWidth: '266.66px' }}>
                        <Galleria
                            value={service.img}
                            numVisible={5}
                            circular
                            showItemNavigators
                            showThumbnails={false}
                            item={itemTemplate}
                            thumbnail={thumbnailTemplate}
                        />
                        <Card.Body className="text-center">
                            <Card.Title>{service.title}</Card.Title>
                            <Card.Text>{service.description}</Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </Container>
        </div>
    );
};

export default Search;
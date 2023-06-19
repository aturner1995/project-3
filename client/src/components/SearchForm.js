import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Container } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { QUERY_REVERSE_GEOCODE } from '../utils/queries';
import { Button } from 'primereact/button';

const SearchForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [userAddress, setUserAddress] = useState('');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    const { loading, error, data } = useQuery(QUERY_REVERSE_GEOCODE, {
        variables: { latitude, longitude },
    });

    useEffect(() => {
        if (data) {
            if (data.reverseGeocode) {
                setCity(data.reverseGeocode.city);
                setState(data.reverseGeocode.state);
                setCountry(data.reverseGeocode.country);
                setUserAddress(`${data.reverseGeocode.city}, ${data.reverseGeocode.state}, ${data.reverseGeocode.country}`);
            }
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchQuery('')
    };

    return (
        <Container className='d-flex justify-content-center'>
            <Form onSubmit={handleSubmit} className='card mx-5' style={{ width: '50%' }}>
                <Form.Group className='m-2'>
                    <Form.Control
                        value={searchQuery}
                        type="string"
                        placeholder="Search for your task"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className='m-2'>
                    <Form.Control
                        value={userAddress}
                        type="string"
                        placeholder="Address"
                        onChange={(e) => setUserAddress(e.target.value)}
                    />
                </Form.Group>
                <div className='text-center'>
                    <Button type="submit" severity='success' className='mb-2' size="small">Search</Button>
                </div>
            </Form>
        </Container>

    );
};

export default SearchForm;

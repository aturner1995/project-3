import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { QUERY_REVERSE_GEOCODE } from '../utils/queries';
import { Button } from 'primereact/button';
import { useParams } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';

const SearchForm = ({ setUserSearchQuery, setSelectedCategories, categoriesList, setUserSearchAddress, setDistance, isLoading, setAddressSet }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistance, setSelectedDistance] = useState(null);

  const searchParams = useParams();

  useEffect(() => {
    if (searchParams.query && searchParams.query.split('=')[0] === 'category') {
      const categoryName = searchParams.query.split('=')[1];
      const selectedCategory = categoriesList.find(category => category.name === categoryName);
      if (selectedCategory) {
        setCategories([selectedCategory]);
        setSelectedCategories([selectedCategory]);
      }
    } else if (searchParams.query) {
      setSearchQuery(searchParams.query.split('=')[1]);
      setUserSearchQuery(searchParams.query.split('=')[1]);
    }
  }, [searchParams, categoriesList, setSelectedCategories, setUserSearchQuery]);
  


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          setAddressSet(true);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setAddressSet(true);
    }
  }, [setAddressSet]);
  

  const { data } = useQuery(QUERY_REVERSE_GEOCODE, {
    skip: !latitude || !longitude,
    variables: { latitude, longitude },
  });

  useEffect(() => {
    if (data) {
      if (data.reverseGeocode) {
        setUserAddress(
          `${data.reverseGeocode.city}, ${data.reverseGeocode.state}, ${data.reverseGeocode.country}`
        );
        setUserSearchAddress(`${data.reverseGeocode.city}, ${data.reverseGeocode.state}, ${data.reverseGeocode.country}`);
        setAddressSet(true);
      }
    }
  }, [data, setUserSearchAddress, setAddressSet]);  

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserAddressChange = (e) => {
    setUserAddress(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategories(e.value);
    setSelectedCategories(categories)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUserSearchQuery(searchQuery);
    setSelectedCategories(categories);
    setUserSearchAddress(userAddress);
    setDistance(selectedDistance);
    setAddressSet(true);
  };


  const distanceOptions = [
    { label: '10 km', value: 10 },
    { label: '25 km', value: 25 },
    { label: '50 km', value: 50 },
    { label: '100 km', value: 100 },
  ];

  const handleDistanceChange = (e) => {
    setSelectedDistance(e.value);
  };

  return (
    <Form onSubmit={handleSubmit} className="mx-5">
      <Row className="m-2 justify-content-center align-items-center">
        <Col xs={12} md={5} lg={5} className="mb-2 mx-2">
          <Form.Control
            value={searchQuery || ''}
            type="string"
            placeholder="Search for your task"
            onChange={handleSearchQueryChange}
            className='mt-1'
            size="lg"
          />
        </Col>
        <Col xs={12} md={5} lg={5} className='mb-2'>
          <Form.Control
            value={userAddress}
            type="string"
            placeholder="Address"
            onChange={handleUserAddressChange}
            className='mt-1'
            size="lg"
          />
        </Col>
        <Col xs={12} md={3} lg={3} className='text-center d-flex align-items-center'>
          <MultiSelect
            value={categories}
            onChange={handleCategoryChange}
            options={categoriesList}
            optionLabel="name"
            display="chip"
            placeholder="Select Category"
            className='mt-1'
            maxSelectedLabels={1}
          />
        </Col>
        <Col xs={12} md={3} lg={3} className='pt-1 text-center d-flex align-items-center'>
          <Dropdown
            value={selectedDistance}
            options={distanceOptions}
            onChange={handleDistanceChange}
            placeholder="Select Distance"
          />
        </Col>
        <Col xs={12} md={2} lg={2} className='text-center mt-2 d-flex align-items-center'>
          <Button type="submit" disabled={isLoading} severity='success'>
            {isLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Loading...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
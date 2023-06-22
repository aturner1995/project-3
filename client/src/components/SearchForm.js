import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { QUERY_REVERSE_GEOCODE } from '../utils/queries';
import { Button } from 'primereact/button';
import { useParams } from 'react-router-dom';
import { MultiSelect } from 'primereact/multiselect';
import { useLocation } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { QUERY_GEOCODE } from '../utils/queries';

const SearchForm = ({ setUserSearchQuery, setSelectedCategories, categoriesList, setSearchLocation, setDistance }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistance, setSelectedDistance] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const location = useLocation();
  const searchParams = useParams();

  useEffect(() => {
    if (searchParams.query && searchParams.query.split('=')[0] === 'category') {
      const categoryName = searchParams.query.split('=')[1];
      const selectedCategory = categoriesList.find(category => category.name === categoryName);
      if (selectedCategory) {
        setCategories([selectedCategory]);
        setSelectedCategories(categories)
      }
    } else if (searchParams.query) {
      setSearchQuery(searchParams.query.split('=')[1]);
      setUserSearchQuery(searchQuery)
    }

  }, [searchParams]);


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setSearchLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const { data } = useQuery(QUERY_REVERSE_GEOCODE, {
    variables: { latitude, longitude },
  });

  const { data: geoData } = useQuery(QUERY_GEOCODE, {
    variables: { address: userAddress },
    skip: !formSubmitted,
    onCompleted: () => setFormSubmitted(false),
  });

  useEffect(() => {
    if (data) {
      if (data.reverseGeocode) {
        setCity(data.reverseGeocode.city);
        setState(data.reverseGeocode.state);
        setCountry(data.reverseGeocode.country);
        setUserAddress(
          `${data.reverseGeocode.city}, ${data.reverseGeocode.state}, ${data.reverseGeocode.country}`
        );
      }
    }
  }, [data]);

  useEffect(() => {
    if (geoData) {
      setSearchLocation([geoData.geocode.latitude, geoData.geocode.longitude])
    }
  }, [geoData])

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

    if (userAddress === `${city}, ${state}, ${country}`) {
      setSearchLocation([latitude, longitude]);
      setDistance(selectedDistance);
    } else {
      setFormSubmitted(true);
    }
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
        <Col xs={12} md={2} lg={2} className='text-center'>
          <MultiSelect
            value={categories}
            onChange={handleCategoryChange}
            options={categoriesList}
            optionLabel="name"
            display="chip"
            placeholder="Select Category"
            className='mt-1'
            maxselectedlabels={1}
          />
        </Col>
        <Col xs={12} md={2} lg={2} className='pt-1 text-center'>
          <Dropdown
            value={selectedDistance}
            options={distanceOptions}
            onChange={handleDistanceChange}
            placeholder="Select Distance"
          />
        </Col>
        <Col xs={12} md={2} lg={2} className='text-center mt-2'>
          <Button type="submit" severity="success" size="small">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchForm;
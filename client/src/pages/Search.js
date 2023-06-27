import React, { useState, useEffect, useMemo } from 'react';
import SearchForm from '../components/SearchForm';
import { Galleria } from 'primereact/galleria';
import { Card, Container } from 'react-bootstrap';
import { useQuery } from '@apollo/client';
import { QUERY_ALL_SERVICES, QUERY_CATEGORY } from '../utils/queries';
import { Link, useLocation, useParams } from 'react-router-dom';

const Search = () => {
  // State variables
  const [services, setServices] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userSearchAddress, setUserSearchAddress] = useState('');
  const [distance, setDistance] = useState(100);
  const [addressSet, setAddressSet] = useState(false);

  // Query data using Apollo useQuery hook
  const { loading, data } = useQuery(QUERY_ALL_SERVICES, {
    skip: !addressSet, // Skip the query if addressSet is false
    variables: {
      searchQuery: userSearchQuery,
      category: selectedCategories.map((category) => category.name),
      userSearchAddress: userSearchAddress,
      distance: distance
    },
  });

  // Set the services when data is fetched
  useEffect(() => {
    if (data) {
      setServices(data.services);
    }
  }, [data]);

  // Get location and search params
  const location = useLocation();
  const searchParams = useParams();

  // Query category data
  const { data: catData } = useQuery(QUERY_CATEGORY);
  const categoriesList = useMemo(() => catData?.categories || [], [catData]);

  // Update selected categories or user search query based on search params
  useEffect(() => {
    if (searchParams.query && searchParams.query.split('=')[0] === 'category') {
      const categoryName = searchParams.query.split('=')[1];
      const category = categoriesList.find(category => category.name === categoryName);
      if (category) {
        setSelectedCategories([category])
      }
    } else if (searchParams.query) {
      setUserSearchQuery(searchParams.query.split('=')[1]);
    }
  }, [location.search, categoriesList, searchParams.query]);
 

  // Set the services when data is fetched
  useEffect(() => {
    if (data) {
      setServices(data.services);
    }
  }, [data]);

  // Template for the item in the Galleria
  const itemTemplate = (item) => {
    return (
      <div>
        <img src={item.url} alt="Item" style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
      </div>
    );
  };

  // Template for the thumbnail in the Galleria
  const thumbnailTemplate = (item) => {
    return (
      <div>
        <img src={item.url} alt="Thumbnail" />
      </div>
    );
  };

  return (
    <div>
      <h1 className='mx-5 my-3'>Search Tasks</h1>
      {/* Render the SearchForm component */}
      <SearchForm
        setUserSearchQuery={setUserSearchQuery}
        setSelectedCategories={setSelectedCategories}
        categoriesList={categoriesList}
        setUserSearchAddress={setUserSearchAddress}
        setDistance={setDistance}
        isLoading={loading}
        setAddressSet={setAddressSet}
      />
      <Container className="d-flex flex-wrap justify-content-center" fluid>
        {services.map((service) => {
          // Find the lowest price among the options
          const lowestPrice = service.options.reduce((minPrice, option) => {
            return option.price < minPrice ? option.price : minPrice;
          }, Infinity);

          return (
            // Render a Card component for each service
            <Link to={`/product/${service._id}`} key={service._id}>
              <Card className="m-2 custom-card" style={{ maxWidth: '300px' }}>
                {/* Render the Galleria component */}
                <Galleria
                  value={service.images}
                  numVisible={5}
                  circular
                  showItemNavigators
                  showThumbnails={false}
                  item={itemTemplate}
                  thumbnail={thumbnailTemplate}
                />
                <Card.Body className="text-center">
                  <Card.Title>
                    <strong>{service.name}</strong>
                  </Card.Title>
                  <div className="text-start">
                    <Card.Text>
                      {service.description.length > 100 ? (
                        <>
                          {service.description.substring(0, 100)}...
                        </>
                      ) : (
                        service.description
                      )}
                    </Card.Text>
                  </div>
                  <Card.Text>
                    <strong>Starting from ${lowestPrice}</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
          );
        })}
      </Container>
    </div>
  );
};

export default Search;

import React, { useState, useEffect } from 'react';
import SearchForm from '../components/SearchForm';
import { Galleria } from 'primereact/galleria';
import { Card, Container } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';
import { useQuery } from '@apollo/client';
import { QUERY_ALL_SERVICES } from '../utils/queries';
import { Link } from 'react-router-dom';

const Search = () => {
  const [services, setServices] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const { loading, error, data } = useQuery(QUERY_ALL_SERVICES, {
    variables: {
      searchQuery: userSearchQuery,
      category: selectedCategories.map((category) => category.name),
    },
  });

  useEffect(() => {
    if (data) {
      setServices(data.services);
    }
  }, [data]);

  console.log(userSearchQuery, selectedCategories);

  const itemTemplate = (item) => {
    return (
      <div>
        <img
          src={item.url}
          alt="Item"
          style={{ width: '100%', height: '150px', objectFit: 'cover' }}
        />
      </div>
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <div>
        <img src={item.url} alt="Thumbnail" />
      </div>
    );
  };

  const filters = [
    { name: 'Location' },
    { name: 'Cost' },
    { name: 'Highly Rated' },
  ];

  return (
    <div>
      <h1 className="mx-5 my-3">Search Tasks</h1>
      <SearchForm
        setUserSearchQuery={setUserSearchQuery}
        setSelectedCategories={setSelectedCategories}
      />
      <Container className="d-flex justify-content-end" fluid>
        <Dropdown
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.value)}
          options={filters}
          optionLabel="name"
          display="chip"
          placeholder="Filter By"
          maxSelectedLabels={1}
          className="mx-2"
        />
      </Container>
      <Container className="d-flex flex-wrap justify-content-center" fluid>
        {services.map((service) => {
          const lowestPrice = service.options.reduce((minPrice, option) => {
            return option.price < minPrice ? option.price : minPrice;
          }, Infinity);

          return (
            <Link to={`/product/${service._id}`} key={service._id}>
              <Card className="m-2 custom-card" style={{ maxWidth: '300px' }}>
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

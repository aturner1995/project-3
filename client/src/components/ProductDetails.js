import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Galleria } from 'primereact/galleria';
import { QUERY_SERVICE } from '../utils/queries';
const ProductDetails = () => {
  const { id } = useParams();
  const toast = useRef(null);
  const nameInput = useRef(null);
  const numberInput = useRef(null);
  const dateInput = useRef(null);
  const timeInput = useRef(null);
  const descriptionInput = useRef(null);

  const { loading, error, data } = useQuery(QUERY_SERVICE, {
    variables: { id },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { service } = data;

  const images = service.images.map((image) => ({
    itemImageSrc: image.url,
    thumbnailImageSrc: image.url,
    alt: 'Service Image',
  }));

  const responsiveOptions = [
    {
      breakpoint: '991px',
      numVisible: 4,
    },
    {
      breakpoint: '767px',
      numVisible: 3,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ];

  const itemTemplate = (item) => {
    return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%' }} />;
  };

  const thumbnailTemplate = (item) => {
    return <img src={item.thumbnailImageSrc} alt={item.alt} style={{ width: '50%' }} />;
  };

  const showToast = () => {
    toast.current.show({ severity: 'success', summary: 'Booking Successful', life: 3000 });
  };

  const bookService = () => {
    const name = nameInput.current.value;
    const number = numberInput.current.value;
    const date = dateInput.current.value;
    const time = timeInput.current.value;
    const description = descriptionInput.current.value;


    showToast();
  };

  return (
    <div className='container'>
      <div className="row">
        <div className="col-md-8">
        <Card className="product-card" style={{ marginBottom: '2rem' }}>
  <div className="product-details">
    <h2 className="product-name">{service.name}</h2>
    <h3 className="product-price">Price: ${service.options[0].price}</h3>
  </div>
  <div className="row">
    <div className="col-12">
      <h4 className="product-section-heading">Product Description</h4>
      <p className="product-description">{service.description}</p>
    </div>
  </div>
  <div className="row">
    <div className="col-12">
      <h4 className="product-section-heading">Category</h4>
      <p className="product-category">{service.category.name}</p>
    </div>
  </div>
  <div className="row">
    <div className="col-12">
      <h4 className="product-section-heading">Images</h4>
      <Galleria
        value={images}
        responsiveOptions={responsiveOptions}
        numVisible={5}
        style={{ maxWidth: '640px' }}
        item={itemTemplate}
        thumbnail={thumbnailTemplate}
      />
    </div>
  </div>
</Card>

        </div>
        <div className="col-md-4">
          <Card className="booking-card">
            <h2 className="booking-title">Book Now</h2>
            <div className="booking-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <InputText ref={nameInput} id="name" placeholder="Name" className="form-control" />
              </div>
              <div className="form-group">
                <label htmlFor="number">Phone Number</label>
                <InputText ref={numberInput} id="number" placeholder="Phone Number" className="form-control" />
              </div>
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <Calendar ref={dateInput} id="date" placeholder="Date" dateFormat="dd/mm/yy" showIcon={true} className="form-control" />
              </div>
              <div className="form-group">
                <label htmlFor="time">Time</label>
                <InputText ref={timeInput} id="time" placeholder="Time" className="form-control" />
              </div>
              <div className="form-group">
                <label htmlFor="description">Additional Description</label>
                <InputText ref={descriptionInput} id="description" placeholder="Additional Description" className="form-control" />
              </div>
              <Button label="Book Now" className="btn btn-success" style={{ width: '100%' }} onClick={bookService} />
            </div>
          </Card>
        </div>
        <Toast ref={toast}></Toast>
      </div>
    </div>
  );
};

export default ProductDetails;

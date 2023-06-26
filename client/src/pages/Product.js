import React, { useRef, useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Card, Col, Container, Row, Tab, Nav } from "react-bootstrap";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import { Galleria } from "primereact/galleria";
import { QUERY_SERVICE } from "../utils/queries";
import { BreadCrumb } from "primereact/breadcrumb";
import { CREATE_BOOKING } from "../utils/mutations";
import { useMutation } from "@apollo/client";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import ChatPopup from "../components/ChatPopup";

const ProductDetails = () => {
  
  const { id } = useParams();
  const toast = useRef(null);
  const nameInput = useRef(null);
  const numberInput = useRef(null);
  const timeInput = useRef(null);
  const descriptionInput = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [createBooking, { loadingBooking, errorbooking }] =
    useMutation(CREATE_BOOKING);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const handleTabSelect = (index) => {
    setActiveTab(index);
    const selectedOption = service.options[index];
    setSelectedPrice(selectedOption.price);
  };

  const { loading, error, data } = useQuery(QUERY_SERVICE, {
    variables: { id },
  });

  console.log(data);

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
    alt: "Service Image",
  }));

  const responsiveOptions = [
    {
      breakpoint: "991px",
      numVisible: 4,
    },
    {
      breakpoint: "767px",
      numVisible: 3,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
    },
  ];

  
  const itemTemplate = (item) => {
    return (
      <img src={item.itemImageSrc} alt={item.alt} style={{ width: "100%" }} />
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <img
        src={item.thumbnailImageSrc}
        alt={item.alt}
        style={{ width: "50%" }}
      />
    );
  };

  
  const showToast = () => {
    toast.current.show({
      severity: "success",
      summary: "Booking Successful",
      life: 3000,
    });
  };
  let selectedOption = service.options[activeTab];
  
  const bookService = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const name = nameInput.current.value;
    const number = numberInput.current.value;
    const time = timeInput.current.value;
    const date = selectedDate ? selectedDate.toISOString() : null;
    const description = descriptionInput.current.value;

    const selectedOption = service.options[activeTab];
    const totalPrice = selectedOption.price

    try {
      const { data } = await createBooking({
        variables: {
          name,
          number,
          date,
          time,
          description,
          serviceId: id,
        },
        refetchQueries: [{ query: QUERY_SERVICE, variables: { id } }],
      });

      showToast();
      console.log("Booking created:", data.createBooking);
      console.log("Total Price:", totalPrice);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const items = [
    { label: `Services`, url: "http://localhost:3000/search" },
    { label: `${service.category.name}` },
  ];
  const home = { icon: "pi pi-home", url: "http://localhost:3000/" };

  return (
    <Container>
      <Row>
        <Col lg={7}>
          <BreadCrumb model={items} home={home} className="ms-0" />
          <div className="ms-2">
            <div className="product-details">
              <h2 className="product-name">{service.name}</h2>
              <p>
                {service.user.username} - {service.user.email}
              </p>
            </div>
            <Galleria
              value={images}
              responsiveOptions={responsiveOptions}
              numVisible={5}
              style={{ maxWidth: "90%" }}
              item={itemTemplate}
              thumbnail={thumbnailTemplate}
            />
            <div>
              <div className="my-4">
                <h4 className="product-section-heading">Product Description</h4>
                <p className="product-description">{service.description}</p>
              </div>
            </div>
          </div>
        </Col>
        <Col lg={5}>
          <Card>
            <Card.Body>
              <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
                <Nav variant="tabs" className="mb-3" justify="fill">
                  {service.options.map((option, index) => (
                    <Nav.Item key={index}>
                      <Nav.Link
                        className={`options-tab ${
                          activeTab === index ? "active" : ""
                        }`}
                        eventKey={index}
                      >
                        {option.title}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
                <Tab.Content>
                  {service.options.map((option, index) => (
                    <Tab.Pane
                      key={index}
                      eventKey={index}
                      className={`mx-2 ${activeTab === index ? "active" : ""}`}
                    >
                      <h4>
                        <strong>
                          ${selectedOption.price}
                        </strong>
                      </h4>
                      <Card.Text>{option.description}</Card.Text>
                      <div className="text-center">
                        <Button
                          label="Continue"
                          severity="success"
                          onClick={() => setShowBookingForm(true)}
                        />
                        <br />
                    
                  
                      </div>
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Dialog
        visible={showBookingForm}
        onHide={() => setShowBookingForm(false)}
        position="top"
        className="booking-modal"
        style={{ width: "50vw" }}
      >
        <div className="booking-form">
          <h2 className="booking-title">Book Now</h2>
          <h4>Selected Price: ${selectedPrice}</h4>
          <form>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                placeholder="Name"
                className="form-control"
                ref={nameInput}
              />
            </div>
            <div className="form-group">
              <label htmlFor="number">Phone Number</label>
              <InputText
                id="number"
                placeholder="Phone Number"
                className="form-control"
                ref={numberInput}
              />
            </div>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <Calendar
                id="date"
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="time">Time</label>
              <InputText
                id="time"
                placeholder="Time"
                className="form-control"
                ref={timeInput}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Additional Description</label>
              <InputTextarea
                id="description"
                placeholder="Additional Description"
                className="form-control"
                rows={5}
                ref={descriptionInput}
              />
            </div>
            <Button
              label="Book Now"
              className="btn btn-primary"
              onClick={bookService}
            />
          </form>
        </div>
      </Dialog>
        <ChatPopup seller={data.service.user}/>
      <Toast ref={toast}></Toast>
    </Container>
  );
};

export default ProductDetails;

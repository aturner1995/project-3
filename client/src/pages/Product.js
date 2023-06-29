import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Card, Col, Container, Row, Tab, Nav } from "react-bootstrap";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Galleria } from "primereact/galleria";
import { BreadCrumb } from "primereact/breadcrumb";
import { loadStripe } from "@stripe/stripe-js";
import { QUERY_SERVICE } from "../utils/queries";
import { CREATE_BOOKING } from "../utils/mutations";
import { QUERY_CHECKOUT } from "../utils/queries";
import ChatPopup from "../components/ChatPopup";
import Comment from "../components/Comment";
import { ProgressSpinner } from "primereact/progressspinner";
import auth from "../utils/auth";
import { Message } from "primereact/message";
import BookingStats from "../components/Bookingstats";
import { Modal, Form } from "react-bootstrap";
import { faUser, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ProductDetails = () => {
  const { id } = useParams();
  const toast = useRef(null);
  const nameInput = useRef(null);
  const numberInput = useRef(null);
  const dateInput = useRef(null);
  const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");
  const timeInput = useRef(null);
  const descriptionInput = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [createBooking] =
    useMutation(CREATE_BOOKING);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [getCheckout, { data: dataCheckOut }] = useLazyQuery(QUERY_CHECKOUT);
  const [showLoginError, setShowLoginError] = useState(false);


  useEffect(() => {
    if (dataCheckOut) {
      stripePromise.then((res) => {
        res.redirectToCheckout({ sessionId: dataCheckOut.checkout.session });
      });
    }
  }, [dataCheckOut]);

  const handleTabSelect = (index) => {
    setActiveTab(index);
    const selectedOption = service.options[index];
    setSelectedPrice(selectedOption.price);
  };

  const handleContinueClick = () => {
    if (auth.loggedIn()) {
      setShowBookingForm(true);
      const selectedOption = service.options[activeTab];
      setSelectedPrice(selectedOption.price);
    } else {
      setShowLoginError(true);
    }
  };

  const { loading, error, data } = useQuery(QUERY_SERVICE, {
    variables: { id },
    onCompleted: (data) => {
      const { service } = data;
      const selectedOption = service.options[activeTab];
      setSelectedPrice(selectedOption.price);
    },
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const { service } = data;

  console.log(service)

  console.log(service._id);

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
      content: (
        <div>
          <div>Redirecting to payment portal...</div>
          <div>
            <ProgressSpinner
              style={{ width: "20px", height: "20px", marginLeft: "10px" }}
              strokeWidth="4"
              animationDuration=".5s"
            />
          </div>
        </div>
      ),
      life: 3000,
    });
  };

  const bookService = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const name = nameInput.current.value;
    const number = numberInput.current.value;
    const time = timeInput.current.value;
    const date = dateInput.current.value;
    const description = descriptionInput.current.value;

    const selectedOption = service.options[activeTab];
    const totalPrice = selectedOption.price;

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

      getCheckout({
        variables: { id, price: selectedPrice },
      });

      showToast();
      console.log("Booking created:", data.createBooking);
      console.log("Total Price:", totalPrice);
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const items = [
    { label: "Services", url: "/search" },
    { label: `${service.category.name}` },
  ];
  const home = { icon: "pi pi-home", url: "/" };

  return (
    <Container>
      {showLoginError && (
        <div className="p-mb-4">
          <Message
            severity="error"
            text="Please login/Signup to book the service"
          />
        </div>
      )}
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
                        className={`options-tab ${activeTab === index ? "active" : ""
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
                        <strong>${option.price}</strong>
                      </h4>
                      <Card.Text>{option.description}</Card.Text>
                      <div className="text-center">
                        <Button
                          label="Continue"
                          severity="success"
                          onClick={handleContinueClick}
                        />
                        <br />
                      </div>
                    </Tab.Pane>
                  ))}
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
          <BookingStats serviceId={service._id} />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <Comment serviceId={service._id} />
        </Col>
      </Row>
      <Modal
        show={showBookingForm}
        onHide={() => setShowBookingForm(false)}
        dialogClassName="booking-modal col-12 col-md-6"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-center">
            Book Now
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <div className="input-group align-items-center">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                </div>
                <Form.Control type="text" placeholder="Name" ref={nameInput} />
              </div>
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone Number</Form.Label>
              <div className="input-group align-items-center">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faPhone} />
                  </span>
                </div>
                <Form.Control
                  type="text"
                  placeholder="Phone Number"
                  ref={numberInput}
                />
              </div>
            </Form.Group>
            <Form.Group className="m-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                ref={dateInput}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="m-2">
              <Form.Label>Time</Form.Label>
              <Form.Control type="time" placeholder="Time" ref={timeInput} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Additional Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Additional Description"
                ref={descriptionInput}
              />
            </Form.Group>
            <Form.Group style={{ textAlign: "right", marginTop: "10px" }}>
              <Form.Label>Selected Price (CAD)</Form.Label>
              <div
                className="selected-price"
                style={{
                  backgroundColor: "#f2f2f2",
                  padding: "10px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                ${selectedPrice}
              </div>
            </Form.Group>

            <Button label="Book now" severity="success" onClick={bookService} className="mt-3" />
          </Form>
        </Modal.Body>
      </Modal>
      <ChatPopup seller={data.service.user} />
      <Toast ref={toast}></Toast>
    </Container>
  );
};

export default ProductDetails;

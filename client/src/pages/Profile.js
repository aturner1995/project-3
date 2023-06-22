import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Container, Row, Col } from "react-bootstrap";
import Footer from "./Footer";
import {
  QUERY_USER,
  QUERY_LISTINGS,
  QUERY_BOOKINGS,
  QUERY_PURCHASES,
} from "../utils/queries";

const Profile = () => {
  const [user, setUser] = useState({});
  const { loading: userLoading, data: userData } = useQuery(QUERY_USER);
  const {
    loading: listingsLoading,
    error: listingsError,
    data: listingsData,
  } = useQuery(QUERY_LISTINGS);
  const {
    loading: bookingsLoading,
    error: bookingsError,
    data: bookingsData,
  } = useQuery(QUERY_BOOKINGS);
  const {
    loading: purchasesLoading,
    error: purchasesError,
    data: purchasesData,
  } = useQuery(QUERY_PURCHASES);

  useEffect(() => {
    if (userData) {
      setUser(userData.user);
    }
  }, [userData]);

  return (
    <div>
      <Hero />

      <Container>
        <Row>
          <Col>
            <h1>{user.username}'s Profile</h1>
            <h2>Listings</h2>
            {listingsLoading ? (
              <p>Loading listings...</p>
            ) : listingsError ? (
              <p>Error loading listings: {listingsError.message}</p>
            ) : (
              <ul>
                {listingsData.listings.map((listing) => (
                  <li key={listing.id}>{listing.title}</li>
                ))}
              </ul>
            )}
            <h2>Bookings</h2>
            {bookingsLoading ? (
              <p>Loading bookings...</p>
            ) : bookingsError ? (
              <p>Error loading bookings: {bookingsError.message}</p>
            ) : (
              <ul>
                {bookingsData.bookings.map((booking) => (
                  <li key={booking.id}>
                    {booking.service.title} - {booking.date}
                  </li>
                ))}
              </ul>
            )}
            <h2>Purchases</h2>
            {purchasesLoading ? (
              <p>Loading purchases...</p>
            ) : purchasesError ? (
              <p>Error loading purchases: {purchasesError.message}</p>
            ) : (
              <ul>
                {purchasesData.purchases.map((purchase) => (
                  <li key={purchase.id}>
                    {purchase.service.title} - {purchase.date}
                  </li>
                ))}
              </ul>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default Profile;

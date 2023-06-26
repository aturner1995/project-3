import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import {
  QUERY_USER,
  QUERY_USER_SERVICES,
  GET_BOOKINGS,
  QUERY_USER_LISTINGS,
  QUERY_USER_PURCHASES,
} from "../utils/queries";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);

  const { loading: userLoading, data: userData } = useQuery(QUERY_USER);
  const { loading: listingsLoading, data: listingsData } = useQuery(QUERY_USER_LISTINGS, {
    variables: { userId: userData?.user?._id },
  });
  const { loading: bookingsLoading, data: bookingsData } = useQuery(GET_BOOKINGS);
  const { loading: purchasesLoading, data: purchasesData } = useQuery(QUERY_USER_PURCHASES, {
    variables: { userId: userData?.user?._id },
  });

  useEffect(() => {
    if (userData) {
      setUserProfile(userData.user);
    }
  }, [userData]);

  useEffect(() => {
    if (listingsData) {
      setUserListings(listingsData.userListings);
    }
  }, [listingsData]);

  useEffect(() => {
    if (bookingsData) {
      setUserBookings(bookingsData.bookings);
    }
  }, [bookingsData]);

  useEffect(() => {
    if (purchasesData) {
      setUserPurchases(purchasesData.userPurchases);
    }
  }, [purchasesData]);

  if (userLoading || listingsLoading || bookingsLoading || purchasesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {userProfile.username}!</h1>
      <h2>User Information</h2>
      <p>Email: {userProfile.email}</p>

      <h2>Listings</h2>
      {userListings.length > 0 ? (
        <ul>
          {userListings.map((listing) => (
            <li key={listing._id}>
              <h3>{listing.name}</h3>
              <p>Description: {listing.description}</p>
              <p>Category: {listing.category.name}</p>
              {/* Render other listing information as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>You do not have any listings.</p>
      )}

      <h2>Bookings</h2>
      {userBookings.length > 0 ? (
        <ul>
          {userBookings.map((booking) => (
            <li key={booking.id}>
              <h3>{booking.name}</h3>
              <p>Date: {booking.date}</p>
              <p>Time: {booking.time}</p>
              <p>Description: {booking.description}</p>
              {/* Render other booking information as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>You do not have any bookings.</p>
      )}

      <h2>Purchases</h2>
      {userPurchases.length > 0 ? (
        <ul>
          {userPurchases.map((purchase) => (
            <li key={purchase._id}>
              <h3>{purchase.service.name}</h3>
              <p>Option: {purchase.option.title}</p>
              <p>Quantity: {purchase.quantity}</p>
              <p>Total: {purchase.total}</p>
              {/* Render other purchase information as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>You do not have any purchases.</p>
      )}
    </div>
  );
};

export default Profile;

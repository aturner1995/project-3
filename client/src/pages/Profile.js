import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import Hero from '../components/Hero';
import Awards from '../components/Awards';
import PopularServices from '../components/PopularServices';
import AppFeatures from '../components/AppFeatures';
import {
  QUERY_USER,
  QUERY_LISTINGS,
  QUERY_BOOKINGS,
  QUERY_PURCHASES,
} from "../utils/queries";

const Profile = () => {
  // const [userData, setUserData] = useState(null);
  // const { loading, data } = useQuery(QUERY_USER);

  // useEffect(() => {
  //   if (data) {
  //     setUserData(data.user);
  //   }
  // }, [data]);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <Hero />
      <h1>DSDSDSDSDFSDF</h1> 
      {/* <h1>Welcome, {userData.username}!</h1> */}
      {/* <p>Email: {userData.email}</p>
      <p>First Name: {userData.firstName}</p>
      <p>Last Name: {userData.lastName}</p> */}
      {/* <Awards />
      <PopularServices />
      <AppFeatures /> */}
    </>
  )
}


export default Profile;
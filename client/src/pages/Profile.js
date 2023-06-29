import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { FaUser, FaList, FaClipboardList, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { BsPersonWorkspace } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import PopularServices from '../components/PopularServices';
import { useMutation } from "@apollo/client";
import {
  QUERY_USER,
  QUERY_USER_SERVICES,
  GET_BOOKINGS,
  QUERY_USER_PURCHASES,
} from "../utils/queries";
import CreateTask from "../components/CreateTask";
import Auth from "../utils/auth";
import TaskForm from "../components/TaskForm";
import { motion } from "framer-motion";
import { Modal, Row, Col } from "react-bootstrap";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DELETE_SERVICE, DELETE_BOOKING } from "../utils/mutations";
import { Toast } from "primereact/toast";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("userInfo");
  const [userProfile, setUserProfile] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const toast = useRef(null);
  const [deleteService] = useMutation(DELETE_SERVICE);
  const [deleteBooking] = useMutation(DELETE_BOOKING);
  const { loading: userLoading, data: userData } = useQuery(QUERY_USER);
  const { loading: listingsLoading, data: listingsData, refetch: refetchListings } = useQuery(QUERY_USER_SERVICES, {
    skip: !userData?.user?._id,
    variables: { userId: userData?.user?._id },
  });
  const { loading: bookingsLoading, data: bookingsData,refetch: refetchBookings } = useQuery(GET_BOOKINGS, {
    skip: !userData?.user?._id,
    variables: { userId: userData?.user?._id },
  });
  const { loading: purchasesLoading, data: purchasesData } = useQuery(QUERY_USER_PURCHASES, {
    skip: !userData?.user?._id,
    variables: { userId: userData?.user?._id },
  });
  useEffect(() => {
    if (userData) {
      setUserProfile(userData?.user);
    }
  }, [userData]);
  useEffect(() => {
    if (listingsData) {
      setUserListings(listingsData?.userServices);
    }
  }, [listingsData]);
  useEffect(() => {
    if (bookingsData) {
      setUserBookings(bookingsData?.bookings);
    }
  }, [bookingsData]);
  useEffect(() => {
    if (purchasesData) {
      setUserPurchases(purchasesData?.userPurchases);
    }
  }, [purchasesData]);
  if (userLoading || listingsLoading || bookingsLoading || purchasesLoading) {
    return <div>Loading...</div>;
  }
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const logoutUser = () => {
    Auth.logout();
    navigate("/login");
  }
  const tabStyles = {
    container: {
      width: "85%",
      margin: "0 auto",
      marginTop: "30px",
    },
    header: {
      backgroundColor: "rgb(220,220,220)",
      height: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    heading: {
      color: "black",
      fontSize: "24px",
    },
    tab: {
      minHeight: "100px",
      padding: "10px 20px",
      backgroundColor: "rgb(150,150,150)",
      color: "white",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    activeTab: {
      backgroundColor: "rgb(110,110,110)",
    },
    contentContainer: {
      marginTop: "40px",
    },
  };
  const handleDeleteListing = (serviceId) => {
    deleteService({
      variables: { serviceId },
    }).then(() => {
      toast.current.show({
        severity: "success",
        summary: "Task Deleted",
        life: 3000,
      });
      refetchListings(); // Refetch listings data after deleting
    });
  };

  const handleDeleteBooking = (bookingId) => {
    deleteBooking({
      variables: { bookingId },
    }).then(() => {
      toast.current.show({
        severity: "success",
        summary: "Booking Deleted",
        life: 3000,
      });
      refetchBookings(); // Refetch bookings data after deleting
    });
  };

  return (
    <div style={tabStyles.container}>
      <div style={tabStyles.header}>
        <h1 style={tabStyles.heading}>Welcome, {userProfile?.username}!</h1>
      </div>
      <Row style={tabStyles.tabsContainer}>
        <Col
          style={activeTab === "userInfo" ? { ...tabStyles.tab, ...tabStyles.activeTab } : tabStyles.tab}
          onClick={() => handleTabClick("userInfo")}
        >
          <FaUser size={24} />
          <span>User</span>
        </Col>
        <Col
          style={activeTab === "listings" ? { ...tabStyles.tab, ...tabStyles.activeTab } : tabStyles.tab}
          onClick={() => handleTabClick("listings")}
        >
          <FaList size={24} />
          <span>Listings</span>
        </Col>
        <Col
          style={activeTab === "bookings" ? { ...tabStyles.tab, ...tabStyles.activeTab } : tabStyles.tab}
          onClick={() => handleTabClick("bookings")}
        >
          <FaClipboardList size={24} />
          <span>Bookings</span>
        </Col>
        <Col
          style={activeTab === "purchases" ? { ...tabStyles.tab, ...tabStyles.activeTab } : tabStyles.tab}
          onClick={() => handleTabClick("purchases")}
        >
          <FaShoppingCart size={24} />
          <span>Purchases</span>
        </Col>
        <Col
          style={activeTab === "postService" ? { ...tabStyles.tab, ...tabStyles.activeTab } : tabStyles.tab}
          onClick={() => {
            setShowTaskForm(true);
            handleTabClick("postService");
          }}
        >
          <BsPersonWorkspace size={24} />
          <span>Post a Task</span>
        </Col>
        <Modal
          as={motion.div}
          size="lg"
          fullscreen="true"
          show={showTaskForm}
          onHide={() => setShowTaskForm(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          dialogClassName="custom-modal"
          className="p-5"
        >
          <TaskForm />
        </Modal>
        <Col
          style={activeTab === "logout" ? { ...tabStyles.tab, ...tabStyles.activeTab } : tabStyles.tab}
          onClick={logoutUser}
        >
          <FaSignOutAlt size={24} />
          <span>Logout</span>
        </Col>
      </Row>
      <div style={tabStyles.contentContainer}>
        {activeTab === "userInfo" && (
          <>
            <h2>User Information</h2>
            <p>Email: {userProfile?.email}</p>
          </>
        )}
        {activeTab === "listings" && (
          <>
            <h2>Listings</h2>
            {userListings.length > 0 ? (
              <div className="p-grid">
                {userListings.map((listing) => (
                  <div key={listing._id} className="p-col-12 p-md-6 p-lg-3">
                    <Card title={listing.name} subTitle={listing.category.name}>
                      <p>Description: {listing.description}</p>
                      <p>Price: {listing.price}</p>
                      <Button
                        label="Delete"
                        icon="pi pi-trash"
                        className="p-button-danger"
                        onClick={() => handleDeleteListing(listing._id)}
                      />
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <p>You do not have any listings.</p>
            )}
          </>
        )}
        {activeTab === "bookings" && (
          <>
            <h2>Bookings</h2>
            {userBookings.length > 0 ? (
              <div className="p-grid">
                {userBookings.map((booking) => (
                  <div key={booking.id} className="p-col-12 p-md-6 p-lg-3">
                    <Card title={booking.name} subTitle={booking.date}>
                      <p>Time: {booking.time}</p>
                      <p>Description: {booking.description}</p>
                      <Button
                        label="Delete"
                        icon="pi pi-trash"
                        className="p-button-danger"
                        onClick={() => handleDeleteBooking(booking._id)}
                      />
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <p>You do not have any bookings.</p>
            )}
          </>
        )}
        {activeTab === "postService" && (
          <div className="text-center">
            <CreateTask />
          </div>
        )}
        <PopularServices />
      </div>
      <Toast ref={toast}></Toast>
    </div>
  );
};
export default Profile;

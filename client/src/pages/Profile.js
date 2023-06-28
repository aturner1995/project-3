import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { FaUser, FaList, FaClipboardList, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { BsPersonWorkspace } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import PopularServices from '../components/PopularServices';
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


const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("userInfo");
  const [userProfile, setUserProfile] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const { loading: userLoading, data: userData } = useQuery(QUERY_USER);
  const { loading: listingsLoading, data: listingsData } = useQuery(QUERY_USER_SERVICES, {
    skip: !userData?.user?._id,
    variables: { userId: userData?.user?._id },
  });
  const { loading: bookingsLoading, data: bookingsData } = useQuery(GET_BOOKINGS, {
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
              <ul>
                {userListings.map((listing) => (
                  <li key={listing._id}>
                    <h3>{listing.name}</h3>
                    <p>Description: {listing.description}</p>
                    <p>Category: {listing.category.name}</p>
                    <p>Price: {listing.price}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You do not have any listings.</p>
            )}
          </>
        )}

        {activeTab === "bookings" && (
          <>
            <h2>Bookings</h2>
            {userBookings.length > 0 ? (
              <ul>
                {userBookings.map((booking) => (
                  <li key={booking.id}>
                    <h3>{booking.name}</h3>
                    <p>Date: {booking.date}</p>
                    <p>Time: {booking.time}</p>
                    <p>Description: {booking.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You do not have any bookings.</p>
            )}
          </>
        )}

        {activeTab === "purchases" && (
          <>
            <h2>Purchases</h2>
            {userPurchases.length > 0 ? (
              <ul>
                {userPurchases.map((purchase) => (
                  <li key={purchase._id}>
                    <h3>{purchase.service.name}</h3>
                    <p>Option: {purchase.option.title}</p>
                    <p>Quantity: {purchase.quantity}</p>
                    <p>Total: {purchase.total}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>You do not have any purchases.</p>
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
    </div>
  );
};

export default Profile;

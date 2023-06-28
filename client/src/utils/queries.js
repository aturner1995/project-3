import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user {
    user {
      _id
      email
      username
    }
  }
`;

export const QUERY_REVERSE_GEOCODE = gql`
  query reverseGeocode($latitude: Float!, $longitude: Float!) {
    reverseGeocode(latitude: $latitude, longitude: $longitude) {
      city
      state
      country
    }
  }
`;

export const QUERY_ALL_SERVICES = gql`
  query services($searchQuery: String, $category: [String], $userSearchAddress: String, $distance: Float) {
    services(searchQuery: $searchQuery, category: $category, userSearchAddress: $userSearchAddress, distance: $distance) {
      _id
      name
      description
      options {
        title
        description
        price
      }
      images {
        url
      }
      category {
        name
      }
    }
  }
`;

export const QUERY_SERVICE = gql`
  query service($id: ID!) {
    service(_id: $id) {
      _id
      name
      description
      category {
        _id
        name
      }
      images {
        _id
        url
      }
      options {
        description
        price
        title
      }
      user {
        _id
        username
        email
      }
      comments {
        _id
        commentText
        createdAt
        user {
          _id
          username
        }
        rating
      }
    }
  }
`;




export const QUERY_CATEGORY = gql`
  query categories {
    categories {
      _id
      name
    }
  }
`
export const GET_CHAT_MESSAGES = gql`
  query {
    chatMessages {
      _id
      participants {
        _id
        username
      }
      messages {
        sender {
          username
          _id
        }
        receiver {
          _id
          username
        }
        message
        timestamp
      }
    }
  }
`;

export const GET_CONVERSATION = gql`
  query conversation($receiverId: ID!) {
    conversation(receiverId: $receiverId) {
      _id
      participants {
        _id
        username
      }
      messages {
        sender {
          username
          _id
        }
        receiver {
          _id
          username
        }
        message
        timestamp
      }
    }
  }
`;

export const GET_BOOKINGS = gql`
  query bookings($userId: ID!) {
    bookings(userId: $userId) {
      _id
      name
      number
      date
      time
      description
      service {
        _id
      }
    }
  }
`;

export const QUERY_CHECKOUT = gql`
  query getCheckout($id: ID!, $price: Float!) {
    checkout(id: $id, price: $price) {
      session
    }
  }
`;

export const QUERY_USER_SERVICES = gql`
  query userServices($userId: ID!) {
    userServices(userId: $userId) {
      _id
      name
      description
      options {
        title
        description
        price
      }
      images {
        url
      }
      category {
        name
      }
    }
  }
`;

export const QUERY_USER_LISTINGS = gql`
  query userListings($userId: ID!) {
    userListings(userId: $userId) {
      _id
      name
      description
      options {
        title
        description
        price
      }
      images {
        url
      }
      category {
        name
      }
    }
  }
`;

export const QUERY_USER_PURCHASES = gql`
  query userPurchases($userId: ID!) {
    userPurchases(userId: $userId) {
      _id
      service {
        name
      }
      option {
        title
      }
      quantity
      total
    }
  }
`;

export const GET_BOOKING_BY_SERVICE_ID = gql`
  query GetBookingByServiceId($serviceId: ID!) {
    bookingByServiceId(serviceId: $serviceId) {
      _id
      name
      number
      date
      time
      description
      service {
        _id
        name
      }
    }
  }
`;

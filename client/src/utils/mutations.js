import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SEND_CHAT_MESSAGE = gql`
  mutation SendChatMessage($receiverId: ID!, $message: String!) {
    sendChatMessage(receiverId: $receiverId, message: $message) {
      _id
      sender {
        username
      }
      receiver {
        username
      }
      message
      timestamp
    }
  }
`;

export const CREATE_BOOKING = gql`
  mutation CreateBooking(
    $name: String!
    $number: String!
    $date: String!
    $time: String!
    $description: String!
    $serviceId: ID!
  ) {
    createBooking(
      name: $name
      number: $number
      date: $date
      time: $time
      description: $description
      serviceId: $serviceId
    ) {
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
export const ADD_COMMENT = gql`
  mutation addComment($serviceId: ID!, $commentText: String!, $userId: ID!, $rating: Int!) {
    addComment(serviceId: $serviceId, commentText: $commentText, userId: $userId, rating: $rating) {
      comments {
        _id
        commentText
        createdAt
        user {
          username
        }
        rating
      }
    }
  }
`;

export const REMOVE_COMMENT = gql`
  mutation removeComment($serviceId: ID!, $commentId: ID!) {
    removeComment(serviceId: $serviceId, commentId: $commentId) {
      comments {
        _id
        commentText
        createdAt
        user {
          username
        }
        rating
      }
    }
  }
`;


export const CREATE_SERVICE = gql`
  mutation CreateService($input: ServiceInput!) {
    createService(input: $input) {
      _id
      name
      description
      images {
        url
      }
      options {
        title
        description
        price
      }
      category {
        _id
      }
      location {
        type
        coordinates
      }
    }
  }
`;


export const DELETE_SERVICE = gql`
  mutation deleteService($serviceId: ID!) {
    deleteService(serviceId: $serviceId) {
      _id
      name
    }
  }
`;
export const DELETE_BOOKING = gql`
  mutation deleteBooking($bookingId: ID!) {
    deleteBooking(bookingId: $bookingId) {
      _id
      name
    }
  }
`;
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
  mutation addComment($serviceId: ID!, $commentText: String!, $userId: ID!) {
    addComment(serviceId: $serviceId, commentText: $commentText, userId: $userId) {
      comments {
        _id
        commentText
        createdAt
        user {
            username
        }
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
      }
    }
  }
`;


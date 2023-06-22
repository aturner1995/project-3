import { gql } from '@apollo/client';

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
  mutation SendChatMessage($senderId: ID!, $receiverId: ID!, $message: String!) {
    sendChatMessage(senderId: $senderId, receiverId: $receiverId, message: $message) {
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
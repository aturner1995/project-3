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
    }
  }
`

export const QUERY_CATEGORY = gql`
  query categories {
    categories {
      _id
      name
    }
  }
`

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($senderId: ID!, $receiverId: ID!) {
    chatMessages(senderId: $senderId, receiverId: $receiverId) {
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
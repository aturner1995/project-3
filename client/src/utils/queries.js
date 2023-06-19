import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
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
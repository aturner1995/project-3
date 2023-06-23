const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
    }
    type Option {
        title: String
        description: String
        price: Float
    }
    type Service {
        _id: ID
        name: String
        description: String
        images: [Image]
        options: [Option]
        category: Category
        user: User
        location: Location
    }
    type Location {
      type: String!
      coordinates: [Float]!
    }    
    type Category {
        _id: ID
        name: String
    }
    type Image {
        _id: ID
        url: String
    }
    type ReverseGeocode {
        city: String
        state: String
        country: String
    }
    type Geocode {
        latitude: Float
        longitude: Float
    }
    type Auth {
        token: ID!
        user: User
    }
    type Booking {
        id: ID!
        name: String!
        number: String!
        date: String!
        time: String!
        description: String!
        service: Service!
      }
    type Query {
        user: User
        reverseGeocode(latitude: Float!, longitude: Float!): ReverseGeocode
        services(searchQuery: String, category: [String], userSearchAddress:String, distance: Float): [Service]
        service(_id: ID!): Service
        categories: [Category]

    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        createService(input: ServiceInput): Service
        updateService(_id: ID!, input: ServiceInput): Service
        deleteService(_id: ID!): Service
    }
    type Mutation {
        createBooking(
          name: String!
          number: String!
          date: String!
          time: String!
          description: String!
          serviceId: ID!
        ): Booking!
      }
      

    input ServiceInput {
        name: String!
        description: String
        categoryId: ID
        options: [OptionInput]
        images: [ImageInput]
        location: LocationInput
    }

    input LocationInput {
        type: String!
        coordinates: [Float]!
    }
    
    input OptionInput {
        title: String!
        description: String
        price: Float!
    }
    
    input ImageInput {
        url: String!
    }
`

module.exports = typeDefs;
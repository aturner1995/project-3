const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
    }
    type Chat {
        _id: ID
        sender: User
        receiver: User
        message: String
        timestamp: String
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
    type Auth {
        token: ID!
        user: User
    }
    type Query {
        user: User
        reverseGeocode(latitude: Float!, longitude: Float!): ReverseGeocode
        services(searchQuery: String, category: [String], userSearchAddress:String, distance: Float): [Service]
        service(_id: ID!): Service
        categories: [Category]
        chatMessages(senderId: ID!, receiverId: ID!): [Chat]

    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        createService(input: ServiceInput): Service
        updateService(_id: ID!, input: ServiceInput): Service
        deleteService(_id: ID!): Service
        sendChatMessage(senderId: ID!, receiverId: ID!, message: String): [Chat]
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
const { gql } = require("apollo-server-express");

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
        conversationId: Conversation
    }
    type Conversation {
        _id: ID
        participants: [User]
        messages: [Chat]
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
        comments: [Comment!]!
    }
    type Comment {
        _id: ID
        commentText: String
        createdAt: String
        user: User
        rating: Int
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
    type Booking {
        _id: ID!
        name: String!
        number: String!
        date: String!
        time: String!
        description: String!
        service: Service!
    }
    type Checkout {
        session: ID
    }
    type Purchase {
        _id: ID!
        user: User!
        service: Service!
        option: Option!
        quantity: Int!
        total: Float!
        date: String!
        status: String!
    }
    
    type Query {
        user: User
        reverseGeocode(latitude: Float!, longitude: Float!): ReverseGeocode
        services(searchQuery: String, category: [String], userSearchAddress:String, distance: Float): [Service]
        service(_id: ID!): Service
        categories: [Category]
        chatMessages: [Conversation]
        checkout(id: ID!, price: Float): Checkout
        conversation(receiverId: ID!): [Conversation]
        bookingByServiceId(serviceId: ID!): [Booking]
        userServices(userId: ID!): [Service]
        bookings(userId: ID!): [Booking]
        userPurchases(userId: ID!): [Purchase]
    }
    
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        createService(input: ServiceInput): Service
        updateService(_id: ID!, input: ServiceInput): Service
        sendChatMessage(receiverId: ID!, message: String): Chat
        addComment(serviceId: ID!, commentText: String!, userId: ID!, rating: Int!): Service    
        removeComment(serviceId: ID!, commentId: ID!): Service
        createBooking(name: String!, number: String!, date: String!, time: String!, description: String!, serviceId: ID!): Booking!
        deleteService(serviceId: ID!): Service
        deleteBooking(bookingId: ID!): Booking
    }
    
    input ServiceInput {
        name: String!
        description: String
        categoryId: ID
        options: [OptionInput]
        images: [ImageInput]
        location: LocationInput!
    }
    
    input LocationInput {
        address: String!
    }
    
    input OptionInput {
        title: String!
        description: String
        price: Float!
    }
    
    input ImageInput {
        url: String!
    }


`;





module.exports = typeDefs;

const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
require('dotenv').config({ debug: true })
const signToken = require('../utils/auth').signToken;


const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        reverseGeocode: async (parent, { latitude, longitude }, context) => {
            try {
                const response = await fetch(
                    `https://api.opencagedata.com/geocode/v1/json?key=${process.env.OpenCage_API_KEY}&q=${latitude}+${longitude}&pretty=1`
                );
                const data = await response.json();
                if (data.results.length > 0) {
                    const { city, state, country } = data.results[0].components;
                    return { city, state: state.split('/')[0].trim(), country };
                }
            } catch (err) {
                console.error('Error fetching geocoding data:', err);
            }
        }
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
    }
}

module.exports = resolvers;
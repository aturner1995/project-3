const { AuthenticationError } = require('apollo-server-express');
const { User, Service, Category } = require('../models');
require('dotenv').config({ debug: true })
const signToken = require('../utils/auth').signToken;


const resolvers = {
    Query: {
        user: async (parent, args, context) => {
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
                throw new Error('Error fetching geocoding data');
            }
        },
        services: async (parent, { searchQuery, category }) => {
            try {
                const params = {};

                if (searchQuery) {
                    const searchRegex = new RegExp(searchQuery, 'i');
                    params.$or = [
                        { name: { $regex: searchRegex } },
                        { description: { $regex: searchRegex } }
                    ];
                }

                if (category.length) {
                    // Convert category name to ObjectId before querying
                    const categoryIds = await Category.find({ name: { $in: category } }).distinct('_id');
                    params.category = { $in: categoryIds };
                }

                const services = await Service.find(params)
                    .populate('category')
                    .populate('images');

                return services;
            } catch (err) {
                throw new Error('Failed to fetch services');
            }
        },
        service: async (parent, { _id }) => {
            try {
                const service = await Service.findById(_id).populate('category');
                return service;
            }
            catch (err) {
                throw new Error('Failed to fetch services');
            }
        },
        categories: async () => {
            try {
                const categories = await Category.find();
                return categories;
            }
            catch (err) {
                throw new Error('Failed to fetch categories');
            }
        },
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
        createService: async (parent, { input }) => {
            try {
                const service = new Service({
                    name: input.name,
                    description: input.description,
                    category: input.categoryId,
                    options: input.options,
                    images: input.images,
                });
                const savedService = await service.save();
                return savedService;
            } catch (error) {
                throw new Error('Failed to create service');
            }
        },
        updateService: async (parent, { _id, input }) => {
            try {
                const service = await Service.findByIdAndUpdate(_id, input, { new: true });
                return service;
            } catch (error) {
                throw new Error('Failed to update service');
            }
        },
        deleteService: async (parent, { id }) => {
            try {
                const deletedService = await Service.findByIdAndDelete(id);
                return deletedService;
            } catch (error) {
                throw new Error('Failed to delete service');
            }
        },
    }
}

module.exports = resolvers;
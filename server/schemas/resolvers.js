const { AuthenticationError } = require('apollo-server-express');
const { User, Service, Category, Conversation, Chat, Booking, Purchase } = require('../models');
require('dotenv').config({ debug: true })
const signToken = require('../utils/auth').signToken;
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

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
                console.error(error)
                throw new Error('Error fetching geocoding data');
            }
        },
        services: async (parent, { searchQuery, category, userSearchAddress, distance }) => {
            try {
                if (!distance) {
                    distance = 100;
                }
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

                if (userSearchAddress.length) {
                    try {
                        const encodedAddress = encodeURIComponent(userSearchAddress);
                        const response = await fetch(
                            `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${process.env.OpenCage_API_KEY}&pretty=1`
                        );
                        const data = await response.json();

                        if (data.results.length > 0) {
                            const { geometry } = data.results[0];
                            const { lat, lng } = geometry;
                            params.location = {
                                $near: {
                                    $geometry: {
                                        type: 'Point',
                                        coordinates: [lat, lng],
                                    },
                                    $maxDistance: distance * 1000, // Convert km to meters
                                },
                            };
                        }
                    } catch (err) {
                        console.error('Error fetching geocoding data:', err);
                        throw new Error('Error fetching geocoding data');
                    }
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
                const service = await Service.findById(_id)
                    .populate('category')
                    .populate('images')
                    .populate('options')
                    .populate({
                        path: 'user',
                        select: '_id username email',
                    })
                    .populate({
                        path: 'comments',
                        populate: {
                            path: 'user',
                            select: '_id username',
                        },
                    });

                if (!service) {
                    throw new Error('Service not found');
                }

                return service;
            } catch (error) {
                throw new Error('Failed to fetch service');
            }
        },
        userServices: async (parent, { userId }) => {
            try {
                const service = await Service.find({
                    user: userId
                });

                if (!service) {
                    throw new Error('No Services found');
                }

                return service;
            } catch (error) {
                throw new Error('Failed to fetch service');
            }
        },
        bookings: async (parent, { userId }) => {
            try {
                const booking = await Booking.find({
                    user: userId
                })

                if (!booking) {
                    throw new Error('No Bookings found');
                }

                return booking;
            } catch (error) {
                throw new Error('Failed to fetch service');
            }
        },
        userPurchases: async (parent, { userId }) => {
            try {
                const purchase = await Purchase.find({
                    user: userId
                })

                if (!purchase) {
                    throw new Error('No Purchases found');
                }

                return purchase;
            } catch (error) {
                throw new Error('Failed to fetch service');
            }
        },
        categories: async (parent, args, context) => {
            try {
                const categories = await Category.find();
                return categories;
            }
            catch (err) {
                throw new Error('Failed to fetch categories');
            }
        },
        chatMessages: async (parent, args, context) => {
            try {
                const senderId = context?.user?._id;
                if (!senderId) {
                    return;
                }
                const conversations = await Conversation.find({
                    participants: senderId // Filter conversations where the senderId is one of the participants
                }).populate({
                    path: 'messages',
                    populate: [
                        { path: 'sender', select: 'username' },
                        { path: 'receiver', select: 'username' }
                    ]
                }).populate('participants', 'username');

                return conversations;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch chat messages.');
            }
        },
        checkout: async (parent, { id, price }, context) => {
            const url = new URL(context.headers.referer).origin;

            try {
                const service = await Service.findById(id).populate('options');

                const product = await stripe.products.create({
                    name: service.name,
                    description: service.description,
                });

                const lineItems = service.options
                    .filter((option) => option.price === price)
                    .map((option) => ({
                        price_data: {
                            currency: 'cad',
                            product: product.id,
                            unit_amount: option.price * 100,
                        },
                        quantity: 1,
                    }));

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: lineItems,
                    mode: 'payment',
                    success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${url}/`,
                });

                return { session: session.id };
            } catch (error) {
                console.error('Error during checkout:', error);
                throw new Error('An error occurred during checkout.');
            }
        },
        conversation: async (parent, { receiverId }, context) => {
            try {
                const senderId = context?.user?._id;
                const conversations = await Conversation.find({
                    participants: [senderId, receiverId] // Filter conversations for the seller and the logged in user
                }).populate({
                    path: 'messages',
                    populate: [
                        { path: 'sender', select: 'username' },
                        { path: 'receiver', select: 'username' }
                    ]
                }).populate('participants', 'username');

                return conversations;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch chat messages.');
            }
        },
        bookingByServiceId: async (parent, { serviceId }) => {
            try {
                const bookings = await Booking.find({ service: serviceId });
                return bookings;
            } catch (error) {
                console.error(error);
                throw new Error('Failed to fetch bookings by service ID');
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
        createService: async (parent, { input }, context) => {
            try {
                const encodedAddress = encodeURIComponent(input.location.address);
                const response = await fetch(
                    `https://api.opencagedata.com/geocode/v1/json?q=${encodedAddress}&key=${process.env.OpenCage_API_KEY}&pretty=1`
                );
                const data = await response.json();


                const { geometry } = data.results[0];
                const { lat, lng } = geometry;

                const service = new Service({
                    name: input.name,
                    description: input.description,
                    category: input.categoryId,
                    options: input.options,
                    images: input.images,
                    location: {
                        type: 'Point',
                        coordinates: [lat, lng],
                        address: input.location.address,
                    },
                    user: context.user._id,
                });

                const savedService = await service.save();
                return savedService;
            } catch (error) {
                console.error(error)
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
        deleteService: async (parent, { _id }) => {
            try {
                const deletedService = await Service.findByIdAndDelete(_id);
                return deletedService;
            } catch (error) {
                throw new Error('Failed to delete service');
            }
        },
        addComment: async (parent, { serviceId, commentText, userId, rating }) => {
            const comment = {
              commentText,
              user: userId,
              rating,
            };
          
            return Service.findOneAndUpdate(
              { _id: serviceId },
              { $addToSet: { comments: comment } },
              { new: true, runValidators: true }
            );
          },
          
          removeComment: async (parent, { serviceId, commentId }) => {
            return Service.findOneAndUpdate(
              { _id: serviceId },
              { $pull: { comments: { _id: commentId } } },
              { new: true }
            );
          },
          

        sendChatMessage: async (parent, { receiverId, message }, context) => {
            try {
                let conversationId;
                const senderId = context.user._id;

                // Check if a conversation already exists between the sender and receiver
                const existingConversation = await Conversation.findOne({
                    participants: {
                        $all: [senderId, receiverId]
                    }
                });

                if (existingConversation) {
                    conversationId = existingConversation._id;
                } else {
                    // If conversation doesn't exist, create a new conversation
                    const newConversation = new Conversation({
                        participants: [senderId, receiverId]
                    });

                    const savedConversation = await newConversation.save();
                    conversationId = savedConversation._id;
                }

                const chat = new Chat({
                    sender: senderId,
                    conversationId: conversationId,
                    receiver: receiverId,
                    message
                })

                const savedChat = await chat.save();
                // Update sender's and receiver's chats arrays
                await User.updateMany(
                    { _id: { $in: [context.user._id, receiverId] } },
                    { $push: { chats: savedChat._id } }
                );

                await Conversation.findByIdAndUpdate(conversationId, {
                    $push: { messages: savedChat._id },
                    updatedAt: Date.now(),
                });

                return savedChat;
            }
            catch (error) {
                console.error(error);
                throw new Error('Failed to send chat message');
            }
        },
        createBooking: async (_, { name, number, date, time, description, serviceId }, context) => {
            try {
                const service = await Service.findById(serviceId);
                if (!service) {
                    throw new Error('Service not found');
                }

                const booking = await Booking.create({
                    name,
                    number,
                    date,
                    time,
                    description,
                    service: serviceId,
                    user: context.user._id
                });

                return booking;
            } catch (error) {
                console.error(error);
                throw new Error('Booking failed');
            }
        },

        deleteService: async (_, { serviceId }, context) => {
            if (!context.user) {
              throw new AuthenticationError('You must be logged in to delete a service');
            }
     
            try {
     
              const service = await Service.findById(serviceId);
              if (!service) {
                throw new Error('Service not found');
              }
     
 
              if (service.userId !== context.user.id) {
                throw new AuthenticationError('You are not authorized to delete this service');
              }
     
   
              await Service.findByIdAndDelete(serviceId);
     
              return service;
            } catch (error) {
              throw new Error('Failed to delete service');
            }
          },
     
          deleteBooking: async (_, { bookingId }, context) => {
            if (!context.user) {
              throw new AuthenticationError('You must be logged in to delete a booking');
            }
     
            try {
              const booking = await Booking.findById(bookingId);
     
      
              if (!booking) {
                throw new Error('Booking not found');
              }
     
         
              await Booking.findByIdAndDelete(bookingId);
     
              return booking;
            } catch (error) {
              throw new Error('Failed to delete booking');
            }
          },
    }
}


module.exports = resolvers;
const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const optionSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0.99,
  },
});

const imageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
});

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    options: [optionSchema],
    images: [imageSchema],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    comments: [
      {
        commentText: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 280,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          get: (timestamp) => dateFormat(timestamp),
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Index the location field for geospatial queries
serviceSchema.index({ location: '2dsphere' });

const Service = model('Service', serviceSchema);

module.exports = Service;

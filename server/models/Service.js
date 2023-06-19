const { Schema, model } = require('mongoose');

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

const serviceSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        options: [optionSchema],
    },
    // set this to use virtual below
    {
        toJSON: {
            virtuals: true,
        },
    }
);


const Service = model('Service', serviceSchema);

module.exports = Service;
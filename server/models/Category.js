const { Schema, model } = require('mongoose');

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        }
    },
    // set this to use virtual below
    {
        toJSON: {
            virtuals: true,
        },
    }
);


const Category = model('Service', categorySchema);

module.exports = Category;
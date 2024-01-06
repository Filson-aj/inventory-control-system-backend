const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Category = new Schema({
        categoryid: {
            type: String,
            required: [true, `Category must have a category id`],
            unique: [true, 'Category must be unique'],
        },
        name: {
            type: String, 
            unique: {
                value: true,
                message: 'The product name: {VALUE} already exist '
            },
            required: {
                value: true,
                message: 'Product name is required'
            },
        },
        price: {
            type: Number,
            required: [true, 'Price is required!'],
        },
        quantity: {
            type: Number,
            default: 0,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
            required: [true, 'A product must have an image'],
        },
    }, {timestamps: true});

module.exports = mongoose.model('Category', Category);
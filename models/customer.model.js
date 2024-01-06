const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CustomTypes = mongoose.SchemaTypes,
    Customer = new Schema({
        customerid: {
            type: String,
            required: [true, `Customer must have a customer id`],
            unique: [true, 'Customer must be unique'],
        },
        name: {
            firstname: {type: String},
            surname: {type: String},
            othername: {type: String},
        },
        gender: {
            type: String,
            enum: {
                values: ['Male', 'Female'],
                message: '{VALUE} is not a supported gender',
            },
            default: 'Male',
        },
        contact: {
            address: {type: String},
            phone: {type: String},
        },
        user: {
            type: CustomTypes.ObjectId,
            ref: 'User',
            required: [true, 'Customer must have a user account'],
        },
    })

module.exports = mongoose.model('Customer', Customer)
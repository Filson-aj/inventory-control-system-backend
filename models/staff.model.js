const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CustomTypes = mongoose.SchemaTypes,
    Staff = new Schema({
        staffid: {
            type: String,
            required: [true, `Staff must have a staff id`],
            unique: [true, 'Staff must be unique'],
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
            required: [true, 'Staff must have a user account'],
        },
    })

module.exports = mongoose.model('Staff', Staff)
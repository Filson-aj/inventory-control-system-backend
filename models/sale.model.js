const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CustomTypes = mongoose.SchemaTypes,
    Sale = new Schema({
        saleid: {
            type: String,
            required: [true, `Sale must have an id`],
            unique: [true, 'Sale must be unique'],
        },
        staff: {
            type: CustomTypes.ObjectId,
            ref: 'Staff',
            required: [true, 'Sale must be by a staff'],
        },
        customer: {
            type: CustomTypes.ObjectId,
            ref: 'Customer',
            required: [true, 'Sale must be to a customer'],
        },
        order: {
            type: CustomTypes.ObjectId,
            ref: 'Order',
            required: [true, 'Sale must be for an order'],
        },
        saledate: {
            type: Date,
            default: Date.now()
        },
    })

module.exports = mongoose.model('Sale', Sale)
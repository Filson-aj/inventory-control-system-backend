const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CustomTypes = mongoose.SchemaTypes,
    Order = new Schema({
        orderid: {
            type: String,
            required: [true, `Order must have a order id`],
            unique: [true, 'Order must be unique'],
        },
        customer: {
            type: CustomTypes.ObjectId,
            ref: 'Customer',
            required: [true, 'Order must be by a customer'],
        },
        items: {
            type: [{
                product: {
                    type: CustomTypes.ObjectId,
                    ref: 'Product',
                    required: [true, 'order item must be a product']
                }, //45000 64000 19314.80 
                quantity: {
                    type: Number,
                    required: [true, 'order item must have quanity']
                },
                priceperunit: {
                    type: Number,
                    required: [true, 'product price is required']
                }
            }],
            required: [true, 'An order must have items']
        },
        orderdate: {
            type: Date,
            default: Date.now()
        },
        status: {
            type: String,
            default: 'Pending'
        },
        price: {
            type: Number,
            default: 0
        }
    })

module.exports = mongoose.model('Order', Order)
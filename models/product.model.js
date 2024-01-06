const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    CustomTypes = mongoose.SchemaTypes,
    Product = new Schema({
        productid: {
            type: String,
            required: [true, `Product must have a product id`],
            unique: [true, 'Product must be unique'],
        },
        manufacturedate: {
            type: Date,
            required: [true, 'Product must have a manufacturing date']
        },
        expiredate: {
            type: Date,
            required: [true, 'Product must have a expering date']
        },
        category: {
            type: CustomTypes.ObjectId,
            ref: 'Category',
            required: [true, 'Product must have a category'],
        },
    })

module.exports = mongoose.model('Product', Product)
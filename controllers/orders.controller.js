const Order = require('../models/order.model'),
    utilities = require('../helpers/utilities.helper'),
    moment = require('moment')

// @desc Get single order
// @route GET /orders/:id
// @access Private
const index = async(req, res) =>{
    if(!req.params.id) return res.status(400).json({ message: `Please provide order's ID`, data: []}) 
    
    //get order's records
    const order = await Order.findById(req.params.id)
        .populate('customer', 'name contact')
        .populate({
            path: 'items.product',
            populate: {
                path: 'category',
                select: 'name price image'
            }
        }).lean().exec()

    if(!order) return res.status(400).json({ message: `There are no order's records found`, data: []})

    res.json({ message: `Order's record retrieved successfully`, data: order })
}

// @desc Get all orders
// @route GET /orders
// @access Private
const show = async(req, res) =>{
    const orders = await Order.find()
    .populate('customer', 'name contact')
    .populate({
        path: 'items.product',
        populate: {
            path: 'category',
            select: 'name price image'
        }
    }).lean().exec()

    if(!orders?.length) return res.status(400).json({ message: `There are no orders' record found!`})

    res.json({ message: `Orders' records retrieved successfully`, data: orders })
}

// @desc create new order
// @route POST /orders
// @access Private
const create = async(req, res) =>{
    const { customer, items, orderdate } = req.body

    //confirm data
    if(!items || !customer) return res.status(400).json({ message: 'All Fields are required', data: [] })

    let orderid = '', duplicate = false
    while(!orderid || duplicate){
        orderid = `ORD/${moment(Date.now()).format('YYYY')}/${moment(Date.now()).format('M')}/${utilities.uniqueNumber(4)}`
        duplicate = await Order.findOne({ orderid }).collation({ locale: 'en', strength: 2}).exec()
    }

    let price = 0
    items.forEach(item => {
        price = price + (item.quantity * item.priceperunit)
    })

    //create and store new order
    const order = await Order.create({ orderid, customer, items, orderdate, price })
    if(order){//order created
       return res.status(201).json({ message: `New order records has been created successfully`, data: order })
    }
    res.status(400).json({ message: 'Invalid order data provided', data: [] })
}

// @desc update a order
// @route PATCH /orders
// @access Private
const update = async(req, res) =>{
    const { id, items, status } = req.body

    //confirm data
    if(!id || !items || !status) return res.status(400).json({ message: 'All Fields are required', data: [] }) 

    //confirm order
    const order = await Order.findById(id).exec()
    if(!order) return res.status(400).json({ message: `Order's record was not found`, data: [] })

    let price = 0
    items.forEach(item => {
        price = price + (item.quantity * item.priceperunit)
    })
    order.items = items
    order.status = status
    order.price = price
    order.updatedAt = Date.now()
    await order.save()
    
    res.json({ message: `Order's records have been updated successfully`, data: order })
}

// @desc delete a order
// @route DELETE /orders/:id
// @access Private
const deleteOne = async(req, res) =>{
    const { id } = req.params

    //confirm data
    if(!id) return res.status(400).json({ message: `Provide order's id`, data: [] })

    //confirm order
    const order = await Order.findById(id).exec()
    if(!order) return res.status(400).json({ message: `Order records not found`, data: [] })

    await order.deleteOne()

    res.json({ message: `Order's records has been deleted successfully`, data: [] })
}

// @desc delete all orders
// @route DELETE /orders
// @access Private
const deleteAll = async(req, res) =>{
    await Order.deleteMany()

    res.json({ message: `Orders' records has been deleted successfully`, data: [] })
}

module.exports = {
    index,
    show,
    create,
    update,
    deleteOne,
    deleteAll
}
const Customer = require('../models/customer.model'),
    utilities = require('../helpers/utilities.helper'),
    moment = require('moment')

// @desc Get single customer
// @route GET /customers/:id
// @access Private
const index = async(req, res) =>{
    if(!req.params.id) return res.status(400).json({ message: `Please provide customer's ID`, data: []}) 
    
    //get customer's records
    const customer = await Customer.findById(req.params.id).populate('user', 'email roles').lean().exec()

    if(!customer) return res.status(400).json({ message: `There are no customer's records found`, data: []})

    res.json({ message: `Customer's record retrieved successfully`, data: customer })
}

// @desc Get all customers
// @route GET /customers
// @access Private
const show = async(req, res) =>{
    const customers = await Customer.find().populate('user', 'email roles').lean().exec()

    if(!customers?.length) return res.status(400).json({ message: `There are no customers' record found!`})

    res.json({ message: `Customers' records retrieved successfully`, data: customers })
}

// @desc create new customer
// @route POST /customers
// @access Private
const create = async(req, res) =>{
    const { name, gender, contact, user } = req.body

    //confirm data
    if(!gender || !user) return res.status(400).json({ message: 'All Fields are required', data: [] })

    let customerid = '', duplicate = false
    while(!customerid || duplicate){
        customerid =  `CUS/${moment(Date.now()).format('YYYY')}/${moment(Date.now()).format('M')}/${utilities.uniqueNumber(4)}`
        duplicate = await Customer.findOne({ customerid }).collation({ locale: 'en', strength: 2}).exec()
    }

    //create and store new customer
    const customer = await Customer.create({ customerid, name, gender, contact, user })
    if(customer){//customer created
       return res.status(201).json({ message: `New customer records has been created successfully`, data: customer })
    }
    res.status(400).json({ message: 'Invalid customer data provided', data: [] })
}

// @desc update a customer
// @route PATCH /customers
// @access Private
const update = async(req, res) =>{
    const { id, name, gender, contact } = req.body

    //confirm data
    if(!id || !gender) return res.status(400).json({ message: 'All Fields are required', data: [] }) 

    //confirm customer
    const customer = await Customer.findById(id).exec()
    if(!customer) return res.status(400).json({ message: `Customer's record was not found`, data: [] })

    customer.name = name
    customer.gender = gender
    customer.contact = contact
    customer.updatedAt = Date.now()
    await customer.save()
    
    res.json({ message: `Customer's records have been updated successfully`, data: customer })
}

// @desc delete a customer
// @route DELETE /customers/:id
// @access Private
const deleteOne = async(req, res) =>{
    const { id } = req.params

    //confirm data
    if(!id) return res.status(400).json({ message: `Provide customer's id`, data: [] })

    //confirm customer
    const customer = await Customer.findById(id).exec()
    if(!customer) return res.status(400).json({ message: `Customer records not found`, data: [] })

    await customer.deleteOne()

    res.json({ message: `Customer's records has been deleted successfully`, data: [] })
}

// @desc delete all customers
// @route DELETE /customers
// @access Private
const deleteAll = async(req, res) =>{
    await Customer.deleteMany()

    res.json({ message: `Customers' records has been deleted successfully`, data: [] })
}

module.exports = {
    index,
    show,
    create,
    update,
    deleteOne,
    deleteAll
}
const Sale = require('../models/sale.model'),
    utilities = require('../helpers/utilities.helper'),
    moment = require('moment')

// @desc Get single sale
// @route GET /sales/:id
// @access Private
const index = async(req, res) =>{
    if(!req.params.id) return res.status(400).json({ message: `Please provide sale's ID`, data: []}) 
    
    //get sale's records
    const sale = await Sale.findById(req.params.id)
        .populate('staff', 'name contact')
        .populate('customer', 'name contact')
        .populate('order', 'items orderdate status price').lean().exec()

    if(!sale) return res.status(400).json({ message: `There are no sale's records found`, data: []})

    res.json({ message: `Sale's record retrieved successfully`, data: sale })
}

// @desc Get all sales
// @route GET /sales
// @access Private
const show = async(req, res) =>{
    const sales = await Sale.find()
    .populate('staff', 'name contact')
    .populate('customer', 'name contact')
    .populate('order', 'items orderdate status price').lean().exec()

    if(!sales?.length) return res.status(400).json({ message: `There are no sales' record found!`})

    res.json({ message: `Sales' records retrieved successfully`, data: sales })
}

// @desc create new sale
// @route POST /sales
// @access Private
const create = async(req, res) =>{
    const { staff, customer, order, saledate } = req.body

    //confirm data
    if(!staff || !order || !customer) return res.status(400).json({ message: 'All Fields are required', data: [] })

    let saleid = '', duplicate = false
    while(!saleid || duplicate){
        saleid = `SAL/${moment(Date.now()).format('YYYY')}/${moment(Date.now()).format('M')}/${utilities.uniqueNumber(4)}`
        duplicate = await Sale.findOne({ saleid }).collation({ locale: 'en', strength: 2}).exec()
    }

    //create and store new sale
    const sale = await Sale.create({ saleid, staff, customer, order, saledate })
    if(sale){//sale created
       return res.status(201).json({ message: `New sale records has been created successfully`, data: sale })
    }
    res.status(400).json({ message: 'Invalid sale data provided', data: [] })
}

// @desc update a sale
// @route PATCH /sales
// @access Private
const update = async(req, res) =>{
    const { id, saledate } = req.body

    //confirm data
    if(!saledate) return res.status(400).json({ message: 'All Fields are required', data: [] }) 

    //confirm sale
    const sale = await Sale.findById(id).exec()
    if(!sale) return res.status(400).json({ message: `Sale's record was not found`, data: [] })

    sale.saledate = saledate
    sale.updatedAt = Date.now()
    await sale.save()
    
    res.json({ message: `Sale's records have been updated successfully`, data: sale })
}

// @desc delete a sale
// @route DELETE /sales/:id
// @access Private
const deleteOne = async(req, res) =>{
    const { id } = req.params

    //confirm data
    if(!id) return res.status(400).json({ message: `Provide sale's id`, data: [] })

    //confirm sale
    const sale = await Sale.findById(id).exec()
    if(!sale) return res.status(400).json({ message: `Sale records not found`, data: [] })

    await sale.deleteOne()

    res.json({ message: `Sale's records has been deleted successfully`, data: [] })
}

// @desc delete all sales
// @route DELETE /sales
// @access Private
const deleteAll = async(req, res) =>{
    await Sale.deleteMany()

    res.json({ message: `Sales' records has been deleted successfully`, data: [] })
}

module.exports = {
    index,
    show,
    create,
    update,
    deleteOne,
    deleteAll
}
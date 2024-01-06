const Product = require('../models/product.model'),
    Category = require('../models/category.model'),
    utilities = require('../helpers/utilities.helper'),
    moment = require('moment')

// @desc Get single product
// @route GET /products/:id
// @access Private
const index = async(req, res) =>{
    if(!req.params.id) return res.status(400).json({ message: `Please provide product's ID`, data: []}) 
    
    //get product's records
    const product = await Product.findById(req.params.id).populate('category', 'name price image').lean().exec()

    if(!product) return res.status(400).json({ message: `There are no product data found`, data: []})

    res.json({ message: `Product data retrieved successfully`, data: product })
}

// @desc Get all products
// @route GET /products
// @access Private
const show = async(req, res) =>{
    const products = await Product.find().populate('category', 'name price image').lean().exec()

    if(!products?.length) return res.status(400).json({ message: `There are no product data found!`})

    res.json({ message: `Product data retrieved successfully`, data: products })
}

// @desc create new product
// @route POST /products
// @access Private
const create = async(req, res) =>{
    const { manufacturedate, expiredate, category } = req.body


    //confirm data
    if(!manufacturedate || !expiredate || !category) return res.status(400).json({ message: 'All Fields are required', data: [] })

    let productid = '', duplicate = false
    while(!productid || duplicate){
        productid = `PRO/${moment(Date.now()).format('YYYY')}/${moment(Date.now()).format('M')}/${utilities.uniqueNumber(4)}`
        duplicate = await Product.findOne({ productid }).collation({ locale: 'en', strength: 2}).exec()
    }

    //create and store new product
    const product = await Product.create({ productid, manufacturedate, expiredate, category })
    if(product){//product created
        const cat = await Category.findById(category).exec()
        if(cat){
            cat.quantity = cat.quantity + 1
            await cat.save()
            return res.status(201).json({ message: `New product data has been created successfully`, data: product })
        }else{
            return res.status(201).json({ message: `New product data has been created successfully`, data: product })
        }
    }
    res.status(400).json({ message: 'Invalid product data provided', data: [] })
}

// @desc update a product
// @route PATCH /products
// @access Private
const update = async(req, res) =>{
    const { id, manufacturedate, expiredate, category } = req.body

    //confirm data
    if(!id || !manufacturedate || !expiredate || !category) return res.status(400).json({ message: 'All Fields are required', data: []}) 

    //confirm product
    const product = await Product.findById(id).exec()
    if(!product) return res.status(400).json({ message: `Product record was not found`, data: [] })
    
    product.manufacturedate = manufacturedate
    product.expiredate = expiredate
    product.category = category
    product.updatedAt = Date.now()
    await product.save()
    
    res.json({ message: `Product record have been updated successfully`, data: product })
}

// @desc delete a product Record
// @route DELETE /product/:id
// @access Private
const deleteOne = async(req, res) =>{
    const { id } = req.params

    //confirm data
    if(!id) return res.status(400).json({ message: `Provide product id`, data: [] })

    //confirm product
    const product = await Product.findById(id).exec()
    if(!product) return res.status(400).json({ message: `Product records not found`, data: [] })

    const category = product.category

    await product.deleteOne()

    const cat = await Category.findById(category).lean().exec()
    if(cat){
        cat.quantity = cat.quantity - 1
        await cat.save()
        res.json({ message: `Product record has been deleted successfully`, data: [] })
    }else{
        res.json({ message: `Product record has been deleted successfully`, data: [] })
    }
}

// @desc delete all product Record
// @route DELETE /products
// @access Private
const deleteAll = async(req, res) =>{
    await Product.deleteMany()

    res.json({ message: `Product records have been deleted successfully`, data: [] })
}

module.exports = {
    index,
    show,
    create,
    update,
    deleteOne,
    deleteAll
}
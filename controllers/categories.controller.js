const Category = require('../models/category.model'),
    utilities = require('../helpers/utilities.helper'),
    moment = require('moment')

// @desc Get single category
// @route GET /categorys/:id
// @access Private
const index = async(req, res) =>{
    if(!req.params.id) return res.status(400).json({ message: `Please provide category's ID`, data: []}) 
    
    //get category's records
    const category = await Category.findById(req.params.id).lean().exec()

    if(!category) return res.status(400).json({ message: `There are no category data found`, data: []})

    res.json({ message: `Category data retrieved successfully`, data: category })
}

// @desc Get all categorys
// @route GET /categorys
// @access Private
const show = async(req, res) =>{
    const categorys = await Category.find().lean().exec()

    if(!categorys?.length) return res.status(400).json({ message: `There are no category data found!`})

    res.json({ message: `Category data retrieved successfully`, data: categorys })
}

// @desc create new category
// @route POST /categorys
// @access Private
const create = async(req, res) =>{
    const { name, price, quantity, description } = req.body

    //confirm data
    if(!name || !price) return res.status(400).json({ message: 'All Fields are required', data: [] })

    //check for duplicate
    const duplicate = await Category.findOne({ name }).collation({ locale: 'en', strength: 2}).exec()
    if(duplicate) return res.status(409).json({ message: `Category already exist`, data: [] })

    const image = req?.files?.image,
        imagepath = `${global?.images}/${image?.name}`

    //move the image to the upload folder 
    image?.mv(imagepath)

    let categoryid = '', duplicateid = false
    while(!categoryid || duplicateid){
        categoryid = `CAT/${moment(Date.now()).format('YYYY')}/${moment(Date.now()).format('M')}/${utilities.uniqueNumber(4)}`
        duplicateid = await Category.findOne({ categoryid }).collation({ locale: 'en', strength: 2}).exec()
    }
    
    //create and store new category
    const category = await Category.create({ categoryid, name, price, quantity, description, image: image?.name })
    if(category){//category created
       return res.status(201).json({ message: `New category data has been created successfully`, data: category })
    }
    res.status(400).json({ message: 'Invalid category data provided', data: [] })
}

// @desc update a category
// @route PATCH /categorys
// @access Private
const update = async(req, res) =>{
    const { id, name, price, quantity, description } = req.body

    //confirm data
    if(!id || !name || !price) return res.status(400).json({ message: 'All Fields are required', data: [] }) 

    //confirm category
    const category = await Category.findById(id).exec()
    if(!category) return res.status(400).json({ message: `Category record was not found`, data: [] })

    //check for duplicate
    const duplicate = await Category.findOne({ name }).collation({ locale: 'en', strength: 2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) return res.status(409).json({ message: `Category already exist`, data: [] })

    const image = req?.files
    if(image){
        imagepath = `${global?.images}/${image?.name}`
        //move the image to the upload folder 
        image?.move(imagepath)
    }
    
    category.name = name
    category.price = price
    category.quantity = quantity
    category.description = description
    image && (category.image = image.name)
    category.updatedAt = Date.now()
    await category.save()
    
    res.json({ message: `Category record have been updated successfully`, data: category })
}

// @desc delete a category Record
// @route DELETE /category/:id
// @access Private
const deleteOne = async(req, res) =>{
    const { id } = req.params

    //confirm data
    if(!id) return res.status(400).json({ message: `Provide category id`, data: [] })

    //confirm category
    const category = await Category.findById(id).exec()
    if(!category) return res.status(400).json({ message: `Category records not found`, data: [] })

    await category.deleteOne()

    res.json({ message: `Category record has been deleted successfully`, data: [] })
}

// @desc delete all category Record
// @route DELETE /categorys
// @access Private
const deleteAll = async(req, res) =>{
    await Category.deleteMany()

    res.json({ message: `Category records have been deleted successfully`, data: [] })
}

module.exports = {
    index,
    show,
    create,
    update,
    deleteOne,
    deleteAll
}
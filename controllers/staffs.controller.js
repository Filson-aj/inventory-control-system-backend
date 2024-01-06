const Staff = require('../models/staff.model'),
    utilities = require('../helpers/utilities.helper'),
    moment = require('moment')

// @desc Get single staff
// @route GET /staffs/:id
// @access Private
const index = async(req, res) =>{
    if(!req.params.id) return res.status(400).json({ message: `Please provide staff's ID`, data: []}) 
    
    //get staff's records
    const staff = await Staff.findById(req.params.id).populate('user', 'email roles').lean().exec()

    if(!staff) return res.status(400).json({ message: `There are no staff's records found`, data: []})

    res.json({ message: `Staff's record retrieved successfully`, data: staff })
}

// @desc Get all staffs
// @route GET /staffs
// @access Private
const show = async(req, res) =>{
    const staffs = await Staff.find().populate('user', 'email roles').lean().exec()

    if(!staffs?.length) return res.status(400).json({ message: `There are no staffs' record found!`})

    res.json({ message: `Staffs' records retrieved successfully`, data: staffs })
}

// @desc create new staff
// @route POST /staffs
// @access Private
const create = async(req, res) =>{
    const { name, gender, contact, user } = req.body

    //confirm data
    if(!gender || !user) return res.status(400).json({ message: 'All Fields are required', data: [] })

    let staffid = '', duplicate = false
    while(!staffid || duplicate){
        staffid = `ST/${moment(Date.now()).format('YYYY')}/${moment(Date.now()).format('M')}/${utilities.uniqueNumber(4)}`
        duplicate = await Staff.findOne({ staffid }).collation({ locale: 'en', strength: 2}).exec()
    }

    //create and store new staff
    const staff = await Staff.create({ staffid, name, gender, contact, user })
    if(staff){//staff created
       return res.status(201).json({ message: `New staff records has been created successfully`, data: staff })
    }
    res.status(400).json({ message: 'Invalid staff data provided', data: [] })
}

// @desc update a staff
// @route PATCH /staffs
// @access Private
const update = async(req, res) =>{
    const { id, name, gender, contact } = req.body

    //confirm data
    if(!id || !gender) return res.status(400).json({ message: 'All Fields are required', data: [] }) 

    //confirm staff
    const staff = await Staff.findById(id).exec()
    if(!staff) return res.status(400).json({ message: `Staff's record was not found`, data: [] })

    staff.name = name
    staff.gender = gender
    staff.contact = contact
    staff.updatedAt = Date.now()
    await staff.save()
    
    res.json({ message: `Staff's records have been updated successfully`, data: staff })
}

// @desc delete a staff
// @route DELETE /staffs/:id
// @access Private
const deleteOne = async(req, res) =>{
    const { id } = req.params

    //confirm data
    if(!id) return res.status(400).json({ message: `Provide staff's id`, data: [] })

    //confirm staff
    const staff = await Staff.findById(id).exec()
    if(!staff) return res.status(400).json({ message: `Staff records not found`, data: [] })

    await staff.deleteOne()

    res.json({ message: `Staff's records has been deleted successfully`, data: [] })
}

// @desc delete all staffs
// @route DELETE /staffs
// @access Private
const deleteAll = async(req, res) =>{
    await Staff.deleteMany()

    res.json({ message: `Staffs' records has been deleted successfully`, data: [] })
}

module.exports = {
    index,
    show,
    create,
    update,
    deleteOne,
    deleteAll
}
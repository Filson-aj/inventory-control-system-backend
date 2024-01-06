const bcrypt = require('bcrypt'), 
    User = require('../models/user.model')

// @desc Get single user
// @route GET /users/:id
// @access Private
const index = async(req, res) =>{
    if(!req.id) return res.status(400).json({ message: `User's ID is required`})

    const user = await User.findById(req.id).select('-password').lean().exec()

    if(!user) return res.status(400).json({ message: 'No User Found!'})

    res.json({ message: `User's record retrieved successfully!`, data: user })
}

// @desc Get all users
// @route GET /users
// @access Private
const show = async(req, res) =>{
    const users = await User.find().select('-password').lean().exec()

    if(!users?.length) return res.status(400).json({ message: 'No Users Found!'})

    res.json({ message: `Users' record retrieved successfully!`, data: users, })
}

// @desc create new user
// @route POST /users, /register
// @access Public
const create = async(req, res) =>{
    const { email, password, confirm_password, roles } = req.body

    //confirm data
    if(!email || !password || !confirm_password) return res.status(400).json({ message: 'All Fields are required' })

    //confirm password
    if(password !== confirm_password) return res.status(400).json({ message: 'Password Mismatch' })

    //check for duplicate email address
    const duplicate = await User.findOne({ email }).collation({ locale: 'en', strength: 2}).lean().exec()
    if(duplicate) return res.status(409).json({ message: 'User already exist' })

    //hash password
    const hashed_password = await bcrypt.hash(password, 10) //salt rounds

    //in case no role is provided
    const userObject = (!Array.isArray(roles) || !roles.length) ? { email, "password": hashed_password } : { email, "password": hashed_password, roles }

    //create and store new user
    const user = await User.create(userObject)
    if(user){//user created
       return res.status(201).json({ message: 'New user created successfully', data: {
        id: user._id, email: user.email, roles: user.roles, active: user.active
       } })
    }
    res.status(400).json({ message: 'Invalide user data provided' })
}

// @desc update a user
// @route PATCH /users
// @access Private
const update = async(req, res) =>{
    const { id, email, roles, active } = req.body

    //confirm data
    if(!id || !email || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') return res.status(400).json({ message: 'All Fields are required' })

    //confirm user
    const user = await User.findById(id).exec()
    if(!user) return res.status(400).json({ message: 'User not found' })

    //check for duplicate
    const duplicate = await User.findOne({ email }).collation({ locale: 'en', strength: 2}).lean().exec()
    if(duplicate && duplicate?._id.toString() !== id) return res.status(409).json({ message: 'Username already exist' })

    user.email = email
    user.roles = roles
    user.active = active
    user.updatedAt = Date.now()
    const updatedUser = await user.save()
    
    res.json({ message: `User's (${updatedUser.email}) records have been updated successfully `})
}

// @desc change user's password
// @route PATCH /users/:id/change-password
// @access Private
const changePassword = async(req, res) =>{
    const { id, old_password, password, confirm_password } = req.body

    //confirm data
    if(!id || old_password || !password || !confirm_password ) return res.status(400).json({ message: 'All Fields are required' })

    //confirm password
    if(password !== confirm_password) return res.status(400).json({ message: 'Password Mismatch' })

    //confirm user
    const user = await User.findByIdAndUpdate(id).exec()
    if(!user) return res.status(400).json({ message: 'User not found' })

    //confirm old_password
    if(await bcrypt.compare(old_password, user.password)) return res.status(400).json({ message: 'User not found' })

    //update and save user's password
    user.password = await bcrypt.hash(password, 10)
    await user.save()
    
    res.json({ message: `Password updated successfully`}) 
}

// @desc delete a user
// @route DELETE /users/:id
// @access Private
const deleteOne = async(req, res) =>{
    const { id } = req.params

    //confirm data
    if(!id) return res.status(400).json({ message: 'User ID is required' })

    //confirm user
    const user = await User.findById(id).exec()
    if(!user) return res.status(400).json({ message: 'User not found' })

    await user.deleteOne()

    res.json({ message: `User's record deleted successfully` })
}

// @desc delete all users except for admin
// @route DELETE /users
// @access Private
const deleteAll = async(req, res) =>{
    await User.deleteMany({
        roles: {
          $not: {
            $elemMatch: { $eq: 'Admin' } // Delete users where 'Admin' role is not present
          }
        }
    })

    res.json({ message: `Users' records has been deleted successfully` })
}

module.exports = {
    index,
    show,
    create,
    update,
    changePassword,
    deleteOne,
    deleteAll
}
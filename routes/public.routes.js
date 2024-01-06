const express = require('express'),
    router = express.Router(),
    users = require('../controllers/users.controller'),
    staffs = require('../controllers/staffs.controller'),
    customers = require('../controllers/customers.controller')

//authentication routing
router.route('/register')
    .post(users.create)

//staff route
router.route('/staffs')
    .post(staffs.create)

//customer route
router.route('/customers')
    .post(customers.create)

module.exports = router
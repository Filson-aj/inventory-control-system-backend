const express = require('express'),
    router = express.Router(),
    verify = require('../middleware/verify.jwt'),
    customers = require('../controllers/customers.controller')

router.use(verify) //authentication configuration

//basic routing 
router.route('/')
    .get(customers.show)
    .post(customers.create)
    .patch(customers.update)
    .delete(customers.deleteAll)

//special routes
router.route('/:id')
    .get(customers.index)
    .delete(customers.deleteOne)

module.exports = router
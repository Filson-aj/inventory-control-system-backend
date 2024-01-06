const express = require('express'),
    router = express.Router(),
    verify = require('../middleware/verify.jwt'),
    orders = require('../controllers/orders.controller')

router.use(verify) //authentication configuration

//basic routing 
router.route('/')
    .get(orders.show)
    .post(orders.create)
    .patch(orders.update)
    .delete(orders.deleteAll)

//special routes
router.route('/:id')
    .get(orders.index)
    .delete(orders.deleteOne)

module.exports = router
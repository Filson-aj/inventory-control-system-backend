const express = require('express'),
    router = express.Router(),
    verify = require('../middleware/verify.jwt'),
    products = require('../controllers/products.controller')

router.use(verify) //authentication configuration

//basic routing 
router.route('/')
    .get(products.show)
    .post(products.create)
    .patch(products.update)
    .delete(products.deleteAll)

//special routes
router.route('/:id')
    .get(products.index)
    .delete(products.deleteOne)

module.exports = router
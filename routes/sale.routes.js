const express = require('express'),
    router = express.Router(),
    verify = require('../middleware/verify.jwt'),
    sales = require('../controllers/sales.controller')

router.use(verify) //authentication configuration

//basic routing 
router.route('/')
.post(sales.create)
    .get(sales.show)
    .patch(sales.update)
    .delete(sales.deleteAll)

//special routes
router.route('/:id')
    .get(sales.index)
    .delete(sales.deleteOne)

module.exports = router
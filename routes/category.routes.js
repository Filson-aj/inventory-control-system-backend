const express = require('express'),
    router = express.Router(),
    verify = require('../middleware/verify.jwt'),
    categories = require('../controllers/categories.controller')

router.use(verify) //authentication configuration

//basic routing 
router.route('/')
    .get(categories.show)
    .post(categories.create)
    .patch(categories.update)
    .delete(categories.deleteAll)

//special routes
router.route('/:id')
    .get(categories.index)
    .delete(categories.deleteOne)

module.exports = router
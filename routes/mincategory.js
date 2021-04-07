const express = require('express');

const mincategoryController = require('../controllers/mincategory');

const router = express.Router();

router.get('/getsubcategories',mincategoryController.getcategories);

router.post('/create',mincategoryController.createCategory);

module.exports = router;





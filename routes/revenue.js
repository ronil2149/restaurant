const express = require('express');
const router = express.Router();
const RevenueController = require('../controllers/revenue');

router.post('/revenuedaily', RevenueController.GetByDay);

router.post('/dates',RevenueController.Accordingly);

router.post('/month',RevenueController.GetByMonth);

router.post('/year',RevenueController.GetByYear);

router.post('/date',RevenueController.DateWise);

router.get('/sum',RevenueController.Sum);

module.exports = router;

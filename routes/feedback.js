const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback');
const auth = require('../middleware/is-auth')

router.post('/give',auth.auth,feedbackController.GiveFeedback);

router.get('/feedbacks',feedbackController.GetFeedbacks);

router.get('/getone/:feedbackId',feedbackController.GetOne);

router.get('/average',feedbackController.Average);

module.exports = router;
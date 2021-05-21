const express = require('express');
const router = express.Router();

const replyController = require('../controllers/reply')

router.post('/reply/:complaintId',replyController.MakeComplaint);

router.get('/replies/:replyId',replyController.GetReply);

router.get('/reply/:complaintId',replyController.GetComplaint);

module.exports = router;
const express = require('express');
const router = express.Router();

const replyController = require('../controllers/reply')

router.post('/reply/:complaintId',replyController.MakeReply);

router.get('/reply/:replyId',replyController.GetReply);

router.get('/reply/:complaintId',replyController.GetComplaint);

router.get('/replies',replyController.Getreplies);

module.exports = router;
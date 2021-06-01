const express = require('express');
const router = express.Router();
const ComplaintController = require('../controllers/complaint');
const auth = require('../middleware/is-auth')

router.post('/makecomplaint/:orderId',auth.auth,ComplaintController.MakeComplaint);

router.get('/complaints',ComplaintController.GetComplaints);

router.get('/complaint/:complaintId',ComplaintController.GetOne);

router.put('/delete/:complaintId',ComplaintController.DeleteComplaint);

module.exports = router;
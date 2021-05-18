const express = require('express');
const router = express.Router();

const allController = require('../controllers/all');
const auth = require('../middleware/is-auth');

router.put('/register',allController.signup);

router.post('/login',allController.login);

router.post('/forgot',allController.forgot);

router.post('/get',allController.getSomeone);

router.post('/reset',allController.reset);

router.put('/updaterole',auth.auth,allController.UpdateRole);

router.delete('/delete/:allId',allController.DeleteSomeone);

router.put('/deactivate/:allId',allController.DeactivateSomeone);

router.put('/activate/:allId',allController.ActivateSomeone);

router.put('/update/:allId',allController.UpdateSomeone);

router.put('/switchrole',auth.auth,allController.SwitchRole);

router.get('/geteveryone',allController.GetEveryone);

module.exports = router;
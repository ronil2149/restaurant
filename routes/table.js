const express = require('express');
const router  =  express();

const auth = require('../middleware/is-auth');
const TableController = require('../controllers/table');

router.post('/reservation',auth.auth,TableController.MakeResevation);

router.post('/maketable',TableController.CreateTable);

router.get('/tables',TableController.GetTables);

router.delete('/delete/:tableId',TableController.DeleteTable);

router.get('/reservations',TableController.GetReservations);

router.delete('/deleter/:reservationId', TableController.DeleteReservation);

router.post('/checkin',auth.auth,TableController.CheckIn);

router.post('/scan',TableController.Scan);

router.post('/checkout',TableController.CheckOut);

router.get('/orderlist/:tableId?',TableController.OrderListOfTable);

module.exports = router;
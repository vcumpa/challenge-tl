const express = require('express');
const router = express.Router();
const matrixController = require('../controllers/matrix.controller');

router.post('/stats', matrixController.calculateStats);

module.exports = router;
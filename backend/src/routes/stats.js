const router = require('express').Router();
const statsController = require('../controllers/statsController');
const { authenticate } = require('../middleware/auth');

router.get('/dashboard', authenticate, statsController.dashboard);

module.exports = router;

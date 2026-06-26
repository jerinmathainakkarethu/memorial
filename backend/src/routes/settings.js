const router = require('express').Router();
const settingsController = require('../controllers/settingsController');
const { authenticate, requireRole } = require('../middleware/auth');

router.get('/public', settingsController.getPublicSettings);
router.get('/', authenticate, settingsController.list);
router.put('/:key', authenticate, requireRole('admin', 'super_admin'), settingsController.update);

module.exports = router;

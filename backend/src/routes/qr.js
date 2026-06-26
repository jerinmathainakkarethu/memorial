const router = require('express').Router();
const qrController = require('../controllers/qrController');
const { authenticate } = require('../middleware/auth');

router.post('/generate', authenticate, qrController.generate);
router.post('/generate-family', authenticate, qrController.generateFamily);
router.get('/member/:memberId', qrController.getForMember);
router.get('/preview/:memberId', qrController.preview);
router.post('/scan/:memberId', qrController.incrementScan);

module.exports = router;

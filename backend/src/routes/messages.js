const router = require('express').Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createMessageSchema, approveMessageSchema } = require('../validations/message');

router.get('/', authenticate, messageController.list);
router.post('/:memberId', messageController.create);
router.put('/:id/approve', authenticate, validate(approveMessageSchema), messageController.approve);
router.delete('/:id', authenticate, messageController.remove);

module.exports = router;

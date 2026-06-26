const router = require('express').Router();
const timelineController = require('../controllers/timelineController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createTimelineSchema, updateTimelineSchema } = require('../validations/timeline');

router.get('/', timelineController.list);
router.post('/', authenticate, validate(createTimelineSchema), timelineController.create);
router.put('/:id', authenticate, validate(updateTimelineSchema), timelineController.update);
router.delete('/:id', authenticate, timelineController.remove);

module.exports = router;

const router = require('express').Router();
const memberController = require('../controllers/memberController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { photoUpload } = require('../middleware/upload');
const { createMemberSchema, updateMemberSchema } = require('../validations/member');

router.get('/search', memberController.search);
router.get('/', authenticate, memberController.list);
router.get('/tree/:familyId', memberController.getFamilyTree);
router.get('/slug/:slug', memberController.getBySlug);
router.get('/:id', memberController.get);
router.post('/:id/candle', memberController.lightCandle);
router.post('/', authenticate, validate(createMemberSchema), memberController.create);
router.put('/:id', authenticate, validate(updateMemberSchema), memberController.update);
router.delete('/:id', authenticate, memberController.remove);
router.put('/:id/photo', authenticate, photoUpload.single('photo'), memberController.updateProfilePhoto);

module.exports = router;

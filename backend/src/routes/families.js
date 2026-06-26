const router = require('express').Router();
const familyController = require('../controllers/familyController');
const { authenticate, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { photoUpload } = require('../middleware/upload');
const { createFamilySchema, updateFamilySchema } = require('../validations/family');

router.get('/public', familyController.getPublicFamilies);
router.get('/', authenticate, familyController.list);
router.get('/slug/:slug', familyController.getBySlug);
router.get('/:id', authenticate, familyController.get);
router.post('/', authenticate, validate(createFamilySchema), familyController.create);
router.put('/:id', authenticate, validate(updateFamilySchema), familyController.update);
router.delete('/:id', authenticate, familyController.remove);
router.put('/:id/cover', authenticate, photoUpload.single('cover'), familyController.updateCover);

module.exports = router;

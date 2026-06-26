const router = require('express').Router();
const mediaController = require('../controllers/mediaController');
const { authenticate } = require('../middleware/auth');
const { photoUpload, videoUpload, handleMulterError } = require('../middleware/upload');

router.get('/photos', authenticate, mediaController.listPhotos);
router.get('/videos', authenticate, mediaController.listVideos);
router.get('/photos/:memberId', mediaController.getMemberPhotos);
router.get('/videos/:memberId', mediaController.getMemberVideos);
router.post('/photos', authenticate, photoUpload.single('photo'), handleMulterError, mediaController.uploadPhoto);
router.post('/videos', authenticate, videoUpload.single('video'), handleMulterError, mediaController.uploadVideo);
router.post('/videos/youtube', authenticate, mediaController.addYouTubeVideo);
router.delete('/photos/:id', authenticate, mediaController.deleteMedia);
router.delete('/videos/:id', authenticate, mediaController.deleteVideo);

module.exports = router;

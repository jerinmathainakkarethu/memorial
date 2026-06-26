const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { FILE_TYPES, MAX_FILE_SIZES } = require('../config/constants');

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/photos'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/videos'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const photoUpload = multer({
  storage: photoStorage,
  limits: { fileSize: MAX_FILE_SIZES.IMAGE },
  fileFilter: (req, file, cb) => {
    if (FILE_TYPES.IMAGE.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP, and GIF images are allowed'), false);
    }
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: MAX_FILE_SIZES.VIDEO },
  fileFilter: (req, file, cb) => {
    if (FILE_TYPES.VIDEO.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only MP4, WebM, and OGG videos are allowed'), false);
    }
  },
});

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

module.exports = { photoUpload, videoUpload, handleMulterError };

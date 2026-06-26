const pool = require('../config/database');
const { logActivity } = require('../utils/activityLogger');

exports.uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Photo file is required' });
    }

    const { member_id, caption, alt_text, is_cover, is_featured } = req.body;
    const filePath = `/uploads/photos/${req.file.filename}`;

    const [result] = await pool.query(
      `INSERT INTO media (family_id, member_id, file_name, file_path, file_type, mime_type, file_size, alt_text, caption, is_cover, is_featured, uploaded_by)
       VALUES (?, ?, ?, ?, 'image', ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.family_id,
        member_id || null,
        req.file.filename,
        filePath,
        req.file.mimetype,
        req.file.size,
        alt_text || null,
        caption || null,
        is_cover ? 1 : 0,
        is_featured ? 1 : 0,
        req.user.id,
      ]
    );

    await logActivity({
      userId: req.user.id,
      action: 'UPLOAD_PHOTO',
      entityType: 'media',
      entityId: result.insertId,
      description: 'Uploaded photo',
    });

    const [media] = await pool.query('SELECT * FROM media WHERE id = ?', [result.insertId]);
    res.status(201).json({ data: media[0] });
  } catch (err) {
    next(err);
  }
};

exports.uploadVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Video file is required' });
    }

    const { member_id, title, description, is_featured } = req.body;
    const filePath = `/uploads/videos/${req.file.filename}`;

    const [result] = await pool.query(
      `INSERT INTO videos (family_id, member_id, title, description, video_type, file_name, file_path, is_featured, uploaded_by)
       VALUES (?, ?, ?, ?, 'upload', ?, ?, ?, ?)`,
      [
        req.body.family_id,
        member_id || null,
        title || 'Untitled Video',
        description || null,
        req.file.filename,
        filePath,
        is_featured ? 1 : 0,
        req.user.id,
      ]
    );

    await logActivity({
      userId: req.user.id,
      action: 'UPLOAD_VIDEO',
      entityType: 'videos',
      entityId: result.insertId,
      description: 'Uploaded video',
    });

    const [video] = await pool.query('SELECT * FROM videos WHERE id = ?', [result.insertId]);
    res.status(201).json({ data: video[0] });
  } catch (err) {
    next(err);
  }
};

exports.addYouTubeVideo = async (req, res, next) => {
  try {
    const { family_id, member_id, title, description, youtube_url, is_featured } = req.body;

    let youtubeId = null;
    if (youtube_url) {
      const match = youtube_url.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      if (match) {
        youtubeId = match[1];
      }
    }

    if (!youtubeId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const [result] = await pool.query(
      `INSERT INTO videos (family_id, member_id, title, description, video_type, youtube_url, youtube_id, thumbnail, is_featured, uploaded_by)
       VALUES (?, ?, ?, ?, 'youtube', ?, ?, ?, ?, ?)`,
      [
        family_id,
        member_id || null,
        title || 'Untitled Video',
        description || null,
        youtube_url,
        youtubeId,
        `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        is_featured ? 1 : 0,
        req.user.id,
      ]
    );

    const [video] = await pool.query('SELECT * FROM videos WHERE id = ?', [result.insertId]);
    res.status(201).json({ data: video[0] });
  } catch (err) {
    next(err);
  }
};

exports.listPhotos = async (req, res, next) => {
  try {
    const { family_id, member_id, q = '' } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1000;
    const offset = (page - 1) * limit;

    let where = "WHERE media.deleted_at IS NULL AND media.file_type = 'image'";
    const params = [];

    if (family_id) {
      where += ' AND media.family_id = ?';
      params.push(family_id);
    }

    if (member_id) {
      where += ' AND media.member_id = ?';
      params.push(member_id);
    }

    if (q) {
      const searchTerm = `%${q}%`;
      where += ' AND (media.caption LIKE ? OR media.alt_text LIKE ? OR m.full_name LIKE ? OR f.name LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM media
       LEFT JOIN family_members m ON m.id = media.member_id
       LEFT JOIN families f ON f.id = media.family_id
       ${where}`,
      params
    );
    const total = countResult[0].total;

    const [rows] = await pool.query(
      `SELECT media.*, m.full_name as member_name, f.name as family_name
       FROM media
       LEFT JOIN family_members m ON m.id = media.member_id
       LEFT JOIN families f ON f.id = media.family_id
       ${where}
       ORDER BY media.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (err) {
    next(err);
  }
};

exports.listVideos = async (req, res, next) => {
  try {
    const { family_id, member_id, q = '' } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1000;
    const offset = (page - 1) * limit;

    let where = 'WHERE videos.deleted_at IS NULL';
    const params = [];

    if (family_id) {
      where += ' AND videos.family_id = ?';
      params.push(family_id);
    }

    if (member_id) {
      where += ' AND videos.member_id = ?';
      params.push(member_id);
    }

    if (q) {
      const searchTerm = `%${q}%`;
      where += ' AND (videos.title LIKE ? OR videos.description LIKE ? OR m.full_name LIKE ? OR f.name LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM videos
       LEFT JOIN family_members m ON m.id = videos.member_id
       LEFT JOIN families f ON f.id = videos.family_id
       ${where}`,
      params
    );
    const total = countResult[0].total;

    const [rows] = await pool.query(
      `SELECT videos.*, m.full_name as member_name, f.name as family_name
       FROM videos
       LEFT JOIN family_members m ON m.id = videos.member_id
       LEFT JOIN families f ON f.id = videos.family_id
       ${where}
       ORDER BY videos.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMemberPhotos = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM media WHERE member_id = ? AND file_type = 'image' AND deleted_at IS NULL ORDER BY sort_order ASC, created_at DESC",
      [req.params.memberId]
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

exports.getMemberVideos = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM videos WHERE member_id = ? AND deleted_at IS NULL ORDER BY sort_order ASC, created_at DESC',
      [req.params.memberId]
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE media SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [req.params.id]
    );

    await logActivity({
      userId: req.user.id,
      action: 'DELETE_MEDIA',
      entityType: 'media',
      entityId: req.params.id,
      description: 'Deleted media',
    });

    res.json({ message: 'Media deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.deleteVideo = async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE videos SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [req.params.id]
    );
    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    next(err);
  }
};

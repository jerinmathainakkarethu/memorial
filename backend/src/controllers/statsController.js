const pool = require('../config/database');

exports.dashboard = async (req, res, next) => {
  try {
    const [[{ total_families }]] = await pool.query('SELECT COUNT(*) as total_families FROM families WHERE deleted_at IS NULL');
    const [[{ total_members }]] = await pool.query('SELECT COUNT(*) as total_members FROM family_members WHERE deleted_at IS NULL');
    const [[{ total_photos }]] = await pool.query("SELECT COUNT(*) as total_photos FROM media WHERE file_type = 'image' AND deleted_at IS NULL");
    const [[{ total_videos }]] = await pool.query('SELECT COUNT(*) as total_videos FROM videos WHERE deleted_at IS NULL');
    const [[{ total_messages }]] = await pool.query('SELECT COUNT(*) as total_messages FROM memorial_messages WHERE deleted_at IS NULL');
    const [[{ pending_messages }]] = await pool.query("SELECT COUNT(*) as pending_messages FROM memorial_messages WHERE is_approved = 0 AND deleted_at IS NULL");
    const [[{ total_qr_scans }]] = await pool.query('SELECT COALESCE(SUM(scan_count), 0) as total_qr_scans FROM qr_codes WHERE deleted_at IS NULL');

    const [recentMembers] = await pool.query(
      `SELECT m.id, m.full_name, m.slug, m.profile_photo, m.created_at, f.name as family_name
       FROM family_members m
       JOIN families f ON f.id = m.family_id
       WHERE m.deleted_at IS NULL
       ORDER BY m.created_at DESC LIMIT 5`
    );

    const [recentMessages] = await pool.query(
      `SELECT msg.id, msg.visitor_name, msg.message, msg.is_approved, msg.created_at,
        m.full_name as member_name
       FROM memorial_messages msg
       JOIN family_members m ON m.id = msg.member_id
       WHERE msg.deleted_at IS NULL
       ORDER BY msg.created_at DESC LIMIT 5`
    );

    res.json({
      data: {
        stats: {
          total_families,
          total_members,
          total_photos,
          total_videos,
          total_messages,
          pending_messages,
          total_qr_scans,
        },
        recent_members: recentMembers,
        recent_messages: recentMessages,
      },
    });
  } catch (err) {
    next(err);
  }
};

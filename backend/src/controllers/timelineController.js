const pool = require('../config/database');
const { logActivity } = require('../utils/activityLogger');
const { paginate } = require('../utils/helpers');

exports.list = async (req, res, next) => {
  try {
    const { member_id } = req.query;
    const q = req.query.q || req.query.search || '';
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);

    let where = 'WHERE t.deleted_at IS NULL';
    const params = [];

    if (member_id) {
      where += ' AND t.member_id = ?';
      params.push(member_id);
    }

    if (q) {
      const searchTerm = `%${q}%`;
      where += ' AND (t.title LIKE ? OR t.title_ml LIKE ? OR t.description LIKE ? OR t.description_ml LIKE ? OR m.full_name LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM timeline_events t JOIN family_members m ON m.id = t.member_id ${where}`,
      params
    );
    const total = countResult[0].total;

    const sql = `SELECT t.*, m.full_name as member_name FROM timeline_events t JOIN family_members m ON m.id = t.member_id ${where} ORDER BY COALESCE(t.event_date, CONCAT(t.event_year, "-01-01")) ASC LIMIT ? OFFSET ?`;
    const [rows] = await pool.query(sql, [...params, limit, offset]);

    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { member_id, title, title_ml, description, description_ml, event_date, event_year, event_type, is_featured } = req.body;

    const [member] = await pool.query(
      'SELECT family_id FROM family_members WHERE id = ? AND deleted_at IS NULL',
      [member_id]
    );

    if (!member.length) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const [result] = await pool.query(
      `INSERT INTO timeline_events (family_id, member_id, title, title_ml, description, description_ml, event_date, event_year, event_type, is_featured, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [member[0].family_id, member_id, title, title_ml || null, description || null, description_ml || null, event_date || null, event_year || null, event_type, is_featured ? 1 : 0, req.user.id]
    );

    await logActivity({
      userId: req.user.id,
      action: 'CREATE_TIMELINE',
      entityType: 'timeline_events',
      entityId: result.insertId,
      description: `Created timeline event: ${title}`,
    });

    const [event] = await pool.query('SELECT * FROM timeline_events WHERE id = ?', [result.insertId]);
    res.status(201).json({ data: event[0] });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { title, title_ml, description, description_ml, event_date, event_year, event_type, is_featured } = req.body;
    const fields = [];
    const values = [];

    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (title_ml !== undefined) { fields.push('title_ml = ?'); values.push(title_ml); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (description_ml !== undefined) { fields.push('description_ml = ?'); values.push(description_ml); }
    if (event_date !== undefined) { fields.push('event_date = ?'); values.push(event_date); }
    if (event_year !== undefined) { fields.push('event_year = ?'); values.push(event_year); }
    if (event_type !== undefined) { fields.push('event_type = ?'); values.push(event_type); }
    if (is_featured !== undefined) { fields.push('is_featured = ?'); values.push(is_featured ? 1 : 0); }

    if (!fields.length) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id);
    await pool.query(
      `UPDATE timeline_events SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
      values
    );

    const [event] = await pool.query('SELECT * FROM timeline_events WHERE id = ?', [req.params.id]);
    res.json({ data: event[0] });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE timeline_events SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [req.params.id]
    );
    res.json({ message: 'Timeline event deleted' });
  } catch (err) {
    next(err);
  }
};

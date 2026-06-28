const pool = require('../config/database');
const { logActivity } = require('../utils/activityLogger');
const { sanitizeHtml, paginate } = require('../utils/helpers');

exports.list = async (req, res, next) => {
  try {
    const { member_id, is_approved } = req.query;
    const q = req.query.q || req.query.search || '';
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);

    let where = 'WHERE m.deleted_at IS NULL';
    const params = [];

    if (member_id) {
      where += ' AND m.member_id = ?';
      params.push(member_id);
    }

    if (is_approved !== undefined) {
      where += ' AND m.is_approved = ?';
      params.push(is_approved === '1' ? 1 : 0);
    }

    if (q) {
      const searchTerm = `%${q}%`;
      where += ' AND (m.visitor_name LIKE ? OR m.message LIKE ? OR mem.full_name LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM memorial_messages m JOIN family_members mem ON mem.id = m.member_id ${where}`,
      params
    );
    const total = countResult[0].total;

    const sql = `SELECT m.*, mem.full_name as member_name FROM memorial_messages m JOIN family_members mem ON mem.id = m.member_id ${where} ORDER BY m.created_at DESC LIMIT ? OFFSET ?`;
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
    const { visitor_name, message } = req.body;
    const sanitizedName = sanitizeHtml(visitor_name);
    const sanitizedMessage = sanitizeHtml(message);

    const [[{ allow }]] = await pool.query(
      "SELECT setting_value AS `allow` FROM app_settings WHERE setting_key = 'allow_public_messages'"
    );
    if (allow === '0') {
      return res.status(403).json({ error: 'Public messages are currently disabled' });
    }

    const [memberRows] = await pool.query(
      'SELECT family_id FROM family_members WHERE id = ? AND deleted_at IS NULL',
      [req.params.memberId]
    );

    if (!memberRows.length) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const familyId = memberRows[0].family_id;

    const [[{ autoApprove }]] = await pool.query(
      "SELECT setting_value AS autoApprove FROM app_settings WHERE setting_key = 'auto_approve_messages'"
    );

    const [result] = await pool.query(
      'INSERT INTO memorial_messages (family_id, member_id, visitor_name, message, is_approved, ip_address) VALUES (?, ?, ?, ?, ?, ?)',
      [familyId, req.params.memberId, sanitizedName, sanitizedMessage, autoApprove === '1' ? 1 : 0, req.ip]
    );

    const [msg] = await pool.query('SELECT id, visitor_name, message, is_approved, created_at FROM memorial_messages WHERE id = ?', [result.insertId]);
    res.status(201).json({ data: msg[0] });
  } catch (err) {
    next(err);
  }
};

exports.approve = async (req, res, next) => {
  try {
    const { is_approved } = req.body;

    await pool.query(
      'UPDATE memorial_messages SET is_approved = ?, approved_by = ?, approved_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [is_approved ? 1 : 0, req.user.id, req.params.id]
    );

    await logActivity({
      userId: req.user.id,
      action: is_approved ? 'APPROVE_MESSAGE' : 'REJECT_MESSAGE',
      entityType: 'memorial_messages',
      entityId: req.params.id,
      description: is_approved ? 'Approved memorial message' : 'Rejected memorial message',
    });

    const [msg] = await pool.query('SELECT * FROM memorial_messages WHERE id = ?', [req.params.id]);
    res.json({ data: msg[0] });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE memorial_messages SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [req.params.id]
    );
    res.json({ message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
};

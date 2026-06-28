const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const { logActivity } = require('../utils/activityLogger');

exports.list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const offset = (page - 1) * limit;
    const q = req.query.q || '';

    let where = 'WHERE deleted_at IS NULL';
    const params = [];
    if (q) {
      where += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM users ${where}`,
      params
    );

    const [rows] = await pool.query(
      `SELECT id, name, email, role, avatar, is_active, last_login_at, created_at
       FROM users ${where}
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, avatar, is_active, last_login_at, created_at FROM users WHERE id = ? AND deleted_at IS NULL',
      [req.params.id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, email, password, role, is_active } = req.body;

    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? AND deleted_at IS NULL',
      [email]
    );
    if (existing.length) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role, is_active) VALUES (?, ?, ?, ?, ?)',
      [name, email, password_hash, role || 'admin', is_active !== undefined ? is_active : 1]
    );

    await logActivity({
      userId: req.user.id,
      action: 'CREATE_USER',
      entityType: 'users',
      entityId: result.insertId,
      description: `Created user "${name}" (${email})`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    const [rows] = await pool.query(
      'SELECT id, name, email, role, avatar, is_active, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, email, password, role, is_active } = req.body;

    const [user] = await pool.query(
      'SELECT id FROM users WHERE id = ? AND deleted_at IS NULL',
      [req.params.id]
    );
    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (email) {
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ? AND deleted_at IS NULL',
        [email, req.params.id]
      );
      if (existing.length) {
        return res.status(409).json({ error: 'Email already in use' });
      }
    }

    const fields = [];
    const params = [];
    if (name !== undefined) { fields.push('name = ?'); params.push(name); }
    if (email !== undefined) { fields.push('email = ?'); params.push(email); }
    if (role !== undefined) { fields.push('role = ?'); params.push(role); }
    if (is_active !== undefined) { fields.push('is_active = ?'); params.push(is_active); }
    if (password) {
      fields.push('password_hash = ?');
      params.push(await bcrypt.hash(password, 10));
    }

    if (fields.length) {
      params.push(req.params.id);
      await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        params
      );
    }

    await logActivity({
      userId: req.user.id,
      action: 'UPDATE_USER',
      entityType: 'users',
      entityId: parseInt(req.params.id),
      description: `Updated user ID ${req.params.id}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    const [rows] = await pool.query(
      'SELECT id, name, email, role, avatar, is_active, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const [result] = await pool.query(
      'UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ error: 'User not found' });
    }

    await logActivity({
      userId: req.user.id,
      action: 'DELETE_USER',
      entityType: 'users',
      entityId: id,
      description: `Deleted user ID ${id}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

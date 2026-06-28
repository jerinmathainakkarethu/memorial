const pool = require('../config/database');
const { generateSlug, paginate } = require('../utils/helpers');
const { logActivity } = require('../utils/activityLogger');

exports.list = async (req, res, next) => {
  try {
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);
    const q = req.query.q || req.query.search || '';

    let where = 'WHERE f.deleted_at IS NULL';
    const params = [];

    if (q) {
      const searchTerm = `%${q}%`;
      where += ' AND (f.name LIKE ? OR f.name_ml LIKE ? OR f.motto LIKE ? OR f.motto_ml LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM families f ${where}`,
      params
    );
    const total = countResult[0].total;

    const sql = `SELECT f.*, 
      (SELECT COUNT(*) FROM family_members fm WHERE fm.family_id = f.id AND fm.deleted_at IS NULL) as member_count,
      (SELECT COUNT(*) FROM family_members fm WHERE fm.family_id = f.id AND fm.deleted_at IS NULL AND fm.is_deceased = 1) as departed_count
      FROM families f 
      ${where}
      ORDER BY f.created_at DESC 
      LIMIT ? OFFSET ?`;
    const [rows] = await pool.query(sql, [...params, limit, offset]);

    res.json({
      data: rows,
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.*,
        (SELECT COUNT(*) FROM family_members fm WHERE fm.family_id = f.id AND fm.deleted_at IS NULL) as member_count,
        (SELECT COUNT(*) FROM family_members fm WHERE fm.family_id = f.id AND fm.deleted_at IS NULL AND fm.is_deceased = 1) as departed_count
       FROM families f WHERE f.id = ? AND f.deleted_at IS NULL`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Family not found' });
    }

    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.*,
        (SELECT COUNT(*) FROM family_members fm WHERE fm.family_id = f.id AND fm.deleted_at IS NULL) as member_count,
        (SELECT COUNT(*) FROM family_members fm WHERE fm.family_id = f.id AND fm.deleted_at IS NULL AND fm.is_deceased = 1) as departed_count
       FROM families f WHERE f.slug = ? AND f.deleted_at IS NULL`,
      [req.params.slug]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Family not found' });
    }

    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, name_ml, description, description_ml, motto, motto_ml } = req.body;
    const slug = generateSlug(name);

    const [result] = await pool.query(
      'INSERT INTO families (name, name_ml, slug, description, description_ml, motto, motto_ml, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, name_ml || null, slug, description || null, description_ml || null, motto || null, motto_ml || null, req.user.id]
    );

    await logActivity({
      userId: req.user.id,
      action: 'CREATE_FAMILY',
      entityType: 'families',
      entityId: result.insertId,
      description: `Created family: ${name}`,
    });

    const [family] = await pool.query('SELECT * FROM families WHERE id = ?', [result.insertId]);
    res.status(201).json({ data: family[0] });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, name_ml, description, description_ml, motto, motto_ml, is_active } = req.body;
    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
      fields.push('slug = ?');
      values.push(generateSlug(name));
    }
    if (name_ml !== undefined) {
      fields.push('name_ml = ?');
      values.push(name_ml);
    }
    if (description !== undefined) {
      fields.push('description = ?');
      values.push(description);
    }
    if (description_ml !== undefined) {
      fields.push('description_ml = ?');
      values.push(description_ml);
    }
    if (motto !== undefined) {
      fields.push('motto = ?');
      values.push(motto);
    }
    if (motto_ml !== undefined) {
      fields.push('motto_ml = ?');
      values.push(motto_ml);
    }
    if (is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(is_active ? 1 : 0);
    }

    if (!fields.length) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id);
    await pool.query(
      `UPDATE families SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
      values
    );

    await logActivity({
      userId: req.user.id,
      action: 'UPDATE_FAMILY',
      entityType: 'families',
      entityId: req.params.id,
      description: 'Updated family',
    });

    const [family] = await pool.query('SELECT * FROM families WHERE id = ?', [req.params.id]);
    res.json({ data: family[0] });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE families SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [req.params.id]
    );

    await logActivity({
      userId: req.user.id,
      action: 'DELETE_FAMILY',
      entityType: 'families',
      entityId: req.params.id,
      description: 'Deleted family',
    });

    res.json({ message: 'Family deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.updateCover = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Cover photo is required' });
    }

    const coverPath = `/uploads/photos/${req.file.filename}`;
    await pool.query(
      'UPDATE families SET cover_photo = ? WHERE id = ? AND deleted_at IS NULL',
      [coverPath, req.params.id]
    );

    res.json({ data: { cover_photo: coverPath } });
  } catch (err) {
    next(err);
  }
};

exports.getPublicFamilies = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.id, f.name, f.name_ml, f.slug, f.description, f.description_ml, f.motto, f.motto_ml, f.cover_photo,
        (SELECT COUNT(*) FROM family_members fm WHERE fm.family_id = f.id AND fm.deleted_at IS NULL) as member_count,
        (SELECT COUNT(*) FROM family_members fm WHERE fm.family_id = f.id AND fm.deleted_at IS NULL AND fm.is_deceased = 1) as departed_count
       FROM families f 
       WHERE f.is_active = 1 AND f.deleted_at IS NULL 
       ORDER BY f.name ASC`
    );
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

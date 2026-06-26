const pool = require('../config/database');
const { generateSlug, calculateAge, paginate, buildFamilyTree } = require('../utils/helpers');
const { logActivity } = require('../utils/activityLogger');

exports.list = async (req, res, next) => {
  try {
    const { family_id } = req.query;
    const q = req.query.q || req.query.search || '';
    const { page, limit, offset } = paginate(req.query.page, req.query.limit);

    let where = 'WHERE m.deleted_at IS NULL';
    const params = [];

    if (family_id) {
      where += ' AND m.family_id = ?';
      params.push(family_id);
    }

    if (q) {
      const searchTerm = `%${q}%`;
      where += ' AND (m.full_name LIKE ? OR m.full_name_ml LIKE ? OR m.nickname LIKE ? OR m.nickname_ml LIKE ? OR f.name LIKE ?)';
      params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM family_members m JOIN families f ON f.id = m.family_id ${where}`,
      params
    );
    const total = countResult[0].total;

    const sql = `SELECT m.*, f.name as family_name
      FROM family_members m
      JOIN families f ON f.id = m.family_id
      ${where}
      ORDER BY m.display_order ASC, m.full_name ASC
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
      `SELECT m.*, f.name as family_name
       FROM family_members m
       JOIN families f ON f.id = m.family_id
       WHERE m.id = ? AND m.deleted_at IS NULL`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const member = rows[0];

    const [photos] = await pool.query(
      "SELECT * FROM media WHERE member_id = ? AND file_type = 'image' AND deleted_at IS NULL ORDER BY sort_order ASC",
      [member.id]
    );

    const [videos] = await pool.query(
      'SELECT * FROM videos WHERE member_id = ? AND deleted_at IS NULL ORDER BY sort_order ASC',
      [member.id]
    );

    const [timeline] = await pool.query(
      'SELECT * FROM timeline_events WHERE member_id = ? AND deleted_at IS NULL ORDER BY COALESCE(event_date, CONCAT(event_year, "-01-01")) ASC',
      [member.id]
    );

    const [relationships] = await pool.query(
      `SELECT r.*, rm.full_name as related_name, rm.profile_photo as related_photo,
        rm.date_of_birth as related_dob, rm.date_of_death as related_dod
       FROM relationships r
       JOIN family_members rm ON rm.id = r.related_member_id
       WHERE r.member_id = ? AND r.deleted_at IS NULL AND rm.deleted_at IS NULL`,
      [member.id]
    );

    const [graveLocation] = await pool.query(
      'SELECT * FROM grave_locations WHERE member_id = ?',
      [member.id]
    );

    const [audioClips] = await pool.query(
      'SELECT * FROM audio_clips WHERE member_id = ? AND deleted_at IS NULL',
      [member.id]
    );

    if (member.date_of_birth) {
      member.age = calculateAge(member.date_of_birth, member.date_of_death);
    }

    member.photos = photos;
    member.videos = videos;
    member.timeline = timeline;
    member.relationships = relationships;
    member.graveLocation = graveLocation[0] || null;
    member.audioClips = audioClips;

    res.json({ data: member });
  } catch (err) {
    next(err);
  }
};

exports.getBySlug = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT m.*, f.name as family_name, f.slug as family_slug
       FROM family_members m
       JOIN families f ON f.id = m.family_id
       WHERE m.slug = ? AND m.deleted_at IS NULL AND m.is_active = 1`,
      [req.params.slug]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const member = rows[0];

    const [photos] = await pool.query(
      "SELECT * FROM media WHERE member_id = ? AND file_type = 'image' AND deleted_at IS NULL ORDER BY sort_order ASC",
      [member.id]
    );

    const [videos] = await pool.query(
      'SELECT * FROM videos WHERE member_id = ? AND deleted_at IS NULL ORDER BY sort_order ASC',
      [member.id]
    );

    const [timeline] = await pool.query(
      'SELECT * FROM timeline_events WHERE member_id = ? AND deleted_at IS NULL ORDER BY COALESCE(event_date, CONCAT(event_year, "-01-01")) ASC',
      [member.id]
    );

    const [relationships] = await pool.query(
      `SELECT r.*, rm.full_name as related_name, rm.profile_photo as related_photo,
        rm.date_of_birth as related_dob, rm.date_of_death as related_dod, rm.slug as related_slug
       FROM relationships r
       JOIN family_members rm ON rm.id = r.related_member_id
       WHERE r.member_id = ? AND r.deleted_at IS NULL AND rm.deleted_at IS NULL`,
      [member.id]
    );

    const [messages] = await pool.query(
      'SELECT visitor_name, message, created_at FROM memorial_messages WHERE member_id = ? AND is_approved = 1 AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 50',
      [member.id]
    );

    const [graveLocation] = await pool.query(
      'SELECT * FROM grave_locations WHERE member_id = ?',
      [member.id]
    );

    const [audioClips] = await pool.query(
      'SELECT * FROM audio_clips WHERE member_id = ? AND deleted_at IS NULL',
      [member.id]
    );

    if (member.date_of_birth) {
      member.age = calculateAge(member.date_of_birth, member.date_of_death);
    }

    member.photos = photos;
    member.videos = videos;
    member.timeline = timeline;
    member.relationships = relationships;
    member.messages = messages;
    member.graveLocation = graveLocation[0] || null;
    member.audioClips = audioClips;

    res.json({ data: member });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      family_id, full_name, full_name_ml, nickname, nickname_ml, gender, date_of_birth, date_of_death,
      place_of_birth, place_of_death, biography, biography_ml, occupation, occupation_ml, education, education_ml,
      awards, awards_ml, hobbies, hobbies_ml, religion, religion_ml, notes, notes_ml, is_deceased, relationships,
    } = req.body;

    const slug = generateSlug(full_name);

    const [result] = await connection.query(
      `INSERT INTO family_members 
       (family_id, full_name, full_name_ml, nickname, nickname_ml, slug, gender, date_of_birth, date_of_death,
        place_of_birth, place_of_death, biography, biography_ml, occupation, occupation_ml, education, education_ml,
        awards, awards_ml, hobbies, hobbies_ml, religion, religion_ml, notes, notes_ml, is_deceased, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [family_id, full_name, full_name_ml || null, nickname || null, nickname_ml || null, slug, gender,
       date_of_birth || null, date_of_death || null,
       place_of_birth || null, place_of_death || null,
       biography || null, biography_ml || null, occupation || null, occupation_ml || null, education || null, education_ml || null,
       awards || null, awards_ml || null, hobbies || null, hobbies_ml || null, religion || null, religion_ml || null, notes || null, notes_ml || null,
       is_deceased ? 1 : 0, req.user.id]
    );

    const memberId = result.insertId;

    if (relationships && relationships.length) {
      const relValues = relationships.map(r => [
        family_id, memberId, r.related_member_id, r.relationship_type,
      ]);
      await connection.query(
        'INSERT INTO relationships (family_id, member_id, related_member_id, relationship_type) VALUES ?',
        [relValues]
      );
    }

    await connection.commit();

    if (is_deceased) {
      const domain = process.env.DOMAIN || 'http://localhost:5173';
      const { generateQRCode } = require('../utils/qrGenerator');
      try {
        const qr = await generateQRCode(slug, domain);
        await pool.query(
          'INSERT INTO qr_codes (family_id, member_id, code, file_path, slug, url, generated_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [family_id, memberId, qr.fileName, qr.filePath, slug, qr.url, req.user.id]
        );
      } catch (qrErr) {
        console.error('QR generation failed:', qrErr.message);
      }
    }

    await logActivity({
      userId: req.user.id,
      action: 'CREATE_MEMBER',
      entityType: 'family_members',
      entityId: memberId,
      description: `Created member: ${full_name}`,
    });

    const [member] = await pool.query('SELECT * FROM family_members WHERE id = ?', [memberId]);
    res.status(201).json({ data: member[0] });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
};

exports.update = async (req, res, next) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      full_name, full_name_ml, nickname, nickname_ml, gender, date_of_birth, date_of_death,
      place_of_birth, place_of_death, biography, biography_ml, occupation, occupation_ml, education, education_ml,
      awards, awards_ml, hobbies, hobbies_ml, religion, religion_ml, notes, notes_ml, is_deceased, is_active,
      relationships, family_id
    } = req.body;

    const fields = [];
    const values = [];

    if (full_name !== undefined) {
      fields.push('full_name = ?');
      values.push(full_name);
      fields.push('slug = ?');
      values.push(generateSlug(full_name));
    }
    if (full_name_ml !== undefined) { fields.push('full_name_ml = ?'); values.push(full_name_ml); }
    if (nickname !== undefined) { fields.push('nickname = ?'); values.push(nickname); }
    if (nickname_ml !== undefined) { fields.push('nickname_ml = ?'); values.push(nickname_ml); }
    if (gender !== undefined) { fields.push('gender = ?'); values.push(gender); }
    if (date_of_birth !== undefined) { fields.push('date_of_birth = ?'); values.push(date_of_birth); }
    if (date_of_death !== undefined) { fields.push('date_of_death = ?'); values.push(date_of_death); }
    if (place_of_birth !== undefined) { fields.push('place_of_birth = ?'); values.push(place_of_birth); }
    if (place_of_death !== undefined) { fields.push('place_of_death = ?'); values.push(place_of_death); }
    if (biography !== undefined) { fields.push('biography = ?'); values.push(biography); }
    if (biography_ml !== undefined) { fields.push('biography_ml = ?'); values.push(biography_ml); }
    if (occupation !== undefined) { fields.push('occupation = ?'); values.push(occupation); }
    if (occupation_ml !== undefined) { fields.push('occupation_ml = ?'); values.push(occupation_ml); }
    if (education !== undefined) { fields.push('education = ?'); values.push(education); }
    if (education_ml !== undefined) { fields.push('education_ml = ?'); values.push(education_ml); }
    if (awards !== undefined) { fields.push('awards = ?'); values.push(awards); }
    if (awards_ml !== undefined) { fields.push('awards_ml = ?'); values.push(awards_ml); }
    if (hobbies !== undefined) { fields.push('hobbies = ?'); values.push(hobbies); }
    if (hobbies_ml !== undefined) { fields.push('hobbies_ml = ?'); values.push(hobbies_ml); }
    if (religion !== undefined) { fields.push('religion = ?'); values.push(religion); }
    if (religion_ml !== undefined) { fields.push('religion_ml = ?'); values.push(religion_ml); }
    if (notes !== undefined) { fields.push('notes = ?'); values.push(notes); }
    if (notes_ml !== undefined) { fields.push('notes_ml = ?'); values.push(notes_ml); }
    if (is_deceased !== undefined) { fields.push('is_deceased = ?'); values.push(is_deceased ? 1 : 0); }
    if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active ? 1 : 0); }

    if (fields.length) {
      values.push(req.params.id);
      await connection.query(
        `UPDATE family_members SET ${fields.join(', ')} WHERE id = ? AND deleted_at IS NULL`,
        values
      );
    }

    // Process relationships update
    if (relationships !== undefined) {
      // Clear old relationships
      await connection.query(
        'DELETE FROM relationships WHERE member_id = ? AND relationship_type IN ("father", "mother", "spouse")',
        [req.params.id]
      );

      if (relationships && relationships.length) {
        // Find family_id if not provided
        let fId = family_id;
        if (!fId) {
          const [[memberData]] = await connection.query('SELECT family_id FROM family_members WHERE id = ?', [req.params.id]);
          fId = memberData?.family_id;
        }

        if (fId) {
          const relValues = relationships.map(r => [
            fId, req.params.id, r.related_member_id, r.relationship_type,
          ]);
          await connection.query(
            'INSERT INTO relationships (family_id, member_id, related_member_id, relationship_type) VALUES ?',
            [relValues]
          );
        }
      }
    }

    await connection.commit();

    await logActivity({
      userId: req.user.id,
      action: 'UPDATE_MEMBER',
      entityType: 'family_members',
      entityId: req.params.id,
      description: 'Updated member',
    });

    const [member] = await pool.query('SELECT * FROM family_members WHERE id = ?', [req.params.id]);
    res.json({ data: member[0] });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
};

exports.remove = async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE family_members SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [req.params.id]
    );

    await logActivity({
      userId: req.user.id,
      action: 'DELETE_MEMBER',
      entityType: 'family_members',
      entityId: req.params.id,
      description: 'Deleted member',
    });

    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getFamilyTree = async (req, res, next) => {
  try {
    const familyId = req.params.familyId;

    const [members] = await pool.query(
      `SELECT id, full_name, nickname, slug, gender, date_of_birth, date_of_death,
        profile_photo, is_deceased
       FROM family_members
       WHERE family_id = ? AND deleted_at IS NULL AND is_active = 1
       ORDER BY date_of_birth ASC`,
      [familyId]
    );

    const [relationships] = await pool.query(
      `SELECT * FROM relationships
       WHERE family_id = ? AND deleted_at IS NULL`,
      [familyId]
    );

    const tree = buildFamilyTree(members, relationships);

    res.json({ data: { members, relationships, tree } });
  } catch (err) {
    next(err);
  }
};

exports.updateProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Profile photo is required' });
    }

    const photoPath = `/uploads/photos/${req.file.filename}`;
    await pool.query(
      'UPDATE family_members SET profile_photo = ? WHERE id = ? AND deleted_at IS NULL',
      [photoPath, req.params.id]
    );

    res.json({ data: { profile_photo: photoPath } });
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ data: [] });
    }

    const [rows] = await pool.query(
      `SELECT m.id, m.full_name, m.slug, m.profile_photo, m.date_of_birth, m.date_of_death,
        f.name as family_name, f.slug as family_slug
       FROM family_members m
       JOIN families f ON f.id = m.family_id
       WHERE m.full_name LIKE ? AND m.deleted_at IS NULL AND m.is_active = 1
       LIMIT 20`,
      [`%${q}%`]
    );

    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

exports.lightCandle = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    await pool.query(
      'UPDATE family_members SET candle_count = candle_count + 1 WHERE id = ? AND deleted_at IS NULL',
      [memberId]
    );
    const [rows] = await pool.query(
      'SELECT candle_count FROM family_members WHERE id = ?',
      [memberId]
    );
    res.json({ data: { candle_count: rows[0] ? rows[0].candle_count : 0 } });
  } catch (err) {
    next(err);
  }
};

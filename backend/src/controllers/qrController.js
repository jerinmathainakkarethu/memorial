const pool = require('../config/database');
const { generateQRCode, generateQRBase64, generateQRFromUrl } = require('../utils/qrGenerator');
const { logActivity } = require('../utils/activityLogger');

exports.generate = async (req, res, next) => {
  try {
    const { member_id } = req.body;

    const [members] = await pool.query(
      `SELECT m.*, f.name as family_name
       FROM family_members m
       JOIN families f ON f.id = m.family_id
       WHERE m.id = ? AND m.deleted_at IS NULL`,
      [member_id]
    );

    if (!members.length) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const member = members[0];
    const domain = process.env.DOMAIN || 'http://localhost:5173';
    const slug = member.slug;

    const existing = await pool.query(
      'SELECT * FROM qr_codes WHERE member_id = ? AND deleted_at IS NULL',
      [member_id]
    );

    let qrData;
    if (existing[0].length) {
      qrData = existing[0][0];
    } else {
      const qr = await generateQRCode(slug, domain);
      const [result] = await pool.query(
        'INSERT INTO qr_codes (family_id, member_id, code, file_path, slug, url, generated_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [member.family_id, member_id, qr.fileName, qr.filePath, slug, qr.url, req.user.id]
      );
      qrData = { id: result.insertId, ...qr };
    }

    await logActivity({
      userId: req.user.id,
      action: 'GENERATE_QR',
      entityType: 'qr_codes',
      entityId: qrData.id || qrData.id,
      description: `Generated QR for ${member.full_name}`,
    });

    res.json({ data: qrData });
  } catch (err) {
    next(err);
  }
};

exports.getForMember = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM qr_codes WHERE member_id = ? AND deleted_at IS NULL',
      [req.params.memberId]
    );
    res.json({ data: rows[0] || null });
  } catch (err) {
    next(err);
  }
};

exports.preview = async (req, res, next) => {
  try {
    const [members] = await pool.query(
      'SELECT slug FROM family_members WHERE id = ? AND deleted_at IS NULL',
      [req.params.memberId]
    );

    if (!members.length) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const domain = process.env.DOMAIN || 'http://localhost:5173';
    const qr = await generateQRBase64(members[0].slug, domain);

    res.json({ data: qr });
  } catch (err) {
    next(err);
  }
};

exports.generateFamily = async (req, res, next) => {
  try {
    const { family_id, site_url } = req.body;
    const [families] = await pool.query(
      'SELECT id, slug, name FROM families WHERE id = ? AND deleted_at IS NULL',
      [family_id]
    );

    if (!families.length) {
      return res.status(404).json({ error: 'Family not found' });
    }

    const family = families[0];
    const origin = site_url || req.headers.origin || `${req.protocol}://${req.get('host')}`;
    const targetUrl = `${origin}/family/${family.slug}`;
    const qr = await generateQRFromUrl(targetUrl);

    res.json({ data: { ...qr, fileName: `qr-${family.slug}.png` } });
  } catch (err) {
    next(err);
  }
};

exports.incrementScan = async (req, res, next) => {
  try {
    await pool.query(
      'UPDATE qr_codes SET scan_count = scan_count + 1, last_scanned_at = NOW() WHERE member_id = ? AND deleted_at IS NULL',
      [req.params.memberId]
    );
    res.json({ message: 'Scan counted' });
  } catch (err) {
    next(err);
  }
};

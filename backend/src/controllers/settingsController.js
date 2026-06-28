const pool = require('../config/database');

exports.getPublicSettings = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT setting_key, setting_value FROM app_settings'
    );

    const settings = {};
    rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });

    res.json({ data: settings });
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT setting_key, setting_value FROM app_settings'
    );

    const settings = {};
    rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });

    res.json({ data: settings });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!key) {
      return res.status(400).json({ error: 'Setting key is required' });
    }

    const [existing] = await pool.query(
      'SELECT id FROM app_settings WHERE setting_key = ?',
      [key]
    );

    if (existing.length) {
      await pool.query(
        'UPDATE app_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
        [value, key]
      );
    } else {
      await pool.query(
        'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?)',
        [key, value]
      );
    }

    res.json({ data: { [key]: value } });
  } catch (err) {
    next(err);
  }
};

exports.updateMultiple = async (req, res, next) => {
  try {
    const entries = req.body;

    if (!entries || typeof entries !== 'object') {
      return res.status(400).json({ error: 'Request body must be an object of key-value pairs' });
    }

    for (const [key, value] of Object.entries(entries)) {
      const [existing] = await pool.query(
        'SELECT id FROM app_settings WHERE setting_key = ?',
        [key]
      );

      if (existing.length) {
        await pool.query(
          'UPDATE app_settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
          [value, key]
        );
      } else {
        await pool.query(
          'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?)',
          [key, value]
        );
      }
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (err) {
    next(err);
  }
};
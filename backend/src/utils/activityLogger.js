const pool = require('../config/database');

async function logActivity({ userId, action, entityType, entityId, description, ipAddress, userAgent }) {
  try {
    await pool.query(
      `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, description, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId || null, action, entityType || null, entityId || null, description || null, ipAddress || null, userAgent || null]
    );
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
}

module.exports = { logActivity };

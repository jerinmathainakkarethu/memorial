module.exports = {
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
  },

  RELATIONSHIP_TYPES: [
    'father', 'mother', 'spouse', 'child', 'sibling',
    'grandfather', 'grandmother', 'grandchild',
    'uncle', 'aunt', 'cousin', 'other',
  ],

  EVENT_TYPES: [
    'birth', 'marriage', 'career', 'education', 'award',
    'retirement', 'death', 'milestone', 'other',
  ],

  VIDEO_TYPES: ['upload', 'youtube'],

  FILE_TYPES: {
    IMAGE: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    VIDEO: ['video/mp4', 'video/webm', 'video/ogg'],
  },

  MAX_FILE_SIZES: {
    IMAGE: 5 * 1024 * 1024,
    VIDEO: 100 * 1024 * 1024,
  },

  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  QR: {
    SIZE: 300,
    COLOR: {
      DARK: '#0F172A',
      LIGHT: '#F8FAFC',
    },
  },

  CANDLE_COLORS: [
    '#D4AF37',
    '#F5E6CC',
    '#FFD700',
    '#FFC0CB',
    '#FFFFFF',
  ],
};

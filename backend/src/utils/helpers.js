const slugify = require('slugify');

function generateSlug(text) {
  return slugify(text, { lower: true, strict: true, trim: true });
}

function calculateAge(birthDate, deathDate = null) {
  const birth = new Date(birthDate);
  const end = deathDate ? new Date(deathDate) : new Date();
  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function paginate(page = 1, limit = 20) {
  const pageNumber = Number.isNaN(Number(page)) ? 1 : Number(page);
  const limitNumber = Number.isNaN(Number(limit)) ? 20 : Number(limit);
  const p = Math.max(1, pageNumber);
  const l = Math.min(100, Math.max(1, limitNumber));
  const offset = (p - 1) * l;
  return { page: p, limit: l, offset };
}

function buildFamilyTree(members, relationships) {
  const memberMap = {};
  members.forEach(m => {
    memberMap[m.id] = { ...m, children: [], spouses: [], parents: [] };
  });

  relationships.forEach(r => {
    const member = memberMap[r.member_id];
    const related = memberMap[r.related_member_id];
    if (!member || !related) return;

    const relatedSummary = {
      id: related.id,
      full_name: related.full_name,
      full_name_ml: related.full_name_ml,
      slug: related.slug,
      gender: related.gender,
      profile_photo: related.profile_photo,
      is_deceased: related.is_deceased
    };

    switch (r.relationship_type) {
      case 'father':
      case 'mother':
        member.parents.push(relatedSummary);
        break;
      case 'child':
        member.children.push(relatedSummary);
        break;
      case 'spouse':
        member.spouses.push(relatedSummary);
        break;
    }
  });

  return Object.values(memberMap);
}

function sanitizeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

module.exports = {
  generateSlug,
  calculateAge,
  paginate,
  buildFamilyTree,
  sanitizeHtml,
};

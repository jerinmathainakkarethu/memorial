const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

// Helper to get media URL pointing to the backend
export function getMediaUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}${path}`;
}

// Request Helper
async function request(endpoint, options = {}, returnRaw = false) {
  const token = localStorage.getItem('family_memorial_token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only set Content-Type to JSON if we are not sending FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error || 'Something went wrong');
  }

  if (returnRaw) {
    return json;
  }

  return json.data !== undefined ? json.data : json;
}

// ==========================================
// PUBLIC API
// ==========================================

export async function fetchPublicFamilies() {
  return request('/families/public');
}

export async function fetchFamilyBySlug(slug) {
  const family = await request(`/families/slug/${slug}`);
  // Fetch family members and relationships tree
  const treeData = await request(`/members/tree/${family.id}`);
  const settings = await request('/settings/public');
  return {
    ...family,
    members: treeData.members || [],
    relationships: treeData.relationships || [],
    tree: treeData.tree || [],
    settings
  };
}

export async function fetchSettings() {
  return request('/settings');
}

export async function updateSetting(key, value) {
  return request(`/settings/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value })
  });
}

export async function fetchMemberBySlug(slug) {
  const member = await request(`/members/slug/${slug}`);
  // Map relationships to shape relatedMembers for UI compatibility
  const relatedMembers = (member.relationships || []).map((r) => ({
    id: r.related_member_id,
    full_name: r.related_name,
    profile_photo: r.related_photo,
    slug: r.related_slug,
    relationship_type: r.relationship_type,
    related_dob: r.related_dob,
    related_dod: r.related_dod
  }));

  return {
    ...member,
    relatedMembers
  };
}

export async function fetchFamilyTree(familyId) {
  return request(`/members/tree/${familyId}`);
}

export async function submitMessage(memberId, data) {
  return request(`/messages/${memberId}`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function lightCandle(memberId) {
  return request(`/members/${memberId}/candle`, {
    method: 'POST'
  });
}

export async function incrementScan(memberId) {
  return request(`/qr/scan/${memberId}`, {
    method: 'POST'
  });
}

// ==========================================
// AUTH API
// ==========================================

export async function loginAdmin(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

// ==========================================
// ADMIN API (Families & Members)
// ==========================================

export async function fetchDashboardStats() {
  const data = await request('/stats/dashboard');
  return {
    total_families: data.stats.total_families,
    total_members: data.stats.total_members,
    total_photos: data.stats.total_photos,
    total_messages: data.stats.total_messages,
    pending_messages: data.stats.pending_messages,
    total_qr_scans: data.stats.total_qr_scans,
    recentMembers: data.recent_members || [],
    recentMessages: data.recent_messages || []
  };
}

export async function fetchAllFamilies() {
  const response = await request('/families?limit=1000&page=1', {}, true);
  return response.data || [];
}

export async function fetchFamiliesPage({ q = '', page = 1, limit = 20 } = {}) {
  const endpoint = `/families?limit=${limit}&page=${page}${q ? `&q=${encodeURIComponent(q)}` : ''}`;
  return request(endpoint, {}, true);
}

export async function createFamily(data) {
  return request('/families', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateFamily(id, data) {
  return request(`/families/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteFamily(id) {
  return request(`/families/${id}`, {
    method: 'DELETE'
  });
}

export async function uploadFamilyCover(id, file) {
  const formData = new FormData();
  formData.append('cover', file);
  return request(`/families/${id}/cover`, {
    method: 'PUT',
    body: formData
  });
}

export async function fetchAllMembers(familyId = null) {
  let endpoint = '/members?limit=1000&page=1';
  if (familyId) endpoint += `&family_id=${familyId}`;
  const response = await request(endpoint, {}, true);
  return response.data || [];
}

export async function fetchMembersPage({ familyId = null, q = '', page = 1, limit = 20 } = {}) {
  let endpoint = `/members?limit=${limit}&page=${page}`;
  if (familyId) endpoint += `&family_id=${familyId}`;
  if (q) endpoint += `&q=${encodeURIComponent(q)}`;
  return request(endpoint, {}, true);
}

export async function fetchMemberById(id) {
  return request(`/members/${id}`);
}

export async function createMember(data) {
  return request('/members', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateMember(id, data) {
  return request(`/members/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteMember(id) {
  return request(`/members/${id}`, {
    method: 'DELETE'
  });
}

export async function uploadMemberPhoto(id, file) {
  const formData = new FormData();
  formData.append('photo', file);
  return request(`/members/${id}/photo`, {
    method: 'PUT',
    body: formData
  });
}

// ==========================================
// ADMIN API (Timeline, Media, Messages, QR)
// ==========================================

export async function fetchTimelineEvents({ memberId = null } = {}) {
  let endpoint = '/timeline?limit=1000&page=1';
  if (memberId) endpoint += `&member_id=${memberId}`;
  const response = await request(endpoint, {}, true);
  return response.data || [];
}

export async function fetchTimelinePage({ memberId = null, q = '', page = 1, limit = 20 } = {}) {
  let endpoint = `/timeline?limit=${limit}&page=${page}`;
  if (memberId) endpoint += `&member_id=${memberId}`;
  if (q) endpoint += `&q=${encodeURIComponent(q)}`;
  return request(endpoint, {}, true);
}

export async function createTimelineEvent(data) {
  return request('/timeline', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateTimelineEvent(id, data) {
  return request(`/timeline/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteTimelineEvent(id) {
  return request(`/timeline/${id}`, {
    method: 'DELETE'
  });
}

export async function fetchMessagesPage({ member_id, is_approved, q = '', page = 1, limit = 20 } = {}) {
  let endpoint = `/messages?limit=${limit}&page=${page}`;
  if (member_id) endpoint += `&member_id=${member_id}`;
  if (is_approved !== undefined) endpoint += `&is_approved=${is_approved}`;
  if (q) endpoint += `&q=${encodeURIComponent(q)}`;
  return request(endpoint, {}, true);
}

export async function fetchAllMessages(filters = {}) {
  const response = await request('/messages?limit=1000&page=1', {}, true);
  return response.data || [];
}

export async function approveMessage(id, isApproved) {
  return request(`/messages/${id}/approve`, {
    method: 'PUT',
    body: JSON.stringify({ is_approved: Boolean(isApproved) })
  });
}

export async function deleteMessage(id) {
  return request(`/messages/${id}`, {
    method: 'DELETE'
  });
}

export async function uploadPhoto(data) {
  const formData = new FormData();
  formData.append('photo', data.file);
  formData.append('family_id', data.family_id);
  if (data.member_id) formData.append('member_id', data.member_id);
  if (data.caption) formData.append('caption', data.caption);
  if (data.alt_text) formData.append('alt_text', data.alt_text);
  if (data.is_cover) formData.append('is_cover', data.is_cover);
  if (data.is_featured) formData.append('is_featured', data.is_featured);

  return request('/media/photos', {
    method: 'POST',
    body: formData
  });
}

export async function deletePhoto(id) {
  return request(`/media/photos/${id}`, {
    method: 'DELETE'
  });
}

export async function fetchMediaPhotos({ familyId = null, memberId = null, q = '', page = 1, limit = 20 } = {}) {
  let endpoint = `/media/photos?limit=${limit}&page=${page}`;
  if (familyId) endpoint += `&family_id=${familyId}`;
  if (memberId) endpoint += `&member_id=${memberId}`;
  if (q) endpoint += `&q=${encodeURIComponent(q)}`;
  return request(endpoint, {}, true);
}

export async function fetchMediaVideos({ familyId = null, memberId = null, q = '', page = 1, limit = 20 } = {}) {
  let endpoint = `/media/videos?limit=${limit}&page=${page}`;
  if (familyId) endpoint += `&family_id=${familyId}`;
  if (memberId) endpoint += `&member_id=${memberId}`;
  if (q) endpoint += `&q=${encodeURIComponent(q)}`;
  return request(endpoint, {}, true);
}

export async function uploadVideo(data) {
  const formData = new FormData();
  formData.append('video', data.file);
  formData.append('family_id', data.family_id);
  if (data.member_id) formData.append('member_id', data.member_id);
  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.is_featured) formData.append('is_featured', data.is_featured);

  return request('/media/videos', {
    method: 'POST',
    body: formData
  });
}

export async function addYouTubeVideo(data) {
  return request('/media/videos/youtube', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function deleteVideo(id) {
  return request(`/media/videos/${id}`, {
    method: 'DELETE'
  });
}

export async function generateQR(memberId) {
  return request('/qr/generate', {
    method: 'POST',
    body: JSON.stringify({ member_id: memberId })
  });
}

export async function generateFamilyQR(familyId, siteUrl) {
  return request('/qr/generate-family', {
    method: 'POST',
    body: JSON.stringify({ family_id: familyId, site_url: siteUrl })
  });
}

export async function previewQR(memberId) {
  return request(`/qr/preview/${memberId}`);
}

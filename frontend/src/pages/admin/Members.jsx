import { useState, useEffect } from 'react';
import { fetchAllMembers, fetchAllFamilies, fetchMembersPage, fetchMemberById, createMember, updateMember, deleteMember, uploadMemberPhoto, getMediaUrl } from '../../utils/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../styles/AdminTable.css';

function AdminMembers() {
  const [members, setMembers] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });

  // Form State
  const [form, setForm] = useState({
    family_id: '',
    full_name: '',
    full_name_ml: '',
    nickname: '',
    nickname_ml: '',
    gender: 'male',
    date_of_birth: '',
    date_of_death: '',
    place_of_birth: '',
    place_of_death: '',
    biography: '',
    biography_ml: '',
    occupation: '',
    occupation_ml: '',
    education: '',
    education_ml: '',
    awards: '',
    awards_ml: '',
    hobbies: '',
    hobbies_ml: '',
    religion: '',
    religion_ml: '',
    notes: '',
    notes_ml: '',
    is_deceased: false,
    is_active: true,
    father_id: '',
    mother_id: '',
    spouse_id: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadSelectData = async () => {
    try {
      const [mems, fams] = await Promise.all([fetchAllMembers(), fetchAllFamilies()]);
      setAllMembers(mems);
      setFamilies(fams);
    } catch (err) {
      console.error(err);
    }
  };

  const loadMembersList = async ({ q = search, page = 1 } = {}) => {
    setLoading(true);
    try {
      const response = await fetchMembersPage({ q, page, limit: 20 });
      setMembers(response.data || []);
      setPagination(response.pagination || { page: 1, pages: 1, total: 0, limit: 20 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSelectData();
  }, []);

  useEffect(() => {
    loadMembersList({ q: searchTerm, page });
  }, [searchTerm, page]);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setForm({
      family_id: families[0]?.id || '',
      full_name: '',
      full_name_ml: '',
      nickname: '',
      nickname_ml: '',
      gender: 'male',
      date_of_birth: '',
      date_of_death: '',
      place_of_birth: '',
      place_of_death: '',
      biography: '',
      biography_ml: '',
      occupation: '',
      occupation_ml: '',
      education: '',
      education_ml: '',
      awards: '',
      awards_ml: '',
      hobbies: '',
      hobbies_ml: '',
      religion: '',
      religion_ml: '',
      notes: '',
      notes_ml: '',
      is_deceased: false,
      is_active: true,
      father_id: '',
      mother_id: '',
      spouse_id: ''
    });
    setPhotoFile(null);
    setError('');
    setModalOpen(true);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(search);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleOpenEdit = async (member) => {
    try {
      const detailedMember = await fetchMemberById(member.id);
      setEditingMember(detailedMember);

      const fatherId = detailedMember.relationships?.find(r => r.relationship_type === 'father')?.related_member_id || '';
      const motherId = detailedMember.relationships?.find(r => r.relationship_type === 'mother')?.related_member_id || '';
      const spouseId = detailedMember.relationships?.find(r => r.relationship_type === 'spouse')?.related_member_id || '';

      setForm({
      family_id: detailedMember.family_id || '',
      full_name: detailedMember.full_name || '',
      full_name_ml: detailedMember.full_name_ml || '',
      nickname: detailedMember.nickname || '',
      nickname_ml: detailedMember.nickname_ml || '',
      gender: detailedMember.gender || 'male',
      date_of_birth: detailedMember.date_of_birth ? detailedMember.date_of_birth.substring(0, 10) : '',
      date_of_death: detailedMember.date_of_death ? detailedMember.date_of_death.substring(0, 10) : '',
      place_of_birth: detailedMember.place_of_birth || '',
      place_of_death: detailedMember.place_of_death || '',
      biography: detailedMember.biography || '',
      biography_ml: detailedMember.biography_ml || '',
      occupation: detailedMember.occupation || '',
      occupation_ml: detailedMember.occupation_ml || '',
      education: detailedMember.education || '',
      education_ml: detailedMember.education_ml || '',
      awards: detailedMember.awards || '',
      awards_ml: detailedMember.awards_ml || '',
      hobbies: detailedMember.hobbies || '',
      hobbies_ml: detailedMember.hobbies_ml || '',
      religion: detailedMember.religion || '',
      religion_ml: detailedMember.religion_ml || '',
      notes: detailedMember.notes || '',
      notes_ml: detailedMember.notes_ml || '',
      is_deceased: !!detailedMember.is_deceased,
      is_active: !!detailedMember.is_active,
      father_id: fatherId,
      mother_id: motherId,
      spouse_id: spouseId
    });
    setPhotoFile(null);
    setError('');
    setModalOpen(true);
  } catch (err) {
    console.error('Failed to load member details', err);
    alert('Unable to load member details. Please try again.');
  }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await deleteMember(id);
      loadMembersList({ q: search, page });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // Compile relationships
      const relationships = [];
      if (form.father_id) relationships.push({ related_member_id: Number(form.father_id), relationship_type: 'father' });
      if (form.mother_id) relationships.push({ related_member_id: Number(form.mother_id), relationship_type: 'mother' });
      if (form.spouse_id) relationships.push({ related_member_id: Number(form.spouse_id), relationship_type: 'spouse' });

      const memberPayload = {
        family_id: Number(form.family_id),
        full_name: form.full_name,
        full_name_ml: form.full_name_ml,
        nickname: form.nickname,
        nickname_ml: form.nickname_ml,
        gender: form.gender,
        date_of_birth: form.date_of_birth || null,
        date_of_death: form.date_of_death || null,
        place_of_birth: form.place_of_birth,
        place_of_death: form.place_of_death,
        biography: form.biography,
        biography_ml: form.biography_ml,
        occupation: form.occupation,
        occupation_ml: form.occupation_ml,
        education: form.education,
        education_ml: form.education_ml,
        awards: form.awards,
        awards_ml: form.awards_ml,
        hobbies: form.hobbies,
        hobbies_ml: form.hobbies_ml,
        religion: form.religion,
        religion_ml: form.religion_ml,
        notes: form.notes,
        notes_ml: form.notes_ml,
        is_deceased: form.is_deceased,
        is_active: form.is_active,
        relationships
      };

      let savedMember;
      if (editingMember) {
        savedMember = await updateMember(editingMember.id, memberPayload);
      } else {
        savedMember = await createMember(memberPayload);
      }

      // Handle photo upload if present
      if (photoFile) {
        await uploadMemberPhoto(savedMember.id || editingMember.id, photoFile);
      }

      setModalOpen(false);
      loadMembersList({ q: search, page });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter possible fathers, mothers, and spouses based on gender for selection options
  const maleOptions = allMembers.filter(m => m.gender === 'male' && (!editingMember || m.id !== editingMember.id));
  const femaleOptions = allMembers.filter(m => m.gender === 'female' && (!editingMember || m.id !== editingMember.id));
  const spouseOptions = allMembers.filter(m => !editingMember || m.id !== editingMember.id);

  const columns = [
    { key: 'full_name', label: 'Name' },
    { key: 'full_name_ml', label: 'Name (Malayalam)', render: (row) => row.full_name_ml || '-' },
    { key: 'family_name', label: 'Family' },
    { key: 'occupation', label: 'Occupation', render: (row) => row.occupation || '-' },
    {
      key: 'profile_photo',
      label: 'Photo',
      width: '80px',
      render: (row) => row.profile_photo ? (
        <img 
          src={getMediaUrl(row.profile_photo)} 
          alt="avatar" 
          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} 
        />
      ) : '-'
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (row) => row.is_deceased ? <Badge variant="danger">Deceased</Badge> : <Badge variant="success">Living</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '180px',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(row)}>Edit</Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(row.id)}>Delete</Button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-members">
      <div className="page-header">
        <h1 className="page-title">Members</h1>
        <Button onClick={handleOpenAdd}>Add Member</Button>
      </div>

      <Card>
        <div className="admin-toolbar">
          <form className="admin-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search members..."
              autoComplete="off"
              spellCheck="false"
            />
            <Button type="submit" size="sm" variant="outline">Search</Button>
          </form>
        </div>
        <Table columns={columns} data={members} />
        <div className="admin-pagination">
          <span>
            Page {pagination.page} of {pagination.pages} ({pagination.total} members)
          </span>
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
            Previous
          </Button>
          <Button size="sm" variant="outline" disabled={page >= pagination.pages} onClick={() => handlePageChange(page + 1)}>
            Next
          </Button>
        </div>
      </Card>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <Modal.Header>{editingMember ? 'Edit Family Member' : 'Add New Family Member'}</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit} className="admin-form">
              {error && <div className="form-error">{error}</div>}

              <div className="form-grid">
                {/* Family select */}
                <div className="form-group">
                  <label>Family Lineage</label>
                  <select
                    value={form.family_id}
                    onChange={(e) => setForm({ ...form, family_id: e.target.value })}
                    required
                    className="form-input"
                  >
                    {families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>

                {/* Gender */}
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="form-input"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* English Name */}
                <div className="form-group">
                  <label>Full Name (English)</label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                {/* Malayalam Name */}
                <div className="form-group">
                  <label>Full Name (Malayalam)</label>
                  <input
                    type="text"
                    value={form.full_name_ml}
                    onChange={(e) => setForm({ ...form, full_name_ml: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Nicknames */}
                <div className="form-group">
                  <label>Nickname (English)</label>
                  <input
                    type="text"
                    value={form.nickname}
                    onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Nickname (Malayalam)</label>
                  <input
                    type="text"
                    value={form.nickname_ml}
                    onChange={(e) => setForm({ ...form, nickname_ml: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Dates */}
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={form.date_of_birth}
                    onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Death (If deceased)</label>
                  <input
                    type="date"
                    value={form.date_of_death}
                    onChange={(e) => setForm({ ...form, date_of_death: e.target.value })}
                    disabled={!form.is_deceased}
                    className="form-input"
                  />
                </div>

                {/* Places */}
                <div className="form-group">
                  <label>Place of Birth</label>
                  <input
                    type="text"
                    value={form.place_of_birth}
                    onChange={(e) => setForm({ ...form, place_of_birth: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Place of Death</label>
                  <input
                    type="text"
                    value={form.place_of_death}
                    onChange={(e) => setForm({ ...form, place_of_death: e.target.value })}
                    disabled={!form.is_deceased}
                    className="form-input"
                  />
                </div>

                {/* Occupations */}
                <div className="form-group">
                  <label>Occupation (English)</label>
                  <input
                    type="text"
                    value={form.occupation}
                    onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Occupation (Malayalam)</label>
                  <input
                    type="text"
                    value={form.occupation_ml}
                    onChange={(e) => setForm({ ...form, occupation_ml: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Biography */}
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Biography (English)</label>
                  <textarea
                    value={form.biography}
                    onChange={(e) => setForm({ ...form, biography: e.target.value })}
                    rows={4}
                    className="form-textarea"
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Biography (Malayalam)</label>
                  <textarea
                    value={form.biography_ml}
                    onChange={(e) => setForm({ ...form, biography_ml: e.target.value })}
                    rows={4}
                    className="form-textarea"
                  />
                </div>

                {/* Relationships configuration */}
                <div className="form-group" style={{ gridColumn: 'span 2', borderTop: '1px solid #E2E8F0', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <h4 style={{ color: '#0F172A', marginBottom: '8px' }}>Family Relationships</h4>
                </div>

                <div className="form-group">
                  <label>Father</label>
                  <select
                    value={form.father_id}
                    onChange={(e) => setForm({ ...form, father_id: e.target.value })}
                    className="form-input"
                  >
                    <option value="">-- Select Father --</option>
                    {maleOptions.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Mother</label>
                  <select
                    value={form.mother_id}
                    onChange={(e) => setForm({ ...form, mother_id: e.target.value })}
                    className="form-input"
                  >
                    <option value="">-- Select Mother --</option>
                    {femaleOptions.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Spouse</label>
                  <select
                    value={form.spouse_id}
                    onChange={(e) => setForm({ ...form, spouse_id: e.target.value })}
                    className="form-input"
                  >
                    <option value="">-- Select Spouse --</option>
                    {spouseOptions.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                  </select>
                </div>

                {/* Profile photo */}
                <div className="form-group">
                  <label>Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files[0])}
                    className="form-input"
                  />
                </div>

                {/* Deceased / Active */}
                <div className="form-group checkbox-group" style={{ display: 'flex', gap: '20px', gridColumn: 'span 2' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="checkbox"
                      checked={form.is_deceased}
                      onChange={(e) => setForm({ ...form, is_deceased: e.target.checked })}
                    />
                    Deceased (Departed)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default AdminMembers;

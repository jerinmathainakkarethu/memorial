import { useState, useEffect } from 'react';
import { fetchFamiliesPage, createFamily, updateFamily, deleteFamily, uploadFamilyCover, getMediaUrl, generateFamilyQR } from '../../utils/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../styles/AdminTable.css';

function Families() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  
  // Form State
  const [form, setForm] = useState({
    name: '',
    name_ml: '',
    motto: '',
    motto_ml: '',
    description: '',
    description_ml: '',
    is_active: true
  });
  
  const [coverFile, setCoverFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [qrLoading, setQrLoading] = useState(null);

  const loadFamilies = async ({ q = searchTerm, page = 1 } = {}) => {
    setLoading(true);
    try {
      const response = await fetchFamiliesPage({ q, page, limit: 20 });
      setFamilies(response.data || []);
      setPagination(response.pagination || { page: 1, pages: 1, total: 0, limit: 20 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFamilies({ q: searchTerm, page });
  }, [searchTerm, page]);

  const handleOpenAdd = () => {
    setEditingFamily(null);
    setForm({
      name: '',
      name_ml: '',
      motto: '',
      motto_ml: '',
      description: '',
      description_ml: '',
      is_active: true
    });
    setCoverFile(null);
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (family) => {
    setEditingFamily(family);
    setForm({
      name: family.name || '',
      name_ml: family.name_ml || '',
      motto: family.motto || '',
      motto_ml: family.motto_ml || '',
      description: family.description || '',
      description_ml: family.description_ml || '',
      is_active: !!family.is_active
    });
    setCoverFile(null);
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this family? All linked members will be deleted.')) return;
    try {
      await deleteFamily(id);
      loadFamilies({ q: search, page });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGenerateFamilyQR = async (family) => {
    setQrLoading(family.id);
    try {
      const data = await generateFamilyQR(family.id, window.location.origin);
      const link = document.createElement('a');
      link.href = data.qrDataUrl;
      link.download = `qr-${family.slug}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert(err.message || 'Failed to generate QR code');
    } finally {
      setQrLoading(null);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      let savedFamily;
      if (editingFamily) {
        savedFamily = await updateFamily(editingFamily.id, form);
      } else {
        savedFamily = await createFamily(form);
      }

      // Handle file upload if present
      if (coverFile) {
        await uploadFamilyCover(savedFamily.id || editingFamily.id, coverFile);
      }

      setModalOpen(false);
      loadFamilies({ q: search, page });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'name_ml', label: 'Name (Malayalam)', render: (row) => row.name_ml || '-' },
    { key: 'motto', label: 'Motto', render: (row) => row.motto || '-' },
    { key: 'member_count', label: 'Members', width: '100px' },
    {
      key: 'cover_photo',
      label: 'Cover',
      width: '120px',
      render: (row) => row.cover_photo ? (
        <img 
          src={getMediaUrl(row.cover_photo)} 
          alt="cover" 
          style={{ width: '80px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
        />
      ) : '-'
    },
    {
      key: 'status',
      label: 'Status',
      width: '100px',
      render: (row) => row.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '180px',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="sm" variant="secondary" onClick={() => handleOpenEdit(row)}>Edit</Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(row.id)}>Delete</Button>
          <Button
            size="sm"
            variant="primary"
            disabled={qrLoading === row.id}
            onClick={() => handleGenerateFamilyQR(row)}
          >
            {qrLoading === row.id ? 'Generating...' : 'Download QR'}
          </Button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-families">
      <div className="page-header">
        <h1 className="page-title">Families</h1>
        <Button onClick={handleOpenAdd}>Add Family</Button>
      </div>
      
      <Card>
        <div className="admin-toolbar">
          <form className="admin-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search families..."
              autoComplete="off"
              spellCheck="false"
            />
            <Button type="submit" size="sm" variant="outline">Search</Button>
          </form>
        </div>
        <Table columns={columns} data={families} />
        <div className="admin-pagination">
          <span>
            Page {pagination.page} of {pagination.pages} ({pagination.total} families)
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
          <Modal.Header>{editingFamily ? 'Edit Family' : 'Add New Family'}</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit} className="admin-form">
              {error && <div className="form-error">{error}</div>}
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Family Name (English)</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Family Name (Malayalam)</label>
                  <input
                    type="text"
                    value={form.name_ml}
                    onChange={(e) => setForm({ ...form, name_ml: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Motto (English)</label>
                  <input
                    type="text"
                    value={form.motto}
                    onChange={(e) => setForm({ ...form, motto: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Motto (Malayalam)</label>
                  <input
                    type="text"
                    value={form.motto_ml}
                    onChange={(e) => setForm({ ...form, motto_ml: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Description (English)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="form-textarea"
                  />
                </div>
                
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Description (Malayalam)</label>
                  <textarea
                    value={form.description_ml}
                    onChange={(e) => setForm({ ...form, description_ml: e.target.value })}
                    rows={3}
                    className="form-textarea"
                  />
                </div>

                <div className="form-group">
                  <label>Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files[0])}
                    className="form-input"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
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

export default Families;

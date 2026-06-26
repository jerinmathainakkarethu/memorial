import { useState, useEffect } from 'react';
import { fetchTimelinePage, createTimelineEvent, updateTimelineEvent, deleteTimelineEvent, fetchAllMembers } from '../../utils/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../styles/AdminTable.css';

function AdminTimeline() {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });

  // Form State
  const [form, setForm] = useState({
    member_id: '',
    title: '',
    title_ml: '',
    description: '',
    description_ml: '',
    event_date: '',
    event_year: '',
    event_type: 'milestone',
    is_featured: false
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const mems = await fetchAllMembers();
      setMembers(mems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async ({ q = search, page = 1 } = {}) => {
    setLoading(true);
    try {
      const response = await fetchTimelinePage({ q, page, limit: 20 });
      setEvents(response.data || []);
      setPagination(response.pagination || { page: 1, pages: 1, total: 0, limit: 20 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadEvents({ q: searchTerm, page });
  }, [searchTerm, page]);

  const handleOpenAdd = () => {
    setEditingEvent(null);
    setForm({
      member_id: members[0]?.id || '',
      title: '',
      title_ml: '',
      description: '',
      description_ml: '',
      event_date: '',
      event_year: '',
      event_type: 'milestone',
      is_featured: false
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setForm({
      member_id: event.member_id || '',
      title: event.title || '',
      title_ml: event.title_ml || '',
      description: event.description || '',
      description_ml: event.description_ml || '',
      event_date: event.event_date ? event.event_date.substring(0, 10) : '',
      event_year: event.event_year || '',
      event_type: event.event_type || 'milestone',
      is_featured: !!event.is_featured
    });
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await deleteTimelineEvent(id);
      loadEvents({ q: search, page });
    } catch (err) {
      alert(err.message);
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
      const payload = {
        member_id: Number(form.member_id),
        title: form.title,
        title_ml: form.title_ml,
        description: form.description,
        description_ml: form.description_ml,
        event_date: form.event_date || null,
        event_year: form.event_year ? Number(form.event_year) : null,
        event_type: form.event_type,
        is_featured: form.is_featured
      };

      if (editingEvent) {
        await updateTimelineEvent(editingEvent.id, payload);
      } else {
        await createTimelineEvent(payload);
      }

      setModalOpen(false);
      loadEvents({ q: search, page });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'member_name', label: 'Member' },
    { key: 'title', label: 'Event Title' },
    { key: 'title_ml', label: 'Title (Malayalam)', render: (row) => row.title_ml || '-' },
    {
      key: 'event_date',
      label: 'Date/Year',
      render: (row) => row.event_date ? new Date(row.event_date).toLocaleDateString() : row.event_year || '-'
    },
    {
      key: 'event_type',
      label: 'Type',
      width: '120px',
      render: (row) => <Badge variant="info">{row.event_type}</Badge>
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
    <div className="admin-timeline">
      <div className="page-header">
        <h1 className="page-title">Timeline Events</h1>
        <Button onClick={handleOpenAdd}>Add Event</Button>
      </div>

      <Card>
        <div className="admin-toolbar">
          <form className="admin-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search timeline events..."
              autoComplete="off"
              spellCheck="false"
            />
            <Button type="submit" size="sm" variant="outline">Search</Button>
          </form>
        </div>
        <Table columns={columns} data={events} />
        <div className="admin-pagination">
          <span>
            Page {pagination.page} of {pagination.pages} ({pagination.total} events)
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
          <Modal.Header>{editingEvent ? 'Edit Timeline Event' : 'Add New Timeline Event'}</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit} className="admin-form">
              {error && <div className="form-error">{error}</div>}

              <div className="form-grid">
                <div className="form-group">
                  <label>Family Member</label>
                  <select
                    value={form.member_id}
                    onChange={(e) => setForm({ ...form, member_id: e.target.value })}
                    required
                    className="form-input"
                  >
                    {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Event Type</label>
                  <select
                    value={form.event_type}
                    onChange={(e) => setForm({ ...form, event_type: e.target.value })}
                    className="form-input"
                  >
                    <option value="birth">Birth</option>
                    <option value="marriage">Marriage</option>
                    <option value="career">Career Milestone</option>
                    <option value="education">Education</option>
                    <option value="award">Award / Recognition</option>
                    <option value="retirement">Retirement</option>
                    <option value="death">Death</option>
                    <option value="milestone">General Milestone</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Event Title (English)</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Event Title (Malayalam)</label>
                  <input
                    type="text"
                    value={form.title_ml}
                    onChange={(e) => setForm({ ...form, title_ml: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Event Date</label>
                  <input
                    type="date"
                    value={form.event_date}
                    onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Event Year (As backup or if exact date is unknown)</label>
                  <input
                    type="number"
                    value={form.event_year}
                    onChange={(e) => setForm({ ...form, event_year: e.target.value })}
                    placeholder="e.g. 1975"
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

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    />
                    Featured Event
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

export default AdminTimeline;

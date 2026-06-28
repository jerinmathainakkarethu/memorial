import { useState, useEffect } from 'react';
import { fetchUsersPage, createUser, updateUser, deleteUser } from '../../utils/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../styles/AdminTable.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    is_active: true
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async ({ q = searchTerm, page = 1 } = {}) => {
    setLoading(true);
    try {
      const response = await fetchUsersPage({ q, page, limit: 20 });
      setUsers(response.data || []);
      setPagination(response.pagination || { page: 1, pages: 1, total: 0, limit: 20 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers({ q: searchTerm, page });
  }, [searchTerm, page]);

  const handleOpenAdd = () => {
    setEditingUser(null);
    setForm({
      name: '',
      email: '',
      password: '',
      role: 'admin',
      is_active: true
    });
    setError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'admin',
      is_active: !!user.is_active
    });
    setError('');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      loadUsers({ q: search, page });
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
      if (editingUser) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        await updateUser(editingUser.id, payload);
      } else {
        if (!form.password) {
          setError('Password is required');
          setSubmitting(false);
          return;
        }
        await createUser(form);
      }

      setModalOpen(false);
      loadUsers({ q: search, page });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Role',
      width: '130px',
      render: (row) => (
        <Badge variant={row.role === 'super_admin' ? 'info' : 'default'}>
          {row.role === 'super_admin' ? 'Super Admin' : 'Admin'}
        </Badge>
      )
    },
    {
      key: 'is_active',
      label: 'Status',
      width: '100px',
      render: (row) => row.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge>
    },
    {
      key: 'last_login_at',
      label: 'Last Login',
      render: (row) => row.last_login_at ? new Date(row.last_login_at).toLocaleDateString() : 'Never'
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '140px',
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
    <div className="admin-users">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <Button onClick={handleOpenAdd}>Add User</Button>
      </div>

      <Card>
        <div className="admin-toolbar">
          <form className="admin-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search users..."
              autoComplete="off"
              spellCheck="false"
            />
            <Button type="submit" size="sm" variant="outline">Search</Button>
          </form>
        </div>
        <Table columns={columns} data={users} />
        <div className="admin-pagination">
          <span>
            Page {pagination.page} of {pagination.pages} ({pagination.total} users)
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
          <Modal.Header>{editingUser ? 'Edit User' : 'Add New User'}</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit} className="admin-form">
              {error && <div className="form-error">{error}</div>}

              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Password {editingUser && '(leave blank to keep current)'}</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={!editingUser}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="form-input"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
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

export default Users;

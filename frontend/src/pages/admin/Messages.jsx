import { useState, useEffect } from 'react';
import { fetchMessagesPage, approveMessage, deleteMessage } from '../../utils/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../styles/AdminTable.css';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });

  const loadMessages = async ({ q = search, page = 1 } = {}) => {
    setLoading(true);
    try {
      const response = await fetchMessagesPage({ q, page, limit: 20 });
      setMessages(response.data || []);
      setPagination(response.pagination || { page: 1, pages: 1, total: 0, limit: 20 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages({ q: searchTerm, page });
  }, [searchTerm, page]);

  const handleToggleApprove = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await approveMessage(id, newStatus);
      loadMessages({ q: search, page });
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteMessage(id);
      loadMessages();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    { key: 'visitor_name', label: 'Visitor' },
    { key: 'member_name', label: 'Memorial Member' },
    { key: 'message', label: 'Message' },
    {
      key: 'created_at',
      label: 'Date',
      width: '120px',
      render: (row) => new Date(row.created_at).toLocaleDateString()
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (row) => row.is_approved ? <Badge variant="success">Approved</Badge> : <Badge variant="warning">Pending</Badge>,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '200px',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button 
            size="sm" 
            variant={row.is_approved ? 'outline' : 'primary'}
            onClick={() => handleToggleApprove(row.id, row.is_approved)}
          >
            {row.is_approved ? 'Reject' : 'Approve'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleDelete(row.id)}>Delete</Button>
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-messages">
      <div className="page-header">
        <h1 className="page-title">Memorial Messages</h1>
      </div>
      <Card>
        <div className="admin-toolbar">
          <form className="admin-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search messages..."
              autoComplete="off"
              spellCheck="false"
            />
            <Button type="submit" size="sm" variant="outline">Search</Button>
          </form>
        </div>
        <Table columns={columns} data={messages} />
        <div className="admin-pagination">
          <span>
            Page {pagination.page} of {pagination.pages} ({pagination.total} messages)
          </span>
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>
            Previous
          </Button>
          <Button size="sm" variant="outline" disabled={page >= pagination.pages} onClick={() => handlePageChange(page + 1)}>
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Messages;

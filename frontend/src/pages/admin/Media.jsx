import { useState, useEffect } from 'react';
import { 
  fetchAllMembers, fetchAllFamilies, 
  fetchMediaPhotos, fetchMediaVideos,
  uploadPhoto, uploadVideo, addYouTubeVideo, 
  deletePhoto, deleteVideo, generateQR, previewQR, getMediaUrl 
} from '../../utils/api';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import '../../styles/AdminTable.css';

function AdminMedia() {
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'qr'
  const [members, setMembers] = useState([]);
  const [families, setFamilies] = useState([]);
  const [mediaList, setMediaList] = useState([]);
  const [mediaSearch, setMediaSearch] = useState('');
  const [mediaPage, setMediaPage] = useState(1);
  const [mediaPagination, setMediaPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });
  const [loading, setLoading] = useState(true);
  
  // Upload Photo Modal
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [photoForm, setPhotoForm] = useState({ family_id: '', member_id: '', caption: '', alt_text: '', is_cover: false, is_featured: false });
  const [photoFile, setPhotoFile] = useState(null);

  // Upload Video Modal
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoForm, setVideoForm] = useState({ family_id: '', member_id: '', title: '', description: '', is_featured: false, type: 'upload', youtube_url: '' });
  const [videoFile, setVideoFile] = useState(null);

  // QR Code Preview Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrPreviewData, setQrPreviewData] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [mems, fams] = await Promise.all([fetchAllMembers(), fetchAllFamilies()]);
      setMembers(mems);
      setFamilies(fams);

      const [photoResponse, videoResponse] = await Promise.all([
        fetchMediaPhotos({ page: 1, limit: 1000 }),
        fetchMediaVideos({ page: 1, limit: 1000 })
      ]);

      const photos = photoResponse.data || [];
      const videos = (videoResponse.data || []).map((v) => ({
        ...v,
        type: v.video_type || 'video'
      }));

      const compiledMedia = [
        ...photos.map((p) => ({ ...p, type: 'image' })),
        ...videos
      ];

      setMediaList(compiledMedia);
      setMediaPagination({
        page: 1,
        pages: Math.max(1, Math.ceil(compiledMedia.length / 20)),
        total: compiledMedia.length,
        limit: 20
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenPhoto = () => {
    setPhotoForm({
      family_id: families[0]?.id || '',
      member_id: members[0]?.id || '',
      caption: '',
      alt_text: '',
      is_cover: false,
      is_featured: false
    });
    setPhotoFile(null);
    setError('');
    setPhotoModalOpen(true);
  };

  const handleOpenVideo = () => {
    setVideoForm({
      family_id: families[0]?.id || '',
      member_id: members[0]?.id || '',
      title: '',
      description: '',
      is_featured: false,
      type: 'upload',
      youtube_url: ''
    });
    setVideoFile(null);
    setError('');
    setVideoModalOpen(true);
  };

  const handlePhotoSubmit = async (e) => {
    e.preventDefault();
    if (!photoFile) {
      setError('Please select an image file to upload.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await uploadPhoto({
        file: photoFile,
        ...photoForm
      });
      setPhotoModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (videoForm.type === 'youtube') {
        await addYouTubeVideo({
          family_id: Number(videoForm.family_id),
          member_id: Number(videoForm.member_id),
          title: videoForm.title,
          description: videoForm.description,
          youtube_url: videoForm.youtube_url,
          is_featured: videoForm.is_featured
        });
      } else {
        if (!videoFile) {
          setError('Please select an MP4 video file to upload.');
          setSubmitting(false);
          return;
        }
        await uploadVideo({
          file: videoFile,
          family_id: Number(videoForm.family_id),
          member_id: Number(videoForm.member_id),
          title: videoForm.title,
          description: videoForm.description,
          is_featured: videoForm.is_featured
        });
      }
      setVideoModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMedia = async (row) => {
    if (!window.confirm('Are you sure you want to delete this media asset?')) return;
    try {
      if (row.type === 'image') {
        await deletePhoto(row.id);
      } else {
        await deleteVideo(row.id);
      }
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGenerateQR = async (memberId) => {
    try {
      await generateQR(memberId);
      loadData();
      alert('QR Code generated successfully!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMediaSearchChange = (e) => {
    setMediaSearch(e.target.value);
    setMediaPage(1);
  };

  const handleMediaPageChange = (newPage) => {
    setMediaPage(newPage);
  };

  const handlePreviewQR = async (member) => {
    try {
      const data = await previewQR(member.id);
      setQrPreviewData({
        member,
        qrDataUrl: data.qrDataUrl,
        url: data.url
      });
      setQrModalOpen(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const columnsLibrary = [
    { 
      key: 'preview', 
      label: 'Preview', 
      width: '100px',
      render: (row) => {
        if (row.type === 'image') {
          return (
            <img 
              src={getMediaUrl(row.file_path)} 
              alt="thumb" 
              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
            />
          );
        } else if (row.video_type === 'youtube') {
          return (
            <img 
              src={row.thumbnail} 
              alt="youtube-thumb" 
              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} 
            />
          );
        }
        return <span style={{ fontSize: '20px' }}>🎬</span>;
      }
    },
    { key: 'member_name', label: 'Belongs To' },
    { key: 'caption', label: 'Caption / Title', render: (row) => row.caption || row.title || '-' },
    {
      key: 'type',
      label: 'Type',
      width: '100px',
      render: (row) => <Badge variant={row.type === 'image' ? 'info' : 'warning'}>{row.type}</Badge>
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (row) => (
        <Button size="sm" variant="outline" onClick={() => handleDeleteMedia(row)}>Delete</Button>
      )
    }
  ];

  // QR Code Manager columns (only deceased members get QRs)
  const filteredMedia = mediaList.filter((item) => {
    if (!mediaSearch) return true;
    const term = mediaSearch.toLowerCase();
    return (
      item.member_name?.toLowerCase().includes(term) ||
      item.caption?.toLowerCase().includes(term) ||
      item.title?.toLowerCase().includes(term) ||
      item.type?.toLowerCase().includes(term)
    );
  });

  const mediaTotal = filteredMedia.length;
  const mediaPages = Math.max(1, Math.ceil(mediaTotal / 20));
  const pagedMedia = filteredMedia.slice((mediaPage - 1) * 20, mediaPage * 20);
  const deceasedMembers = members.filter(m => m.is_deceased);

  useEffect(() => {
    if (mediaPage > mediaPages) {
      setMediaPage(mediaPages);
    }
  }, [mediaPage, mediaPages]);

  const columnsQR = [
    { key: 'full_name', label: 'Deceased Member' },
    { key: 'family_name', label: 'Family' },
    {
      key: 'qr_status',
      label: 'QR Code',
      width: '120px',
      render: (row) => row.qr_codes && row.qr_codes.length > 0 ? (
        <Badge variant="success">Generated</Badge>
      ) : (
        <Badge variant="danger">Not Found</Badge>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '240px',
      render: (row) => {
        const hasQR = row.qr_codes && row.qr_codes.length > 0;
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            {!hasQR ? (
              <Button size="sm" onClick={() => handleGenerateQR(row.id)}>Generate</Button>
            ) : (
              <>
                <Button size="sm" variant="secondary" onClick={() => handlePreviewQR(row)}>Preview</Button>
                <a 
                  href={getMediaUrl(row.qr_codes[0].file_path)} 
                  download={`qr-${row.slug}.png`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button size="sm" variant="outline">Download</Button>
                </a>
              </>
            )}
          </div>
        );
      }
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="admin-media">
      {/* Navigation tabs */}
      <div className="tab-navigation" style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
        <button 
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'library' ? '#0f172a' : 'transparent',
            color: activeTab === 'library' ? '#fff' : '#64748b',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
          onClick={() => setActiveTab('library')}
        >
          Media Library
        </button>
        <button 
          style={{
            padding: '8px 16px',
            backgroundColor: activeTab === 'qr' ? '#0f172a' : 'transparent',
            color: activeTab === 'qr' ? '#fff' : '#64748b',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
          onClick={() => setActiveTab('qr')}
        >
          QR Code Manager
        </button>
      </div>

      {activeTab === 'library' ? (
        <>
          <div className="page-header">
            <h1 className="page-title">Media Library</h1>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button onClick={handleOpenPhoto}>Upload Photo</Button>
              <Button onClick={handleOpenVideo} variant="secondary">Add Video</Button>
            </div>
          </div>
          
          <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <input
              type="text"
              value={mediaSearch}
              onChange={handleMediaSearchChange}
              placeholder="Search media..."
              style={{ width: '320px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
            />
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: '#475569' }}>
                Page {mediaPage} of {mediaPages} ({mediaTotal} items)
              </span>
              <Button size="sm" variant="outline" disabled={mediaPage <= 1} onClick={() => handleMediaPageChange(mediaPage - 1)}>
                Previous
              </Button>
              <Button size="sm" variant="outline" disabled={mediaPage >= mediaPages} onClick={() => handleMediaPageChange(mediaPage + 1)}>
                Next
              </Button>
            </div>
          </div>
          <Table columns={columnsLibrary} data={pagedMedia} />
        </Card>
        </>
      ) : (
        <>
          <div className="page-header">
            <h1 className="page-title">QR Code Generator</h1>
          </div>
          
          <Card>
            <Table columns={columnsQR} data={deceasedMembers} />
          </Card>
        </>
      )}

      {/* Upload Photo Modal */}
      {photoModalOpen && (
        <Modal onClose={() => setPhotoModalOpen(false)}>
          <Modal.Header>Upload Photo</Modal.Header>
          <Modal.Body>
            <form onSubmit={handlePhotoSubmit} className="admin-form">
              {error && <div className="form-error">{error}</div>}

              <div className="form-grid">
                <div className="form-group">
                  <label>Family</label>
                  <select
                    value={photoForm.family_id}
                    onChange={(e) => setPhotoForm({ ...photoForm, family_id: e.target.value })}
                    required
                    className="form-input"
                  >
                    {families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Belongs to Member</label>
                  <select
                    value={photoForm.member_id}
                    onChange={(e) => setPhotoForm({ ...photoForm, member_id: e.target.value })}
                    required
                    className="form-input"
                  >
                    <option value="">-- Select Member --</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Photo File</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files[0])}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Caption</label>
                  <input
                    type="text"
                    value={photoForm.caption}
                    onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Alt Text (SEO)</label>
                  <input
                    type="text"
                    value={photoForm.alt_text}
                    onChange={(e) => setPhotoForm({ ...photoForm, alt_text: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group checkbox-group" style={{ display: 'flex', gap: '20px', gridColumn: 'span 2' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="checkbox"
                      checked={photoForm.is_cover}
                      onChange={(e) => setPhotoForm({ ...photoForm, is_cover: e.target.checked })}
                    />
                    Is Family Cover Photo
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="checkbox"
                      checked={photoForm.is_featured}
                      onChange={(e) => setPhotoForm({ ...photoForm, is_featured: e.target.checked })}
                    />
                    Is Featured Photo
                  </label>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button type="button" variant="outline" onClick={() => setPhotoModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}

      {/* Add Video Modal */}
      {videoModalOpen && (
        <Modal onClose={() => setVideoModalOpen(false)}>
          <Modal.Header>Add Video</Modal.Header>
          <Modal.Body>
            <form onSubmit={handleVideoSubmit} className="admin-form">
              {error && <div className="form-error">{error}</div>}

              <div className="form-grid">
                <div className="form-group">
                  <label>Family</label>
                  <select
                    value={videoForm.family_id}
                    onChange={(e) => setVideoForm({ ...videoForm, family_id: e.target.value })}
                    required
                    className="form-input"
                  >
                    {families.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Belongs to Member</label>
                  <select
                    value={videoForm.member_id}
                    onChange={(e) => setVideoForm({ ...videoForm, member_id: e.target.value })}
                    required
                    className="form-input"
                  >
                    <option value="">-- Select Member --</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.full_name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Video Source</label>
                  <select
                    value={videoForm.type}
                    onChange={(e) => setVideoForm({ ...videoForm, type: e.target.value })}
                    className="form-input"
                  >
                    <option value="upload">Upload Local Video (MP4)</option>
                    <option value="youtube">YouTube Link</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Video Title</label>
                  <input
                    type="text"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>

                {videoForm.type === 'youtube' ? (
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>YouTube URL</label>
                    <input
                      type="url"
                      value={videoForm.youtube_url}
                      onChange={(e) => setVideoForm({ ...videoForm, youtube_url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                      className="form-input"
                    />
                  </div>
                ) : (
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Local MP4 Video File</label>
                    <input
                      type="file"
                      accept="video/mp4"
                      onChange={(e) => setVideoFile(e.target.files[0])}
                      required
                      className="form-input"
                    />
                  </div>
                )}

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Description</label>
                  <textarea
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    rows={3}
                    className="form-textarea"
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={videoForm.is_featured}
                      onChange={(e) => setVideoForm({ ...videoForm, is_featured: e.target.checked })}
                    />
                    Featured Video
                  </label>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button type="button" variant="outline" onClick={() => setVideoModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </Modal.Body>
        </Modal>
      )}

      {/* QR Code Preview Modal */}
      {qrModalOpen && qrPreviewData && (
        <Modal onClose={() => setQrModalOpen(false)}>
          <Modal.Header>QR Code Preview</Modal.Header>
          <Modal.Body style={{ textAlign: 'center', padding: '20px' }}>
            <h3 style={{ color: '#0F172A', marginBottom: '4px' }}>{qrPreviewData.member.full_name}</h3>
            <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '20px' }}>
              Redirect Link: <a href={qrPreviewData.url} target="_blank" rel="noreferrer" style={{ color: '#D4AF37', textDecoration: 'underline' }}>{qrPreviewData.url}</a>
            </p>
            <div style={{ padding: '15px', backgroundColor: '#F8FAFC', borderRadius: '8px', display: 'inline-block', border: '1px dashed #D4AF37', marginBottom: '20px' }}>
              <img 
                src={qrPreviewData.qrDataUrl} 
                alt="QR Code" 
                style={{ width: '220px', height: '220px', display: 'block' }} 
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <Button variant="outline" onClick={() => setQrModalOpen(false)}>Close</Button>
              <a href={qrPreviewData.qrDataUrl} download={`qr-${qrPreviewData.member.slug}.png`}>
                <Button>Download PNG</Button>
              </a>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default AdminMedia;

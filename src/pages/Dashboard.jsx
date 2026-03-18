import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import UploadZone from '../components/dashboard/UploadZone';
import FileGrid from '../components/dashboard/FileGrid';
import StatsOverview from '../components/dashboard/StatsOverview';
import FileListTable from '../components/dashboard/FileListTable';
import FileDetailModal from '../components/dashboard/FileDetailModal';
import AccessRequests from '../components/dashboard/AccessRequests';
import API_BASE_URL from '../api/apiConfig';
import Docs from '../components/dashboard/Docs';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeView, setActiveView] = useState('overview');
    const [files, setFiles] = useState([]);
    const [usedStorage, setUsedStorage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Modal State
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleFileClick = (file) => {
        setSelectedFile(file);
        setIsModalOpen(true);
    };

    const handleDeleteFile = async (id) => {
        if (!window.confirm('Are you sure you want to delete this file?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/files/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                fetchFiles();
            } else {
                const data = await response.json();
                alert(data.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    const fetchFiles = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/files`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setFiles(data);

                // Calculate total used storage
                const total = data.reduce((acc, file) => acc + (file.sizeBytes || 0), 0);
                setUsedStorage(total);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadFile = async (file) => {
        if (!file) return;
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                fetchFiles();
            } else {
                const data = await response.json();
                alert(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('An error occurred during upload');
        } finally {
            setIsUploading(false);
        }
    };

    // Route Protection and Initial Fetch
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
            fetchFiles();
        }
    }, [navigate]);

    const filteredFiles = files.filter(file => {
        const matchesFilter = activeFilter === 'all' || file.category === activeFilter;
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const displayedFiles = activeView === 'overview' ? filteredFiles.slice(0, 8) : filteredFiles;

    if (!user) return null; // Prevent flash of content before redirect

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-dark)' }}>

            {/* Sidebar Navigation (Left Panel) - Relative container for floating toggle */}
            <Sidebar
                user={user}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                activeView={activeView}
                onViewChange={setActiveView}
                usedStorage={usedStorage}
            />

            {/* Main Interface (Right Panel) */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <TopHeader
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onUploadFile={handleUploadFile}
                    isUploading={isUploading}
                />

                {/* Scrollable Content Area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                        {activeView === 'overview' ? (
                            <>
                                <UploadZone
                                    onUploadFile={handleUploadFile}
                                    isUploading={isUploading}
                                />

                                {/* Controls Bar: Filter and View Toggle */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1.5rem',
                                    gap: '1rem',
                                    flexWrap: 'wrap'
                                }}>
                                    {/* Filter Pill Box */}
                                    <div style={{
                                        display: 'flex',
                                        background: 'var(--bg-card)',
                                        padding: '0.25rem',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-color)',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}>
                                        {[
                                            { label: 'All Files', value: 'all' },
                                            { label: 'PDFs', value: 'pdf' },
                                            { label: 'Images', value: 'image' },
                                            { label: 'Documents', value: 'document' }
                                        ].map(f => (
                                            <div
                                                key={f.value}
                                                onClick={() => setActiveFilter(f.value)}
                                                style={{
                                                    padding: '0.45rem 1rem',
                                                    background: activeFilter === f.value ? 'white' : 'transparent',
                                                    border: activeFilter === f.value ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: activeFilter === f.value ? 600 : 500,
                                                    color: activeFilter === f.value ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                                    cursor: 'pointer',
                                                    boxShadow: activeFilter === f.value ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}
                                            >
                                                {f.label}
                                            </div>
                                        ))}
                                    </div>

                                    {/* View Toggle */}
                                    <div style={{ display: 'flex', gap: '0.5rem', padding: '0.25rem', background: 'var(--bg-card)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            style={{
                                                background: viewMode === 'grid' ? 'white' : 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: viewMode === 'grid' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                                padding: '0.4rem',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                                transition: 'all 0.2s'
                                            }}
                                            title="Grid View"
                                        >
                                            <LayoutGrid size={18} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            style={{
                                                background: viewMode === 'list' ? 'white' : 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: viewMode === 'list' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                                padding: '0.4rem',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                                transition: 'all 0.2s'
                                            }}
                                            title="List View"
                                        >
                                            <List size={18} />
                                        </button>
                                    </div>
                                </div>

                                {viewMode === 'grid' ? (
                                    <FileGrid
                                        files={displayedFiles}
                                        isLoading={isLoading}
                                        onFileClick={handleFileClick}
                                        onDelete={handleDeleteFile}
                                    />
                                ) : (
                                    <FileListTable
                                        files={displayedFiles}
                                        onRefresh={fetchFiles}
                                        isLoading={isLoading}
                                        onFileClick={handleFileClick}
                                        onDelete={handleDeleteFile}
                                    />
                                )}
                            </>
                        ) : activeView === 'all-files' ? (
                            <>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Storage Overview</h1>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Manage your files and monitor your storage usage.</p>
                                </div>
                                <StatsOverview files={files} usedStorage={usedStorage} />
                                <FileListTable files={files} onRefresh={fetchFiles} isLoading={isLoading} onFileClick={handleFileClick} onDelete={handleDeleteFile} />
                            </>
                        ) : activeView === 'recent' ? (
                            <>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Recent Files</h1>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Quickly access your most recently opened and uploaded content.</p>
                                </div>
                                <FileListTable files={files.slice(0, 5)} onRefresh={fetchFiles} isLoading={isLoading} onFileClick={handleFileClick} onDelete={handleDeleteFile} />
                            </>
                        ) : activeView === 'docs' ? (
                            <Docs />
                        ) : null}

                    </div>
                </div>
            </main>

            {/* File Detail Modal */}
            <FileDetailModal
                file={selectedFile}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={user}
                onRefresh={fetchFiles}
            />
            <style>{`
                /* Hide scrollbar for Chrome, Safari and Opera */
                main > div::-webkit-scrollbar {
                    display: none;
                }

                /* Hide scrollbar for IE, Edge and Firefox */
                main > div {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
};

export default Dashboard;

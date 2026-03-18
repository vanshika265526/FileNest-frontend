import { Users, FileText, Database, TrendingUp } from 'lucide-react';

const StatsOverview = ({ files = [], usedStorage = 0 }) => {
    const formatSize = (bytes) => {
        if (bytes === 0) return '0 GB';
        const gb = bytes / (1024 * 1024 * 1024);
        if (gb < 0.1) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
        return gb.toFixed(1) + ' GB';
    };

    const stats = [
        {
            label: 'Total Files',
            value: files.length.toLocaleString(),
            trend: 'Live',
            icon: <FileText size={16} />,
            color: 'var(--accent-primary)',
            bg: 'rgba(255,122,0,0.1)'
        },
        {
            label: 'Storage Used',
            value: formatSize(usedStorage),
            limit: '/ 15 GB',
            trend: ((usedStorage / (15 * 1024 * 1024 * 1024)) * 100).toFixed(1) + '%',
            icon: <Database size={16} />,
            color: '#10B981',
            bg: 'rgba(16,185,129,0.1)'
        }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {stats.map((stat, index) => (
                <div key={index} style={{
                    background: 'var(--bg-card)',
                    padding: '1.25rem',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: stat.bg,
                            color: stat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {stat.icon}
                        </div>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#10B981',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            background: 'rgba(16,185,129,0.1)',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '20px'
                        }}>
                            <TrendingUp size={12} /> {stat.trend}
                        </div>
                    </div>

                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.15rem' }}>{stat.label}</div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</div>
                            {stat.limit && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{stat.limit}</span>}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsOverview;

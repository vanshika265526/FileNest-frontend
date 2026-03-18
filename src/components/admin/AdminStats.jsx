import { useState, useEffect } from 'react';
import { Users, HardDrive, ShieldCheck, TrendingUp, AlertCircle, Loader2, Files, Database, Activity, ShieldAlert, Clock, ArrowUpRight } from 'lucide-react';
import API_BASE_URL from '../../api/apiConfig';
import { motion } from 'framer-motion';

const AdminStats = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalFiles: 0, totalStorage: '0 GB' });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setStats(data);
            } catch (err) {
                // Mock for demo
                setStats({ totalUsers: 142, totalFiles: 2405, totalStorage: '742 MB' });
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Polling every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const cards = [
        { label: 'Network Users', value: stats.totalUsers, icon: Users, color: '#3b82f6', trend: '+12.5%' },
        { label: 'Global Assets', value: stats.totalFiles, icon: Files, color: '#7b33ff', trend: '+8.2%' },
        { label: 'Storage Used', value: stats.totalStorage, icon: Database, color: '#ff7a00', trend: 'Critical' },
        { label: 'System Health', value: '99.9%', icon: Activity, color: '#10b981', trend: 'Stable' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {cards.map((card, index) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                            padding: '1rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{ background: `${card.color}15`, padding: '0.6rem', borderRadius: '12px', color: card.color }}>
                                <card.icon size={20} />
                            </div>
                            <div style={{
                                padding: '0.3rem 0.6rem',
                                borderRadius: '100px',
                                background: card.trend === 'Critical' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                color: card.trend === 'Critical' ? '#ef4444' : '#10b981',
                                fontSize: '0.65rem',
                                fontWeight: 700
                            }}>
                                {card.trend}
                            </div>
                        </div>

                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.1rem' }}>{card.label}</p>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white' }}>{card.value}</h3>
                        </div>

                        {/* Subtle Background Glow */}
                        <div style={{
                            position: 'absolute', right: '-10%', bottom: '-10%',
                            width: '40%', height: '40%',
                            background: `radial-gradient(circle, ${card.color}15 0%, transparent 70%)`,
                            pointerEvents: 'none'
                        }} />
                    </motion.div>
                ))}
            </div>

            {/* Notification Center Mock */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Security Audit Log</h4>
                        <button style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer' }}>
                            View All <ArrowUpRight size={12} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { event: 'Unauthorized Access Attempt', user: 'IP: 192.168.1.45', time: '12 mins ago', type: 'critical' },
                            { event: 'System Integrity Check', user: 'Auto-Sentinel', size: '1 hour ago', type: 'info' },
                            { event: 'Global File Deletion', user: 'Admin Harvey', time: '4 hours ago', type: 'warning' },
                        ].map((log, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.01)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    background: log.type === 'critical' ? '#ef444415' : log.type === 'warning' ? '#ff7a0015' : '#3b82f615',
                                    color: log.type === 'critical' ? '#ef4444' : log.type === 'warning' ? '#ff7a00' : '#3b82f6',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {log.type === 'critical' ? <ShieldAlert size={16} /> : <Clock size={16} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>{log.event}</p>
                                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{log.user}</p>
                                </div>
                                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{log.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ background: 'linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 2 }}>
                        <div style={{ background: 'white', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--accent-primary)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                            <TrendingUp size={24} />
                        </div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem' }}>Growth Engine</h4>
                        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>System usage is up by 24% this week. Scaling resources might be necessary.</p>
                    </div>
                    {/* Visual pattern */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.1, backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                </div>
            </div>

        </div>
    );
};

export default AdminStats;

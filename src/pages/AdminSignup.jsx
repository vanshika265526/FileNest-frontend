import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from '../api/apiConfig';
import { Target, Lock, ArrowLeft, ShieldCheck, Mail, User, Loader2, AlertCircle, Key, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSignup = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Check if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (token && user.role === 'admin') {
            navigate('/admin-dashboard');
        } else if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    useEffect(() => {
        // Only 1 admin allowed, disable signup
        navigate('/admin-login');
    }, [navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role: 'admin' })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Registration failed');

            console.log('Registration Response:', data);

            // On success, save token and redirect
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ fullName: data.fullName, email: data.email, role: data.role }));
            window.location.href = '/admin-dashboard';
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#0a0a0b', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>

            {/* Dark Tech Background */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'radial-gradient(circle at top right, rgba(255,122,0,0.08) 0%, transparent 40%), radial-gradient(circle at bottom left, rgba(123,51,255,0.12) 0%, transparent 50%)',
                zIndex: 1
            }} />

            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                zIndex: 1
            }} />

            {/* Back Button */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
                <Link to="/admin-login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'white'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
                    <ArrowLeft size={16} />
                    Portal Entry
                </Link>
            </div>

            {/* Signup Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(40px)',
                    WebkitBackdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '28px',
                    padding: '3rem',
                    width: '100%',
                    maxWidth: '480px',
                    zIndex: 10,
                    boxShadow: '0 40px 80px -15px rgba(0,0,0,0.7)',
                    margin: '2rem 0'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <motion.div
                        initial={{ rotate: 10 }}
                        animate={{ rotate: 0 }}
                        style={{ background: 'var(--accent-primary)', padding: '1.25rem', borderRadius: '20px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(255,122,0,0.3)' }}>
                        <ShieldCheck size={32} color="white" />
                    </motion.div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem', textAlign: 'center' }}>Admin Provisioning</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '0.9rem' }}>Initialize new administrator credentials.</p>
                </div>

                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                color: '#ff4d4d', fontSize: '0.85rem', background: 'rgba(255, 77, 77, 0.1)',
                                padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem',
                                border: '1px solid rgba(255, 77, 77, 0.2)'
                            }}>
                            <AlertCircle size={18} />
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }}>
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Commanding Officer"
                                style={{
                                    width: '100%', padding: '0.85rem 1rem 0.85rem 3rem',
                                    borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Work Email</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }}>
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="officer@filenest.sys"
                                style={{
                                    width: '100%', padding: '0.85rem 1rem 0.85rem 3rem',
                                    borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>Set Admin Password</label>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }}>
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                style={{
                                    width: '100%', padding: '0.85rem 3.5rem 0.85rem 3rem',
                                    borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.3)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>



                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{
                            width: '100%', padding: '1rem', marginTop: '1rem',
                            fontWeight: 600, fontSize: '0.95rem', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                            opacity: loading ? 0.7 : 1
                        }}>
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Provisioning...
                            </>
                        ) : (
                            <>
                                Initialize Admin
                                <Target size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
                        System resources are monitored.<br />Authorized personnel only beyond this point.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminSignup;

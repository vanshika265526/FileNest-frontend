import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API_BASE_URL from '../api/apiConfig';
import AuthLayout from '../components/AuthLayout';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Login failed');

            // On success, save token and redirect
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ fullName: data.fullName, email: data.email }));
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };
    return (
        <AuthLayout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                style={{ padding: '0 1rem' }}
            >
                <motion.h1 variants={itemVariants} style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Welcome to FileNest</motion.h1>
                <motion.p variants={itemVariants} style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Join the high-performance architectural teams.</motion.p>

                <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                    <button className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>Sign In</button>
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                        <button className="btn btn-outline" style={{ width: '100%', padding: '0.75rem', border: 'none', background: 'transparent' }}>Create Account</button>
                    </Link>
                </motion.div>

                <motion.form variants={itemVariants} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {error && <div style={{ color: '#ef4444', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px' }}>{error}</div>}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Work Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@company.com"
                            style={{
                                width: '100%', padding: '0.85rem 1rem',
                                borderRadius: '8px', border: '1px solid var(--border-color)',
                                background: 'transparent', color: 'var(--text-primary)', outline: 'none'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="........"
                                style={{
                                    width: '100%', padding: '0.85rem 1rem',
                                    borderRadius: '8px', border: '1px solid var(--border-color)',
                                    background: 'transparent', color: 'var(--text-primary)', outline: 'none'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Signing in...' : 'Sign In to Dashboard'}
                    </button>
                </motion.form>
            </motion.div>
        </AuthLayout>
    );
};

export default Login;

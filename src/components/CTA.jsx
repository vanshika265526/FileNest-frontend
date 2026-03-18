import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CTA = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/signup', { state: { email } });
    };

    return (
        <section style={{ padding: '4rem 0', position: 'relative' }}>
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                    style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}
                >
                    <h2>Ready to take control?</h2>
                    <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                        Join 10,000+ users who trust FileNest for their daily file management.
                    </p>

                    <div className="glass-card" style={{
                        display: 'flex',
                        padding: '0.35rem',
                        position: 'relative',
                        borderRadius: '16px'
                    }}>
                        <input
                            type="email"
                            placeholder="Enter your work email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                padding: '0 1rem',
                                color: 'var(--text-primary)',
                                outline: 'none',
                                fontSize: '0.95rem'
                            }}
                        />
                        <button
                            onClick={handleGetStarted}
                            className="btn btn-primary"
                            style={{ padding: '0.75rem 1.5rem', height: '100%' }}
                        >
                            Get Early Access
                        </button>
                    </div>

                    <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '0.5rem' }}>
                        No credit card required. Cancel anytime.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
    return (
        <section id="pricing" style={{ padding: '80px 0', borderTop: '1px solid rgba(0,0,0,0.05)', position: 'relative' }}>

            {/* Background Glow */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '600px', height: '400px',
                background: 'radial-gradient(circle, rgba(123,51,255,0.08) 0%, rgba(255,255,255,0) 70%)',
                filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none'
            }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                    <h2>Simple, transparent pricing</h2>
                    <p style={{ marginTop: '1rem' }}>No hidden fees. Choose the plan that fits your needs.</p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'center' }}>

                    {/* Free Tier */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, type: 'spring', bounce: 0.4, delay: 0.1 }}
                        className="card"
                        style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2.5rem 2rem' }}
                    >
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Free</div>
                        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)' }}>$0</span>
                            <span style={{ color: 'var(--text-secondary)' }}>/mo</span>
                        </div>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Perfect for individual storage</p>

                        <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                            <FeatureItem text="15GB Secure Storage" />
                            <FeatureItem text="Basic Smart Sharing" />
                            <FeatureItem text="Email Support" />
                        </div>

                        <Link to="/signup" style={{ textDecoration: 'none' }}>
                            <button className="btn btn-outline" style={{ width: '100%' }}>
                                Get Started
                            </button>
                        </Link>
                    </motion.div>

                    {/* Pro Tier (can be used later for paid upgrades, currently informational only) */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, type: 'spring', bounce: 0.4, delay: 0.2 }}
                        className="card"
                        style={{
                            display: 'flex', flexDirection: 'column', height: '105%', padding: '3rem 2rem',
                            border: '1px solid rgba(123,51,255,0.3)',
                            position: 'relative',
                            background: '#FFFFFF',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.08), 0 0 40px rgba(123,51,255,0.1)'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-secondary)', color: 'white', padding: '0.35rem 1rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap', boxShadow: '0 4px 10px rgba(123,51,255,0.4)' }}>
                            MOST POPULAR
                        </div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Future Pro</div>
                        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)' }}>$12</span>
                            <span style={{ color: 'var(--text-secondary)' }}>/mo</span>
                        </div>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>For power users and creators</p>

                        <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                            <FeatureItem text="1TB Secure Storage" highlighted />
                            <FeatureItem text="Advanced Permissions" highlighted />
                            <FeatureItem text="Priority 24/7 Support" highlighted />
                            <FeatureItem text="Custom Branded Links" highlighted />
                        </div>

                        <Link to="/signup" style={{ textDecoration: 'none' }}>
                            <button className="btn btn-primary" style={{ width: '100%' }}>
                                Upgrade Now
                            </button>
                        </Link>
                    </motion.div>

                    {/* Enterprise Tier */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, type: 'spring', bounce: 0.4, delay: 0.3 }}
                        className="card"
                        style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2.5rem 2rem' }}
                    >
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enterprise</div>
                        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Custom</span>
                        </div>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>Scalable solutions for teams</p>

                        <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                            <FeatureItem text="Unlimited Storage" />
                            <FeatureItem text="SSO & Admin Panel" />
                            <FeatureItem text="Compliance Reports" />
                        </div>

                        <button className="btn btn-outline" style={{ width: '100%' }}>
                            Contact Sales
                        </button>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

const FeatureItem = ({ text, highlighted = false }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <CheckCircle2 size={18} color={highlighted ? "var(--accent-secondary)" : "var(--text-secondary)"} />
        <span style={{ fontSize: '0.9rem', color: highlighted ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: highlighted ? 500 : 400 }}>{text}</span>
    </div>
);

export default Pricing;

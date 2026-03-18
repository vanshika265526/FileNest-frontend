import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CTA from '../components/CTA';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Animated Background Layers */}
            <div className="mesh-gradient-container">
                <div className="mesh-gradient"></div>
            </div>
            <div className="grid-overlay"></div>

            <Navbar />
            <main style={{ flex: 1 }}>
                <Hero />
                <CTA />
                <Features />
                <Pricing />
            </main>
            <Footer />
        </div>
    );
};

export default Home;

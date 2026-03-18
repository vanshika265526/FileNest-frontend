export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

export const getFileUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url; // S3 absolute URL
    return `${API_BASE_URL}${url}`; // Local relative URL (e.g., /uploads/...)
};

export default API_BASE_URL;

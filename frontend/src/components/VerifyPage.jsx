import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './VerifyPage.css';

const API_BASE = 'http://localhost:5000';

function VerifyPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No token found in the link. Please request a new magic link.');
      return;
    }

    axios.get(`${API_BASE}/api/auth/verify?token=${token}`, { withCredentials: true })
      .then(() => {
        setStatus('success');
        setMessage('You\'re signed in! Redirecting to your dashboard...');
        setTimeout(() => { window.location.href = '/'; }, 2000);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Something went wrong. Please request a new magic link.');
      });
  }, [searchParams]);

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-icon">
          {status === 'verifying' && '⏳'}
          {status === 'success' && '✅'}
          {status === 'error' && '❌'}
        </div>
        <h1 className="verify-title">
          {status === 'verifying' && 'Verifying your link...'}
          {status === 'success' && 'Signed in!'}
          {status === 'error' && 'Link invalid'}
        </h1>
        <p className="verify-message">{message}</p>
        {status === 'error' && (
          <a href="/login" className="verify-back-btn">Back to login</a>
        )}
      </div>
    </div>
  );
}

export default VerifyPage;
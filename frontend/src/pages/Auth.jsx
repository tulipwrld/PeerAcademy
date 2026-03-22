import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Auth.css';

const AuthPage = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');

    const fetchUserData = async () => {
      try {
        if (code) {
          const response = await fetch('/api/auth/google/callback', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ code }),
          });

          setTimeout(() => {
            navigate('/profile');
          });

        } else {
          setMessage('Use Google OAuth');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Ошибка:', error);
        setMessage(`⚠️ Ошибка авторизации: ${error.message}`);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google/url';
  };

  return (
    <div className="high-skill-container">
      <Link to="/" className="back-link">← На главную</Link>
      <div className="container">
        {isLoading ? (
          <h1 className="loading-text">Обработка авторизации...</h1>
        ) : (
          <>
            {message && (
              <div className={`message ${message.includes('⚠️') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
            
            {!message.includes('success') && (
              <button onClick={handleGoogleLogin} className="google-login-btn">
                Войти через Google
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;

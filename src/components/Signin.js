import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'; // Optional: For password hashing

function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }

    try {
      // Read users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Find the user
      const user = users.find((user) => user.username === username);

      if (!user) {
        setError('Invalid credentials');
        setLoading(false);
        return;
      }

      // Compare hashed password (optional but recommended)
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        setError('Invalid credentials');
        setLoading(false);
        return;
      }

      // Store user data in localStorage
      localStorage.setItem('authToken', JSON.stringify(user));
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      console.error('Signin Error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundImage: 'url("https://source.unsplash.com/1600x900/?technology,login")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    formContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      width: '100%',
      maxWidth: '400px',
      zIndex: 1,
      textAlign: 'center',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      marginBottom: '1rem',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '16px',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
      transform: 'scale(1.02)',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
      transform: 'none',
    },
    error: {
      color: '#dc3545',
      fontSize: '14px',
      marginBottom: '1rem',
    },
    loading: {
      color: '#007bff',
      marginTop: '1rem',
    },
    link: {
      marginTop: '1rem',
      color: '#007bff',
      textDecoration: 'none',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Sign In</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSignin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = styles.buttonHover.backgroundColor;
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = styles.button.backgroundColor;
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        {loading && <p style={styles.loading}>Loading...</p>}
        <p style={styles.link} onClick={() => navigate('/signup')}>
          Don't have an account? Sign Up
        </p>
      </div>
    </div>
  );
}

export default Signin;
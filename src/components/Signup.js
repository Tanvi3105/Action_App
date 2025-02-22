import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'; // Optional: For password hashing

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Username and password are required');
      setLoading(false);
      return;
    }

    try {
      // Read existing users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Check if the username already exists
      const userExists = users.some((user) => user.username === username);
      if (userExists) {
        setError('Username already exists');
        setLoading(false);
        return;
      }

      // Hash the password (optional but recommended)
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Add the new user
      const newUser = { username, password: hashedPassword };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Automatically log in the user
      localStorage.setItem('authToken', JSON.stringify(newUser));
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      console.error('Signup Error:', err);
      setError('Signup failed. Please try again.');
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
      backgroundImage: 'url("https://source.unsplash.com/1600x900/?technology,signup")',
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
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    buttonHover: {
      backgroundColor: '#218838',
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
        <h2 style={styles.title}>Signup</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSignup}>
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
            {loading ? 'Signing Up...' : 'Signup'}
          </button>
        </form>
        {loading && <p style={styles.loading}>Loading...</p>}
        <p style={styles.link} onClick={() => navigate('/signin')}>
          Already have an account? Sign In
        </p>
      </div>
    </div>
  );
}

export default Signup;
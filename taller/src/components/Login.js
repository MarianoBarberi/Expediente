import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setError(null); // Clear any previous errors
      const response = await fetch('https://expediente.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          login(data.token);
          navigate('/home');
        } else {
          setError('Token not provided by the server');
        }
      } else if (response.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please try again later.');
    }
  };
  
  

  return (
    <div>
      <h1>Login Page</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;

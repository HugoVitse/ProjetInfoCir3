import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors
    if (!email || !password) {
      setError('Please fill in both fields');
      return;
    }

    setLoading(true); // Set loading state

    try {
      const response = await axios.post('https://localhost/login', {email: email,password: password});
      console.log(response.data);
      if (response.status == 200) {
        alert('Login successful!');
        // Redirect to another page or perform other actions on successful login
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('There was an error logging in!', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <a href="/signup">Don't have an account? Sign Up</a>
      </div>
    </div>
  );
}

export default Login;

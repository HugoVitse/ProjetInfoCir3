import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://localhost/register', formData);
      console.log(response.data);
      alert(response.data);
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1>Sign Up</h1>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>First Name:</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          <label>Last Name:</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          <label>Date of Birth:</label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          <button type="submit" disabled={loading}>Sign Up</button>
        </form>
        <a href="/login">Already have an account? Login</a>
      </div>
    </div>
  );
}

export default SignUp;

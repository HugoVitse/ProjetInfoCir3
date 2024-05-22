import React from 'react';
import './SignUp.css';

function SignUp() {
  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1>Sign Up</h1>
        <form>
          <label>First Name:</label>
          <input type="text" name="firstName" />
          <label>Last Name:</label>
          <input type="text" name="lastName" />
          <label>Date of Birth:</label>
          <input type="date" name="dateOfBirth" />
          <label>Email:</label>
          <input type="email" name="email" />
          <label>Password:</label>
          <input type="password" name="password" />
          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" />
          <button type="submit">Sign Up</button>
        </form>
        <a href="/login">Already have an account? Login</a>
      </div>
    </div>
  );
}

export default SignUp;

import React from 'react';
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <form>
          <label>Email:</label>
          <input type="email" name="email" />
          <label>Password:</label>
          <input type="password" name="password" />
          <button type="submit">Login</button>
        </form>
        <a href="/signup">Don't have an account? Sign Up</a>
      </div>
    </div>
  );
}

export default Login;

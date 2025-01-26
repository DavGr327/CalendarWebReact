import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import '../styles/auth.css';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Accesso riuscito!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Registrazione riuscita!');
      }
    } catch (error) {
      alert(`Errore: ${error.message}`);
    }
  };

  const logout = async () => {
    await signOut(auth);
    alert('Sei uscito!');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login Form</h2>

        <div className="auth-tabs">
          <button
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            Signup
          </button>
        </div>

        <input
          type="email"
          className="auth-input"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="auth-input"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          className="auth-forgot" 
          onClick={() => alert('Reimpostazione password non implementata')}
        >
          Forgot password?
        </button>

        <button className="auth-button" onClick={handleAuth}>
          {isLogin ? 'Login' : 'Signup'}
        </button>

        <p className="auth-signup">
          {isLogin ? 'Not a member?' : 'Already a member?'} 
          <button className="auth-link-button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Signup now' : ' Login'}
          </button>
        </p>

        <button className="auth-button" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

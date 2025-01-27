import React, { useState, useEffect } from 'react';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Controlla lo stato di autenticazione
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        navigate('/calendar');  // Se l'utente è loggato, reindirizza
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup
  }, [navigate]);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Accesso riuscito!');
        navigate('/calendar');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Registrazione riuscita!');
        navigate('/calendar');
      }
    } catch (error) {
      alert(`Errore: ${error.message}`);
    }
  };

  const logout = async () => {
    await signOut(auth);
    alert('Sei uscito!');
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{user ? `Benvenuto, ${user.email}` : 'Login Form'}</h2>

        {!user ? (
          <>
            <div className="auth-tabs">
              <button className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
              <button className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>Signup</button>
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

            <button className="auth-button" onClick={handleAuth}>
              {isLogin ? 'Login' : 'Signup'}
            </button>
          </>
        ) : (
          <button className="auth-button" onClick={logout}>Logout</button>
        )}
      </div>
    </div>
  );
}

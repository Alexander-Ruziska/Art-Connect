import { useState, useEffect } from 'react';
import useStore from '../../zustand/store';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const register = useStore((state) => state.register);
  const errorMessage = useStore((state) => state.authErrorMessage);
  const setAuthErrorMessage = useStore((state) => state.setAuthErrorMessage);

  useEffect(() => {
    // Clear the auth error message when the component unmounts:
    return () => {
      setAuthErrorMessage('');
    };
  }, [setAuthErrorMessage]);

  const handleRegister = (event) => {
    event.preventDefault();

    register({
      username: username,
      password: password,
      is_artist: role === 'artist',
      is_organization: role === 'organization',
    });
  };

  return (
    <>
      <h2>Register Page</h2>
      <form onSubmit={handleRegister}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="role">User Type:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select User Type</option>
          <option value="artist">Artist</option>
          <option value="organization">Organization</option>
        </select>
        <button type="submit">
          Register
        </button>
      </form>
      { // Conditionally render registration error:
        errorMessage && (
          <h3>{errorMessage}</h3>
        )
      }
    </>
  );
}

export default RegisterPage;

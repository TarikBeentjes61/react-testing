import { useState, useEffect } from 'react';
import useApiHandler from '../useApiHandler';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const { request: post, error }  = useApiHandler('users/register', 'POST');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const result = await post({ username, password });
    if (result) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      window.dispatchEvent(new Event('authChanged'));
      navigate('/home');
    }
  };
  useEffect(() => {
    if (error) setMessage(error);
  }, [error]);

  return (
      <div className="p-8 text-black dark:text-white">
      <form className="max-w-sm mx-auto" onSubmit={handleSubmit}>
        <div className="mb-5">
          <label for="username" className="block mb-2 text-sm font-medium">Username</label>
          <input
            className="bg-gray-150 border border-gray-400 text-sm rounded-lg block w-full p-2.5 dark:text-black"
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label for="password" className="block mb-2 text-sm font-medium">Password</label>
          <input
            className="bg-gray-150 border border-gray-400 text-sm rounded-lg block w-full p-2.5 dark:text-black"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label for="password" className="block mb-2 text-sm font-medium">Confirm Password</label>
          <input
            className="bg-gray-150 border border-gray-400 text-sm rounded-lg block w-full p-2.5 dark:text-black"
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-start mb-5">
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg
             text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Register
          </button>
        </div>
        {message && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setMessage('')}>
            X
          </span>
        </div>
        )}
      </form>
    </div>
  );
}

export default RegisterForm;

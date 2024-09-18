import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "https://mern-food-bl34.onrender.com/api/v1/login",
      {
        email,
        password,
      },
      {
        withCredentials: true, // This ensures cookies (like JWT) are sent
      }
    );
    console.log(response.data);
    navigate("/"); // Redirect to home after successful login
  } catch (error) {
    setError(error.response?.data?.message || error.message);
  }
};


  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-4 p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:ring-1 dark:ring-gray-700">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
          Sign in to your account
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
            to="/signup"
          >
            register for a new account
          </Link>
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Link
              to={"//www.google.com"}
              className="flex justify-center items-center p-2 bg-gray-100 hover:bg-gray-200 rounded-lg mb-10 mt-4 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <FaGoogle className="h-5 w-5 text-red-600" />
              <span className=" text-sm text-gray-700 dark:text-gray-200">
                oogle
              </span>
            </Link>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="email"
            >
              Email address
            </label>
            <div className="mt-1">
              <input
                autoComplete="email"
                className="rounded-lg w-full p-2 bg-gray-50 border border-gray-300 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                id="email"
                name="email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor="password"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                autoComplete="current-password"
                className="rounded-lg w-full p-2 bg-gray-50 border border-gray-300 focus:ring focus:ring-blue-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                id="password"
                name="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                id="remember-me"
                name="remember-me"
                type="checkbox"
              />
              <label
                className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                htmlFor="remember-me"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
                to="#"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <div>
            <button
              className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
              type="submit"
            >
              Sign in
            </button>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignIn;

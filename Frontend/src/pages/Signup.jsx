import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import axios from "axios"; // Ensure axios is imported

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setgender] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password === confirmPassword) {
        console.log([name, email, password]);
        const response = await axios.post("/api/v1/register", {
          name,
          email,
          password,
          gender,
        });
        console.log(response.data);
        navigate("/signin")
      } else {
        setError("Passwords do not match!");
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex pb-6 h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Register for a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
              to="/signin"
            >
              Sign in
            </Link>
          </p>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800 dark:ring-1 dark:ring-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="grid grid-cols-1 gap-3 mb-6">
                <button
                  type="button"
                  className="flex items-center justify-center p-2 bg-white rounded-lg"
                >
                  <FaGoogle className="h-5 w-5 text-red-600" />
                  <span>oogle</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
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
                htmlFor="name"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  autoComplete="name"
                  className="rounded-lg w-full p-1"
                  id="name"
                  name="name"
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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
                  className="rounded-lg w-full p-1"
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
                  autoComplete="new-password"
                  className="rounded-lg w-full p-1"
                  id="password"
                  name="password"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="confirm-password"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  autoComplete="new-password"
                  className="rounded-lg w-full p-1"
                  id="confirm-password"
                  name="confirm-password"
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="gender"
              >
                Gender
              </label>
              <div className="mt-1">
                <select
                  className="rounded-lg w-full p-1"
                  id="gender"
                  name="gender"
                  required
                  value={gender}
                  onChange={(e) => setgender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="submit"
              >
                Register
              </button>
              <span className="text-xs text-red-400 ml-2 ">
                * By continuing, you accept our terms and conditions
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

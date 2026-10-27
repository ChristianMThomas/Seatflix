import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, { ButtonSpinner } from "../components/AuthShell";
import { useAuth } from "../context/AuthContext";
import api, { endpoints } from "../api";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoints.login, credentials);

      if (response.status === 200 && response.data.token) {
        const userData = {
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email,
        };

        login(response.data.token, userData);
        navigate("/home");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else {
        setError("An error occurred. Please try again later.");
      }
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      aside={
        <div className="max-w-xl">
          <p className="eyebrow mb-5">
            <span className="w-6 h-px bg-brand" />
            Now showing
          </p>
          <h2 className="font-display font-normal text-6xl xl:text-7xl leading-[0.95] text-white">
            The lights are dimming. <em className="text-brand">Take your seat.</em>
          </h2>
          <p className="text-lg text-light-200 mt-6 max-w-md">
            Thousands of films and series, waiting right where you left them.
          </p>
        </div>
      }
    >
      <h1 className="text-5xl sm:text-6xl mb-2">Welcome back</h1>
      <p className="text-light-200 mb-8">Sign in to pick up right where you left off.</p>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Username input */}
        <div className="relative">
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
            autoComplete="username"
            className="field"
            placeholder="Username"
          />
          <label htmlFor="username" className="field-label">Username</label>
        </div>

        {/* Password input */}
        <div className="relative">
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            className="field"
            placeholder="Password"
          />
          <label htmlFor="password" className="field-label">Password</label>
        </div>

        {/* Error message */}
        {error && (
          <div className="alert-error">
            <svg className="w-5 h-5 text-ember shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
            </svg>
            <p className="text-white text-sm">{error}</p>
          </div>
        )}

        {/* Login button */}
        <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
          {loading ? (
            <>
              <ButtonSpinner />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between text-sm pt-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 accent-brand" />
            <span className="text-light-200 group-hover:text-white transition-colors">
              Remember me
            </span>
          </label>
          <a href="#" className="text-light-200 hover:text-white hover:underline transition-colors">
            Forgot Password?
          </a>
        </div>
      </form>

      {/* Register link */}
      <p className="text-gray-100 mt-12">
        New to SeatFlix?{" "}
        <Link to="/register" className="text-brand font-semibold hover:underline">
          Sign up now.
        </Link>
      </p>
    </AuthShell>
  );
};

export default Login;

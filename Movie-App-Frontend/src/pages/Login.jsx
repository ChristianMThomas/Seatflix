import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-primary relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center animate-fade-in">
        {/* Left side - Branding */}
        <div className="text-center md:text-left space-y-6 order-2 md:order-1">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent animate-slide-in-left">
              SeatFlix
            </h1>
            <p className="text-2xl md:text-3xl text-light-200 font-light animate-slide-in-left delay-200">
              Your premium streaming experience
            </p>
          </div>

          <div className="hidden md:block">
            <img
              src="LoginImage.png"
              alt="Login illustration"
              className="w-full max-w-md mx-auto md:mx-0 drop-shadow-2xl animate-float"
            />
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="order-1 md:order-2 animate-slide-in-right">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                <p className="text-light-200">Sign in to continue streaming</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Username input */}
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-light-200 block">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                    placeholder="Enter your username"
                  />
                </div>

                {/* Password input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-light-200 block">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                    placeholder="Enter your password"
                  />
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                    />
                    <span className="text-light-200 group-hover:text-white transition-colors">
                      Remember me
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 animate-shake">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                {/* Login button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Register link */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-light-200">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline"
                  >
                    Register today
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

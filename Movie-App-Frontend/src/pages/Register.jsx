import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { endpoints } from "../api";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post(endpoints.register, {
        username,
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (error.response?.data) {
        setError(typeof error.response.data === 'string'
          ? error.response.data
          : 'Registration failed. Please try again.');
      } else {
        setError("Registration failed. Please try again.");
      }
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center animate-fade-in">
        {/* Left side - Registration form */}
        <div className="order-1 animate-slide-in-left">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Join SeatFlix</h2>
                <p className="text-light-200">Create your account and start streaming</p>
              </div>

              {success ? (
                <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-6 text-center space-y-3 animate-slide-in-up">
                  <svg
                    className="w-16 h-16 text-green-400 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-green-400">
                    Registration Successful!
                  </h3>
                  <p className="text-green-300">Redirecting to login...</p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-5">
                  {/* Username input */}
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium text-light-200 block">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                      placeholder="Choose a username (min 3 characters)"
                    />
                  </div>

                  {/* Email input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-light-200 block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                      placeholder="Enter your email"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/15"
                      placeholder="Create a password (min 6 characters)"
                    />
                  </div>

                  {/* Terms and conditions */}
                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                    />
                    <label htmlFor="terms" className="text-sm text-light-200">
                      I agree to the{" "}
                      <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 animate-shake">
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                  )}

                  {/* Register button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
                        Creating account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
              )}

              {/* Login link */}
              <div className="text-center pt-4 border-t border-white/10">
                <p className="text-light-200">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline"
                  >
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Branding & Image */}
        <div className="text-center md:text-left space-y-6 order-2 animate-slide-in-right">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-600 bg-clip-text text-transparent">
              Ready to get started?
            </h1>
            <p className="text-xl md:text-2xl text-light-200 font-light">
              Join thousands of movie lovers streaming their favorite content
            </p>
          </div>

          <div className="hidden md:block">
            <img
              src="signup.png"
              alt="Sign up illustration"
              className="w-full max-w-md mx-auto md:mx-0 rounded-2xl shadow-2xl border-2 border-purple-500/30 animate-float"
            />
          </div>

          {/* Features list */}
          <div className="space-y-3 hidden md:block">
            <div className="flex items-center space-x-3 text-light-200">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Unlimited access to premium content</span>
            </div>
            <div className="flex items-center space-x-3 text-light-200">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>High-quality streaming experience</span>
            </div>
            <div className="flex items-center space-x-3 text-light-200">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Personalized recommendations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

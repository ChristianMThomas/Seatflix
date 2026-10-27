import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell, { ButtonSpinner } from "../components/AuthShell";
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

  const perks = [
    "Unlimited access to premium content",
    "High-quality streaming experience",
    "Personalized recommendations",
  ];

  return (
    <AuthShell
      aside={
        <div className="max-w-xl">
          <p className="eyebrow mb-5">
            <span className="w-6 h-px bg-brand" />
            Free admission
          </p>
          <h2 className="font-display font-normal text-6xl xl:text-7xl leading-[0.95] text-white">
            Unlimited movies, shows, <em className="text-brand">and more.</em>
          </h2>
          <p className="text-lg text-light-200 mt-6">
            Join thousands of movie lovers streaming their favorite content.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-light-100">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand/15 border border-brand/40 shrink-0">
                  <svg className="w-3.5 h-3.5 text-brand" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <h1 className="text-5xl sm:text-6xl mb-2">Get your ticket</h1>
      <p className="text-light-200 mb-8">Ready to watch? Set up your account in seconds.</p>

      {success ? (
        <div className="text-center space-y-3 py-6 animate-slide-in-up">
          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15 mx-auto">
            <svg className="w-9 h-9 text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <h3 className="text-xl font-semibold text-white">Registration Successful!</h3>
          <p className="text-light-200">Redirecting to sign in...</p>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Username input */}
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              autoComplete="username"
              className="field"
              placeholder="Username"
            />
            <label htmlFor="username" className="field-label">Username (min 3 characters)</label>
          </div>

          {/* Email input */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="field"
              placeholder="Email address"
            />
            <label htmlFor="email" className="field-label">Email address</label>
          </div>

          {/* Password input */}
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className="field"
              placeholder="Password"
            />
            <label htmlFor="password" className="field-label">Password (min 6 characters)</label>
          </div>

          {/* Terms and conditions */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 w-4 h-4 accent-brand"
            />
            <label htmlFor="terms" className="text-sm text-light-200">
              I agree to the{" "}
              <a href="#" className="text-brand hover:underline">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-brand hover:underline">Privacy Policy</a>
            </label>
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

          {/* Register button */}
          <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
            {loading ? (
              <>
                <ButtonSpinner />
                Creating account...
              </>
            ) : (
              "Get Started"
            )}
          </button>
        </form>
      )}

      {/* Login link */}
      <p className="text-gray-100 mt-10">
        Already have an account?{" "}
        <Link to="/login" className="text-brand font-semibold hover:underline">
          Sign in.
        </Link>
      </p>
    </AuthShell>
  );
};

export default Register;

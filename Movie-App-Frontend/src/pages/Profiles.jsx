import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api, { endpoints } from "../api";

function Profile() {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found.");
      setLoading(false);
      return;
    }

    api
      .get(`${endpoints.getUser}/${userId}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Failed to load profile data");
        setLoading(false);
      });
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setUploadLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Don't manually set Content-Type - let browser set it with boundary
      // The axios interceptor will automatically add the Authorization header
      const res = await api.post(`${endpoints.uploadAvatar}`, formData);
      setUser(res.data);
      setAvatarPreview(null);
      setError(null);
    } catch (err) {
      console.error("Upload failed:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);

      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError(err.response?.data || "Avatar upload failed. Please try again.");
      }
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-light-200 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/50 rounded-2xl p-8 text-center max-w-md animate-shake">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      {/* Background Pattern */}
      <div className="pattern opacity-30" />

      <div className="wrapper py-12">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-light-200 mt-2">Manage your account settings</p>
          </div>

          {/* Profile Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl animate-slide-in-up">
            {user && (
              <div className="grid md:grid-cols-3 gap-8 items-start">
                {/* Left - Avatar Section */}
                <div className="md:col-span-1 space-y-4">
                  <div className="relative group">
                    <label className="cursor-pointer block">
                      <div className="relative overflow-hidden rounded-2xl border-4 border-purple-500/30 group-hover:border-purple-500/60 transition-all duration-300">
                        <img
                          src={
                            avatarPreview ||
                            (user.profilePic ? `${import.meta.env.VITE_SEATFLIX_API_URL}${user.profilePic}` : "user.png")
                          }
                          alt="Profile"
                          className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="text-center text-white">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <p className="text-sm font-semibold">Change Photo</p>
                          </div>
                        </div>
                        {/* Upload loading indicator */}
                        {uploadLoading && (
                          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                            <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        disabled={uploadLoading}
                      />
                    </label>
                  </div>

                  {/* Upload button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadLoading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {uploadLoading ? "Uploading..." : "Upload New Photo"}
                  </button>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3">
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                  )}
                </div>

                {/* Right - User Information */}
                <div className="md:col-span-2 space-y-6">
                  <div className="space-y-4">
                    {/* Username */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                      <label className="text-sm font-medium text-light-200 block mb-2">
                        Username
                      </label>
                      <p className="text-white text-lg font-semibold">{user.username}</p>
                    </div>

                    {/* Email */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                      <label className="text-sm font-medium text-light-200 block mb-2">
                        Email Address
                      </label>
                      <p className="text-white text-lg font-semibold">{user.email}</p>
                    </div>

                    {/* Join Date */}
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4">
                      <label className="text-sm font-medium text-light-200 block mb-2">
                        Member Since
                      </label>
                      <p className="text-white text-lg font-semibold">
                        {user.dateJoined || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-white/10">
                    <button
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
                    >
                      Reset Password
                    </button>

                    <button
                      onClick={logout}
                      className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info Section */}
          <div className="mt-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 animate-slide-in-up delay-200">
            <h3 className="text-xl font-semibold text-white mb-4">Account Activity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <p className="text-3xl font-bold text-purple-400">0</p>
                <p className="text-light-200 text-sm mt-1">Movies Watched</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <p className="text-3xl font-bold text-pink-400">0</p>
                <p className="text-light-200 text-sm mt-1">Favorites</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <p className="text-3xl font-bold text-blue-400">0</p>
                <p className="text-light-200 text-sm mt-1">Watchlist</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Profile;

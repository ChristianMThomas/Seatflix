import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api, { endpoints } from "../api";
import Spinner from "../components/Spinner";
import { tmdb, img } from "../tmdb";
import { avatarUrl, prepareAvatar } from "../avatar";

function Profile() {
  const { logout, user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);
  const [banner, setBanner] = useState(null);
  const fileInputRef = useRef();

  // Keep the navbar avatar in sync with the server copy
  const syncAuthAvatar = (profilePic) => {
    if (authUser && authUser.profilePic !== profilePic) {
      updateUser({ ...authUser, profilePic });
    }
  };

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
        syncAuthAvatar(res.data.profilePic);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        setError("Failed to load profile data");
        setLoading(false);
      });
  }, []);

  // Decorative banner: a random backdrop from this week's trending titles
  useEffect(() => {
    tmdb("/trending/all/week")
      .then((data) => {
        const withBackdrops = data.results.filter((item) => item.backdrop_path);
        const pick = withBackdrops[Math.floor(Math.random() * withBackdrops.length)];
        setBanner(pick?.backdrop_path || null);
      })
      .catch(() => setBanner(null));
  }, []);

  const uploadAvatar = async (file) => {
    if (!file || uploadLoading) return;
    setError(null);

    let blob;
    try {
      blob = await prepareAvatar(file);
    } catch (err) {
      setError(err.message);
      return;
    }

    const previewUrl = URL.createObjectURL(blob);
    setAvatarPreview(previewUrl);
    setUploadLoading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", blob, "avatar.jpg");

    try {
      // Don't manually set Content-Type - let browser set it with boundary
      // The axios interceptor will automatically add the Authorization header
      const res = await api.post(`${endpoints.uploadAvatar}`, formData, {
        onUploadProgress: (e) => e.total && setUploadProgress(Math.round((e.loaded / e.total) * 100)),
      });
      setUser(res.data);
      syncAuthAvatar(res.data.profilePic);
      setError(null);
    } catch (err) {
      console.error("Upload failed:", err);
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);

      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (err.response?.status === 413) {
        setError("That image is too large. Please choose a smaller one.");
      } else {
        setError(typeof err.response?.data === "string" ? err.response.data : "Avatar upload failed. Please try again.");
      }
    } finally {
      setAvatarPreview(null);
      URL.revokeObjectURL(previewUrl);
      setUploadLoading(false);
    }
  };

  const handleFileChange = (e) => {
    uploadAvatar(e.target.files[0]);
    e.target.value = ""; // allow re-selecting the same file
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    uploadAvatar(e.dataTransfer.files[0]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Loading profile..." />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="panel border-ember/40 p-8 text-center max-w-md animate-shake">
          <svg className="w-14 h-14 text-ember mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-light-200">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Movies Watched", value: 0 },
    { label: "Favorites", value: 0 },
    { label: "Watchlist", value: 0 },
  ];

  return (
    <main className="relative min-h-screen">
      {/* Banner */}
      <div className="absolute inset-x-0 top-0 h-[380px] sm:h-[460px] overflow-hidden">
        {banner ? (
          <img src={img(banner, "w1280")} alt="" className="w-full h-full object-cover animate-ken-burns animate-fade-in" />
        ) : (
          <img src="/hero-bg.png" alt="" className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-primary/40" />
        <div className="absolute inset-0 scrim-bottom" />
      </div>

      <div className="wrapper">
        {user && (
          <div className="w-full max-w-5xl mx-auto pt-32 sm:pt-48 animate-slide-in-up">
            {/* Identity */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-10">
              <div className="relative shrink-0">
                <label
                  className={`group block ${uploadLoading ? "cursor-wait" : "cursor-pointer"}`}
                  title="Change avatar"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <div
                    className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 bg-gradient-to-br from-brand via-ember to-brand/30 transition-all duration-300 ${
                      dragging
                        ? "scale-105 shadow-[0_0_80px_-5px_rgb(var(--brand-rgb)/0.9)]"
                        : "shadow-[0_0_60px_-10px_rgb(var(--brand-rgb)/0.6)]"
                    }`}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-surface-2 ring-4 ring-primary">
                      <img
                        src={avatarPreview || avatarUrl(user.profilePic)}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Hover / drag affordance */}
                      {!uploadLoading && (
                        <div
                          className={`absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 text-white text-xs font-bold transition-opacity ${
                            dragging ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.6l1.4-2h7l1.4 2h1.6A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-9Z" />
                            <circle cx="12" cy="13" r="3.5" />
                          </svg>
                          {dragging ? "Drop to upload" : "Change"}
                        </div>
                      )}

                      {/* Upload progress ring */}
                      {uploadLoading && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <svg className="absolute inset-2 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
                            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                            <circle
                              cx="50"
                              cy="50"
                              r="46"
                              fill="none"
                              stroke="var(--color-brand)"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray={289}
                              strokeDashoffset={289 - (289 * uploadProgress) / 100}
                              className="transition-[stroke-dashoffset] duration-200"
                            />
                          </svg>
                          <span className="text-white font-bold text-sm" role="status">
                            {uploadProgress < 100 ? `${uploadProgress}%` : "Saving…"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    disabled={uploadLoading}
                  />
                </label>
              </div>

              <div className="min-w-0 pb-2">
                <p className="eyebrow mb-2">
                  <span className="w-6 h-px bg-brand" />
                  Your account
                </p>
                <h1 className="truncate">{user.username}</h1>
                {user.dateJoined && (
                  <p className="text-light-200 mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    Member since {user.dateJoined}
                  </p>
                )}
              </div>

              <div className="sm:ml-auto flex gap-3 pb-2">
                <button className="btn-secondary">Reset Password</button>
                <button onClick={logout} className="btn-primary">Sign Out</button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-5 mb-8">
              {stats.map(({ label, value }) => (
                <div key={label} className="panel relative overflow-hidden p-5 sm:p-7 group">
                  <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-brand/10 blur-2xl transition-opacity opacity-50 group-hover:opacity-100" />
                  <p className="relative font-display text-5xl sm:text-7xl text-white leading-none">{value}</p>
                  <p className="relative text-light-200 text-xs sm:text-sm mt-2">{label}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-[1.4fr_1fr] gap-5 items-start">
              {/* Details */}
              <div className="panel">
                <h2 className="px-6 pt-6 pb-2 font-display text-3xl font-normal">Details</h2>
                <dl className="divide-y divide-white/5">
                  {[
                    { label: "Username", value: user.username },
                    { label: "Email Address", value: user.email },
                    { label: "Member Since", value: user.dateJoined || "N/A" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-6 py-4">
                      <dt className="text-sm text-gray-100">{label}</dt>
                      <dd className="text-white font-semibold break-all">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Avatar */}
              <div className="panel p-6 space-y-4">
                <h2 className="font-display text-3xl font-normal">Avatar</h2>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadLoading}
                  className="btn-primary w-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0-4 4m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  </svg>
                  {uploadLoading ? "Uploading…" : "Upload new photo"}
                </button>

                <p className="text-xs text-light-200 leading-relaxed">
                  Click or drag an image onto your avatar. JPG, PNG or WebP up to 15 MB. It's cropped to a
                  square and location data is removed before upload.
                </p>

                {error && (
                  <div className="alert-error" role="alert">
                    <p className="text-white text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Profile;

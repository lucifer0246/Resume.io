import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import useAuthStore from "../../store/userStore";
import { resumeAPI } from "../../API/API";
import authAPI from "../../API/API";

export default function SettingsPage() {
  const { user } = useAuthStore();

  // Slug state
  const [slug, setSlug] = useState("abcd");
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  // ---------------- Helper: Get Active Slug ----------------
  const fetchSlugFromResumes = async () => {
    try {
      const res = await resumeAPI.getUserResumes(); // GET /resume/
      const resumes = res.data; // array of resumes
      const anyResume = resumes[0]; // just grab first (all share same slug)
      const resumeSlug = anyResume?.slug || "abcd";
      setSlug(resumeSlug);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
      toast.error("Failed to fetch resumes");
      setSlug("abcd");
    }
  };

  // ---------------- Auto-fetch active slug on mount ----------------
  useEffect(() => {
    fetchSlugFromResumes();
  }, []);

  // ---------------- Save Resume Slug ----------------
  const handleSaveUrl = async () => {
    const trimmedSlug = slug.trim();
    if (!trimmedSlug) {
      toast.error("Slug cannot be empty");
      return;
    }

    try {
      await resumeAPI.updateActiveSlug(trimmedSlug);
      toast.success("Resume URL updated!");
      // fetch latest active slug after update
      await fetchSlugFromResumes();
      setIsEditingUrl(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update slug");
    }
  };

  // ---------------- Password Section (untouched) ----------------
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await authAPI.changePassword(currentPassword, newPassword);
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-background flex flex-col items-center p-6 overflow-hidden"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-8 space-y-8 overflow-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500">Manage your account</p>
        </div>

        {/* User info */}
        <div className="space-y-3">
          <p className="text-gray-700">
            <strong>Username:</strong> {user?.username || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Email:</strong> {user?.email || "N/A"}
          </p>
        </div>

        {/* Resume slug */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Active Resume URL
          </h2>
          {isEditingUrl ? (
            <div className="flex gap-2 items-center">
              <span className="text-gray-700">
                myresume.io/{user?.username}/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSaveUrl}
                disabled={!slug.trim()}
                className={`px-4 py-2 rounded-md transition ${
                  !slug.trim()
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditingUrl(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p className="text-gray-700">
                myresume.io/{user?.username}/{slug}
              </p>
              <button
                onClick={() => setIsEditingUrl(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Edit
              </button>
            </div>
          )}
        </div>

        {/* Password section (unchanged) */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Security Settings
          </h2>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="w-full py-3 bg-gray-100 rounded-md hover:bg-gray-200 transition"
          >
            {showPasswordForm ? "Hide Change Password" : "Change Password"}
          </button>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="space-y-3 mt-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

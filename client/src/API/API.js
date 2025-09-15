import axios from "axios";
import useAuthStore from "../store/userStore";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// ================= Axios Request Interceptor =================
API.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= Axios Response Interceptor =================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only clear auth if backend explicitly says "Unauthorized"
    if (
      error.response?.status === 401 &&
      error.response?.data?.error === "Unauthorized"
    ) {
      useAuthStore.getState().setAuth({ user: null, token: null });
    }
    return Promise.reject(error);
  }
);

// ================= Public API (no auth) =================
const publicAPI = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false, // no cookies or auth headers
});

// ================= Auth API =================
const authAPI = {
  register: (username, email, password) =>
    API.post("/api/auth/register", { username, email, password }),

  login: (email, password) => API.post("/api/auth/login", { email, password }),

  logout: () => API.post("/api/auth/logout"),

  checkAuth: () => API.get("/api/auth/me"),

  // ---------- Live check if username/email exists ----------
  checkUserExists: (query) => API.get(`/api/auth/check-user?query=${query}`),

  // ---------- Change Password ----------
  changePassword: (currentPassword, newPassword) =>
    API.put("/api/auth/change-password", { currentPassword, newPassword }),

  //---------------otp ----------------
  sendOtp: (email) => API.post("/api/otp/send", { email }),
  verifyOtp: (email, otp) => API.post("/api/otp/verify", { email, otp }),
  resendOtp: (email) => API.post("/api/otp/resend", { email }),
};

const resumeAPI = {
  // Private
  uploadResume: (formData, onUploadProgress) =>
    API.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    }),
  getUserResumes: () => API.get("/resume/"),
  setActiveResume: (resumeId) => API.put(`/resume/active/${resumeId}`),
  deleteResume: (resumeId) => API.delete(`/resume/${resumeId}`),
  downloadResume: (resumeId) => API.get(`/resume/download/${resumeId}`),

  updateActiveSlug: (slug) => API.put("/resume/slug", { slug }),

  // Public
  getPublicResume: (username) => publicAPI.get(`/public/${username}`),

  checkResumeSlug: (username, slug) =>
    publicAPI.get(`/public/check/${username}/${slug}`),
};

export default authAPI;
export { API, resumeAPI, publicAPI };

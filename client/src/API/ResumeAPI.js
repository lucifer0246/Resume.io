import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // send cookies for auth
});

// Request interceptor for auth token (if you use JWT)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // store JWT in localStorage
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Resume API methods
const resumeAPI = {
  uploadResume: (formData) => API.post("/resume/upload", formData),
  getUserResumes: () => API.get("/resume/"),
  setActiveResume: (resumeId) => API.put(`/resume/active/${resumeId}`),
  deleteResume: (resumeId) => API.delete(`/resume/${resumeId}`),
  downloadResume: (resumeId) => API.get(`/resume/download/${resumeId}`),
};

// ✅ Export both
export { API, resumeAPI };

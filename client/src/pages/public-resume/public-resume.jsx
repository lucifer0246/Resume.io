import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { resumeAPI } from "../../API/API";
import PublicResumeCard from "../../components/public-resume/resumeCard";
import { FiExternalLink } from "react-icons/fi";

export default function PublicResume() {
  const { username } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchResume() {
      try {
        setLoading(true);
        const { data } = await resumeAPI.getPublicResume(username);
        setResume(data);
      } catch (err) {
        console.error("❌ Failed to fetch public resume:", err);
        setError("Resume not found or unavailable.");
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, [username]);

  if (loading)
    return (
      <p className="text-center mt-10 text-[var(--muted-foreground)]">
        Loading resume...
      </p>
    );
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!resume) return null;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[var(--dashboard-bg)]">
      {/* Left: Resume Card */}
      <div className="w-full lg:w-2/3 flex justify-center lg:items-center p-6">
        <PublicResumeCard resume={resume} />
      </div>

      {/* Right: Promotion */}
      <div className="w-full lg:w-1/3 h-screen bg-[var(--primary)] text-white rounded-l-2xl shadow-lg p-10 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4 text-center lg:text-left">
          Discover More at MyResume.io
        </h2>
        <p className="text-white/90 mb-6 text-center lg:text-left text-lg">
          Create, upload, and share your professional resumes in a secure and
          beautifully designed platform. Join thousands of users already
          benefiting from MyResume.io.
        </p>
        <div className="flex justify-center lg:justify-start mb-6">
          <a
            href="https://www.myresume.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            <FiExternalLink /> Visit MyResume.io
          </a>
        </div>
        <p className="text-white/80 text-center lg:text-left text-sm">
          Share your public resume link with employers and recruiters easily.
        </p>
      </div>
    </div>
  );
}

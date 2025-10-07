import React, { useState } from "react";
//eslint-disable-next-line
import { motion } from "framer-motion";
import ResumeTiles from "../../components/upload-view/resume-tiles";
import { useResumes } from "../../hook/useResumes";
import { resumeAPI } from "../../API/API";

export default function UploadResume() {
  const { data: resumes = [], isLoading, isError, refetch } = useResumes();
  const [previewResume, setPreviewResume] = useState(null);

  // ------------------- Handlers -------------------
  const handleSetActive = async (resume) => {
    try {
      await resumeAPI.setActiveResume(resume._id);
      refetch();
    } catch (err) {
      console.error("Failed to set active resume", err);
    }
  };

  const handlePreview = (resume) => setPreviewResume(resume);
  const handleDelete = async (resume) => {
    try {
      await resumeAPI.deleteResume(resume._id);
      refetch();
    } catch (err) {
      console.error("Failed to delete resume", err);
    }
  };

  const closePreview = () => setPreviewResume(null);

  // ------------------- Render -------------------
  if (isLoading)
    return (
      <p className="p-6 text-[var(--muted-foreground)]">Loading resumes...</p>
    );
  if (isError)
    return <p className="p-6 text-red-500">Failed to load resumes.</p>;

  return (
    <div className="space-y-6 p-6 bg-[var(--dashboard-bg)] min-h-screen">
      {/* Header */}
      <div className="space-y-2 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Your Uploaded Resumes
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] text-center">
          Manage your resumes. Set one as active, preview, or delete.
        </p>
      </div>

      {/* Resume Tiles */}
      {resumes.length === 0 ? (
        <p className="text-[var(--muted-foreground)] text-center mt-6">
          No resumes uploaded yet. Upload one to get started!
        </p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <ResumeTiles
              key={resume._id}
              resume={resume}
              onSetActive={handleSetActive}
              onPreview={handlePreview}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewResume && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closePreview}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-[var(--card)] rounded-lg shadow-xl w-11/12 md:w-3/4 lg:w-1/2 h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Preview – {previewResume.originalName}
              </h2>
              <button
                onClick={closePreview}
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Iframe */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewResume.url}
                title="Resume Preview"
                className="w-full h-full bg-[var(--card)]"
                style={{ border: "none" }}
              ></iframe>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

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

  const handlePreview = (resume) => {
    setPreviewResume(resume); // open modal
  };

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
  if (isLoading) return <p className="p-6">Loading resumes...</p>;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load resumes.</p>;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Your Uploaded Resumes
        </h1>
        <p className="text-sm text-gray-500">
          Manage your resumes. Set one as active, preview, or delete.
        </p>
      </div>

      {/* Resume Tiles */}
      {resumes.length === 0 ? (
        <p className="text-gray-400 text-center mt-6">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={closePreview} // ✅ Close on outside click
        >
          <div
            className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()} // ✅ Prevent closing when clicking inside modal
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                Preview – {previewResume.originalName}
              </h2>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Iframe */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewResume.url}
                title="Resume Preview"
                className="w-full h-full"
                style={{ border: "none" }}
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";
//eslint-disable-next-line
import { motion } from "framer-motion";
import { resumeAPI } from "../../API/API"; // make sure you're using resumeAPI
import CheckoutButton from "../../components/dashboard/payment";

export default function UploadPage() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: (formData) =>
      resumeAPI.uploadResume(formData, (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percent); // update %
      }),
    onMutate: () => {
      setUploading(true);
      setUploadProgress(0); // reset before new upload
    },
    onSuccess: () => {
      toast.success("Resume uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Upload failed!");
    },
    onSettled: () => {
      setUploading(false);
      setUploadProgress(0); // reset after upload complete
    },
  });

  // ================= Handle Upload =================
  const handleUpload = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    uploadMutation.mutate(formData);
  };

  // ================= Dropzone Setup =================
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: handleUpload,
    multiple: false,
    noClick: true, // prevent clicking the box from opening picker
    noKeyboard: true,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
    },
    disabled: uploading,
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-8"
      >
        {/* Headline */}
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Share Your Resume in Seconds
        </h1>
        <p className="text-center text-gray-500">
          Drag & drop your resume or click the button below to upload.
        </p>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Upload", desc: "Drag & drop a PDF or DOCX file." },
            { title: "Customize", desc: "Type a link-name or leave it blank." },
            { title: "Publish", desc: "Get a shareable link instantly." },
          ].map((step, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center p-4 bg-gray-50 rounded-xl shadow-sm"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold mb-2">
                {i + 1}
              </div>
              <h3 className="font-semibold text-gray-800">{step.title}</h3>
              <p className="text-sm text-gray-500 text-center mt-1">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* File restriction note */}
        <p className="text-center text-sm text-gray-400">
          Accepted formats: PDF or DOCX. Maximum file size: 5MB.
        </p>

        {/* Upload area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors duration-300
    ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}
    ${uploading ? "opacity-80" : "cursor-pointer"}
  `}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div className="space-y-2">
              <p>Uploading... {uploadProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            "Drag & drop your resume here, or click the button below"
          )}
        </div>

        {/* Upload button → only opens picker */}
        <button
          type="button"
          onClick={open}
          disabled={uploading}
          className="w-1/2 mx-auto block py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Choose Resume"}
        </button>

        <CheckoutButton />

        {/* Footer encouragement */}
        <p className="text-center text-gray-500 text-sm">
          You can upload multiple resumes and choose your active one anytime.
          <br />
          Your files remain private until you share them.
        </p>
      </motion.div>
    </div>
  );
}

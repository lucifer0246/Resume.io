import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";
//eslint-disable-next-line
import { motion } from "framer-motion";
import { resumeAPI } from "../../API/API"; // ensure using resumeAPI
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
        setUploadProgress(percent);
      }),
    onMutate: () => {
      setUploading(true);
      setUploadProgress(0);
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
      setUploadProgress(0);
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
    noClick: true,
    noKeyboard: true,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
    },
    disabled: uploading,
  });

  return (
    <div className="min-h-screen bg-[var(--dashboard-bg)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-[var(--dashboard-bg)]] text-[var(--card-foreground)] rounded-2xl shadow-lg p-8 space-y-8"
      >
        {/* Headline */}
        <h1 className="text-4xl font-bold text-center text-[var(--foreground)]">
          Share Your Resume in Seconds
        </h1>
        <p className="text-center text-[var(--muted-foreground)]">
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
              className="flex flex-col items-center p-4 rounded-xl shadow-sm bg-[var(--dashboard-bg)]] border border-[var(--border)]"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-bold mb-2">
                {i + 1}
              </div>
              <h3 className="font-semibold text-[var(--foreground)]">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] text-center mt-1">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* File restriction note */}
        <p className="text-center text-sm text-[var(--muted-foreground)]">
          Accepted formats: PDF or DOCX. Maximum file size: 5MB.
        </p>

        {/* Upload area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors duration-300
            ${
              isDragActive
                ? "border-[var(--primary)] bg-[var(--primary)/10]"
                : "border-[var(--border)] bg-[var(--dashboard-bg)]"
            }
            ${uploading ? "opacity-80" : "cursor-pointer"}
          `}
        >
          <input {...getInputProps()} />

          {uploading ? (
            <div className="space-y-2">
              <p className="text-[var(--foreground)]">
                Uploading... {uploadProgress}%
              </p>
              <div className="w-full bg-[var(--muted)] rounded-full h-2">
                <div
                  className="bg-[var(--primary)] h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-[var(--muted-foreground)]">
              Drag & drop your resume here, or click the button below
            </p>
          )}
        </div>

        {/* Upload button → opens picker */}
        <button
          type="button"
          onClick={open}
          disabled={uploading}
          className="w-1/2 mx-auto block py-3 rounded-xl font-medium
            bg-[var(--primary)] text-[var(--primary-foreground)]
            hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Choose Resume"}
        </button>

        {/* Checkout / payment */}
        {/* <CheckoutButton /> */}

        {/* Footer encouragement */}
        <p className="text-center text-[var(--muted-foreground)] text-sm">
          You can upload multiple resumes and choose your active one anytime.
          <br />
          Your files remain private until you share them.
        </p>
      </motion.div>
    </div>
  );
}

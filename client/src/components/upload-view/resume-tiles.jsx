import { Eye, CheckCircle, Trash2 } from "lucide-react";

export default function ResumeTiles({
  resume,
  onSetActive,
  onPreview,
  onDelete,
}) {
  if (!resume) return null;

  const fileExt = resume.originalName
    ? resume.originalName.split(".").pop().toUpperCase()
    : "N/A";

  return (
    <div className=" rounded-lg p-4 shadow-sm bg-blue-100">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800 truncate">
          {resume.originalName}
        </h3>
        <span className="text-xs bg-white px-2 py-0.5 rounded">{fileExt}</span>
      </div>

      <div className="flex gap-2">
        {/* Preview button */}
        <button
          onClick={() => onPreview(resume)}
          className="flex items-center gap-1 bg-blue-600 text-white rounded-md px-2 py-1 text-xs hover:bg-blue-700"
        >
          <Eye size={14} />
          <span>Preview</span>
        </button>

        {/* Set Active */}
        <button
          onClick={() => onSetActive(resume)}
          className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs ${
            resume.isActive
              ? "bg-green-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <CheckCircle size={14} />
          <span>{resume.isActive ? "Active" : "Set Active"}</span>
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(resume)}
          className="flex items-center gap-1 bg-red-500 text-white rounded-md px-2 py-1 text-xs hover:bg-red-600"
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
